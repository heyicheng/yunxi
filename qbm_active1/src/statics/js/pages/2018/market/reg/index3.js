define(function(require, exports, module) {

  require('zepto');
  require('fastclick');
  require('layer');
  require('layerCss');

  FastClick.attach(document.body);

  $(function() {

    //参数处理,获取用户id
    function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if (r != null) return unescape(r[2]);
      return null;
    }
    var wait = 60;//倒计时时间
    var App = function() {

      this.init();
      this.refreshCodeFun();//刷新图形验证码
      this.getCodeFun();//获取短信验证码
      this.regProtocolFun();//钱保姆注册协议
      this.regFun();//注册处理
      this.downApp();//下载APP

    };

    App.prototype = {
      init: function() {
        var self = this;

        //console.log("webUrl="+webUrl);
        //console.log("pcUrl="+pcUrl);

        var phoneSystem = "";//手机系统

        //判断手机系统
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
          phoneSystem = "ios";
        }else if (/(Android)/i.test(navigator.userAgent)) {
          phoneSystem = "Android";
        }else{
          phoneSystem = "other";
        }

        //加载图形验证码
        $("#vcode").attr("src", pcUrl + '/pcrimg.html');

        //初始化客户端系统及渠道来源
        var fromTypeVal = getUrlParam("fromType");
        if(fromTypeVal == null || fromTypeVal == undefined){
          fromTypeVal = ""
        }

        $("#fromType").val(fromTypeVal);
        $("#fromSource").val(phoneSystem);

      },
      countdownFun: function(){//倒计时
        console.log("countdownFun");
        var self = this;
        if (wait == 0) {
          $("#getCode").val("重发验证码").removeAttr("disabled").css({"color":"#333","background-color":"#fff"});
          wait = 6;
        }else{
          $("#getCode").val( wait +"秒后重试").attr("disabled", true).css({"color":"#333","background-color":"#b0b0b0"});
          wait--;
          setTimeout(function() {
            self.countdownFun();
          },1000)
        }
      },
      getCodeFun:function(){
        var self = this;
        var phoneTest = /^1[356789]\d{9}$/;

        //获取安全码
        var modulusVal = "",
            saltVal = "",
            publicExponent = "";
        $.ajax({
          url: pcUrl + '/security/getPubkey.html',
          type:"get",
          dataType:"JSONP",
          success:function(data){
            console.log(data);
            modulusVal = data.modulus;
            saltVal = data.salt;
            publicExponent = data.publicExponent;
          },
          error:function(){
            console.log('error');
          }
        });

        function bodyRSA(){
          setMaxDigits(130);
          key = new RSAKeyPair(publicExponent,"",modulusVal);
          console.log("key===="+key);
        }


        $(document).on("click","#getCode",function(){

          var flag = true;

          var phoneNo = $.trim($("#Phone").val()),
              imgCode = $.trim($("#imgCode").val()),
              verificationCode = $.trim($("#VerificationCode").val());

          //手机号验证
          if (!phoneNo || phoneNo.length != 11 || !(phoneTest.test(phoneNo))) {
            layer.open({
              type: 1,
              content: "请输入正确的手机号",
              skin: 'msg',
              time: 2,
              end:function(){
                $("#Phone").focus();
                //flag = false;
              }
            });
            return false;
          }

          //图形验证码
          if (!imgCode || imgCode.length != 4 ) {
            layer.open({
              type: 1,
              content: "请输入图形验证码",
              skin: 'msg',
              time: 2,
              end:function(){
                $("#imgCode").focus();
                flag = false;
              }
            });
            return false;
          }


          //短信验证码加密处理
          function getCode(sysTime){
            var usernameVal = $.trim($("#Phone").val()),
                verifyCode = $("#imgCode").val(),
                words = "phone:"+usernameVal+"&salt:"+saltVal+"&timestamp:"+ sysTime;

            bodyRSA();
            var encryptedCode = encryptedString(key,words);

            $.ajax({
                url:pcUrl+'/api/triggerSmsCode.html',
                type:"post",
                dataType:"JSON",
                xhrFields: {
                  withCredentials: true
                },
                data:{
                  Phone: usernameVal,
                  salt: saltVal,
                  timestamp: sysTime,
                  sign: encryptedCode,
                  verify: verifyCode
                },
                success:function(data){
                  self.getNewImgCodeFun();
                  if(data.result ){
                    self.countdownFun();
                    layer.open({
                      content: "验证码已经发送，请注意查收！",
                      skin: 'msg',
                      time: 2
                    });
                  }else{
                    layer.open({
                      content: data.msg,
                      skin: 'msg',
                      time: 2,
                      end:function(){
                        //发送失败重新刷新图形验证码
                        self.getNewImgCodeFun();
                        $("#VerificationCode").focus();
                      }
                    });
                  }
                },
                error: function() {
                  layer.open({
                    type: 1,
                    content: "网络请求失败，请稍后再试！",
                    skin: 'msg',
                    time: 2
                  });
                }
             });
          }


          if(flag){

            $.ajax({
              url: pcUrl + '/sys/queryServerTime.html',
              type:"get",
              dataType:"JSONP",
              success:function(data){
                getCode(data.systemTime)
              },
              error:function(){
                console.log('error');
              }
            });


            // $.ajax({
            //   url: pcUrl+'/api/GetPhoneRegCode.html',
            //   type:"get",
            //   dataType:"jsonp",
            //   data:{
            //     Phone: phoneNo,
            //     verify: imgCode
            //   },
            //   success:function(data){
            //     if(typeof data=="string"){
            //       data = $.parseJSON(data);
            //     }
            //     if(data.result){
            //       self.countdownFun();
            //       layer.open({
            //         content: "验证码已经发送，请注意查收！",
            //         skin: 'msg',
            //         time: 2
            //       });

            //     }else{
            //       layer.open({
            //         content: data.msg,
            //         skin: 'msg',
            //         time: 2,
            //         end:function(){
            //           //发送失败重新刷新图形验证码
            //           self.getNewImgCodeFun();
            //           $("#VerificationCode").focus();
            //         }
            //       });
            //     }
            //   },
            //   error: function() {
            //     layer.open({
            //       type: 1,
            //       content: "网络请求失败，请稍后再试！",
            //       skin: 'msg',
            //       time: 2
            //     });
            //   }
            // });


          }

        });

      },
      getNewImgCodeFun:function(){
        var self = this;

        var img = $("#vcode"),
            imgUrl = img.attr("src").split("?")[0],
            imgPath = imgUrl + "?" + Math.random();

        img.attr("src", imgPath);
      },
      refreshCodeFun:function(){
        var self = this;

        $(document).on("click","#vcode",function(){
          self.getNewImgCodeFun();
        });

      },
      regProtocolFun:function(){
        var self = this;

        $(document).on("click","#regProtocol",function(){
          location.href = pcUrl + "/apiurl/activity/2017/jiaribao/reg-protocol.html";

        });

      },
      regFun: function(){
        var self = this;

        var phoneTest = /^1[34578]\d{9}$/;

        

        $(document).on("click","#regBtn",function(){

          var flag = true;

          var phoneNo = $.trim($("#Phone").val()),
              imgCode = $.trim($("#imgCode").val()),
              verificationCode = $.trim($("#VerificationCode").val()),
              password = $.trim($("#password").val()),
              checkStauts = $("#checkStauts").get(0).checked;

          console.log(phoneNo.length);
          
          //手机号验证
          if (!phoneNo || phoneNo.length != 11 || !(phoneTest.test(phoneNo))) {
            layer.open({
              type: 1,
              content: "请输入正确的手机号",
              skin: 'msg',
              time: 2,
              end:function(){
                $("#Phone").focus();
                flag = false;
              }
            });
            return false;
          }

          //图形验证码
          if (!imgCode || imgCode.length != 4 ) {
            layer.open({
              type: 1,
              content: "请输入图形验证码",
              skin: 'msg',
              time: 2,
              end:function(){
                $("#imgCode").focus();
                flag = false;
              }
            });
            return false;
          }

          //短信验证码
          if (!verificationCode || verificationCode.length != 6 ) {
            layer.open({
              type: 1,
              content: "请输入短信验证码",
              skin: 'msg',
              time: 2,
              end:function(){
                $("#VerificationCode").focus();
                flag = false;
              }
            });
            return false;
          }

          //密码
          if (!password) {
            layer.open({
              type: 1,
              content: "请输入登录密码",
              skin: 'msg',
              time: 2,
              end:function(){
                $("#password").focus();
                flag = false;
              }
            });
            return false;
          }

          if (password.length < 6 || !(/(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{6,16})$/.test(password))) {
            layer.open({
              type: 1,
              content: "登录密码是6-16位数字与字母组合",
              skin: 'msg',
              time: 2 ,
              end:function(){
                $("#password").focus();
                flag = false;
              }
            });
            return false;
          }

          if(checkStauts != true){
            layer.open({
              type: 1,
              content: "请先阅读注册协议",
              skin: 'msg',
              time: 2 ,
              end:function(){
                flag = false;
              }
            });
            return false;
          }

          //提交注册信息
          if(flag){
            $.ajax({
              url: pcUrl+'/api/regs2.html',
              type:"get",
              dataType:"jsonp",
              data:{
                fromType: $("#fromType").val(),
                fromSource: $("#fromSource").val(),
                type: $("#type").val(), 
                username: phoneNo,
                verify: imgCode,
                VerificationCode: verificationCode,
                password: password
              },
              success:function(data){

                $("#regBtn").attr("disabled", true);

                if(typeof data=="string"){
                  data = $.parseJSON(data);
                }

                if(data.result){
                  //调用第三方跟踪代码 
                  _taq.push({convert_id:"88968189994", event_type:"form"});

                  //注册成功弹窗
                  layer.open({
                    className: "layer-tip",
                    content: '<div class="pos-rel tip-box fc-3"><span class="pos-abs tip-close"></span><h1 class="text-center">恭喜您注册成功！</h1><div class="text-center bd"><img src="'+pcCdnUrl+'/images/app/superAgent/reg-redbag.png"><p>获得<span>888元</span>红包</p><p>已放入您的账户</p></div><div class="pos-abs text-center fc-f tip-down-btn" id="downBtn">立即下载APP</div></div>',
                    shadeClose: false,
                    time: 0
                  });

                }else{
                  layer.open({
                    type: 1,
                    content: data.msg,
                    skin: 'msg',
                    time: 2,
                    end:function(){
                      self.getNewImgCodeFun();
                      $("#regBtn").removeAttr("disabled");
                    }
                  });
                }
              },
              error: function() {
                layer.open({
                  type: 1,
                  content: "网络请求失败，请稍后再试！",
                  skin: 'msg',
                  time: 2,
                  end:function(){
                    $("#regBtn").removeAttr("disabled");
                  }
                });
              }
            });            
          }


        });

        //关闭弹窗
        $(document).on("click",".tip-close",function(){
          window.location.reload();
        });

      },
      downApp:function(){
        var self = this,
            phoneOS = $("#fromSource").val(),
            fromType = $("#fromType").val();

        $(document).on("click","#downBtn",function(){
          if (phoneOS == "ios") {
            location.href = pcUrl +"/applink.html";
          }
          if (phoneOS == "Android") {
            location.href = "http://down.qbm360.com/tuiguang/qbm_" + fromType + ".apk";
          }
        });
      },

    };

  var app = new App();

  });
});

<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack" style="position:fixed"/>
    <img class="e-logo" src="../../assets/login/e-logo.png">
    <!-- <router-link :to="{path:'register'}">zhuce</router-link> -->
    <div class="div-container">
      <div class="van-group">
        <img class="input-icon" src="../../assets/login/ic_phone.png">
        <van-field
          v-model.trim="username"
          type="number"
          class="van-phone"
          placeholder="请输入手机号码"
          maxlength="11"
          clearable
          :oninput="setClickable()"
        />
      </div>

      <div class="van-group" style="margin-top:15px">
        <img class="input-icon" src="../../assets/login/ic_numer.png">
        <van-field
          style="padding:9.6px 0px 9.6px 14px"
          v-model.trim="code"
          clearable
          type="number"
          placeholder="请输入验证码"
          :oninput="setClickable()"
          maxlength="6"
        >
          <van-button
            slot="button"
            class="span-sendCode"
            type="default"
            :disabled="disabled"
            @click="onClickCode"
          >{{codeMsg}}</van-button>
        </van-field>
      </div>

      <div class="div-login">
        <van-button class="bt-login" block @click="onClickLogin" :disabled="isClickable">登录</van-button>
      </div>
      <div class="div-xieyi">
        <img style="width:14px;height:14px;float:left" src="../../assets/login/ic_attention.png">
        <span class="text-xieyi">
          未注册龙驹财行账号的手机，登录时将自动注册，且代表您已同意
          <router-link
            :to="{name:'activityDetail',  query: {
          path: xieyiUrl,
          title:'龙驹财行注册协议'
        }}"
          >《龙驹财行注册协议》</router-link>
        </span>
      </div>
    </div>
    <v-phone></v-phone>
  </div>
</template>
<script>
import { SendSmsCode, AccountFastLogin } from "@/api/login";
import { Toast } from "vant";
import ServicePhone from "../../components/layout/servicePhone";
import CommonUtils from "@/utils/public.js";

export default {
  components: {
    "v-phone": ServicePhone
  },
  data() {
    return {
      username: localStorage.getItem("phone")
        ? localStorage.getItem("phone")
        : "",
      code: "",
      codeMsg: "获取验证码",
      disabled: false,
      isClickable: true,
      xieyiUrl:
        process.env.VUE_APP_H5SERVER +
        "/p2ph5/person/protocol/protocol_register.html"
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    /* 登录 */
    onClickLogin() {
      if (!/^((1[0-9]))\d{9}$/.test(this.username)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      if (!/\d{6}$/.test(this.code)) {
        Toast("短信验证码格式有误，请重新输入");
        return;
      }
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      AccountFastLogin(this.username, this.code)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              localStorage.setItem("token", response.Data.token);
              localStorage.setItem("phone", response.Data.useraccount);
              if (this.backToActivityLength() > 0) {
                this.$router.go(
                  this.backToActivityLength() - window.history.length
                );
              } else {
                this.$router.push({ name: "home" });
              }
            } else {
              Toast(response.ResultMsg);
            }
          }
        })
        .catch(error => {
          toast1.clear();
        });
    },
    /* 发送验证码 */
    onClickCode() {
      if (!/^((1[0-9]))\d{9}$/.test(this.username)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      SendSmsCode(this.username, 3).then(response => {
        console.log(response);
        if (response) {
          if (response.ResultCode == 0) {
            Toast("验证码发送成功");
            this.timer();
          } else {
            Toast(response.ResultMsg);
          }
        }
      });
    },
    /* 验证码倒计时 */
    timer() {
      this.disabled = true;
      let i = 60;
      let t;
      var _this = this;
      _this.codeMsg = "重新获取 " + i + "s";
      clearInterval(t);
      t = setInterval(function() {
        i--;
        _this.codeMsg = "重新获取 " + i + "s";
        // alert(this.codeMsg);
        if (i == 0) {
          _this.codeMsg = "重新获取";
          _this.disabled = false;
          clearInterval(t);
          i = 60;
        }
      }, 1000);
    },
    //登录按钮是否可点击
    setClickable() {
      if (this.username.length > 0 && this.code.length > 0) {
        this.isClickable = false;
      } else {
        this.isClickable = true;
      }
    },
    backToActivityLength() {
      if (
        CommonUtils.isEmpty(localStorage.getItem("activity_history_length"))
      ) {
        return 0;
      }

      return parseInt(localStorage.getItem("activity_history_length"));
    }
  }
};
</script >

<style scoped lang="scss">
.page {
  background: white;
  position: fixed;
  width: 100%;
  height: 100%;
}
.van-button--default {
  border: none;
}
.div-xieyi {
  margin-top: 22px;
}
.text-xieyi {
  //  display:inline-block;
  font-size: 12px;
  color: rgba(185, 191, 198, 1);
  text-align: left;
  float: left;
  line-height: 18px;
  letter-spacing: 0px;
  position: relative;
  bottom: 16px;
  left: 20px;
  margin-right: 25px;
}
.van-cell {
  border-bottom: 0.3px solid rgba(237, 237, 237, 1);
  width: 318px;
}
.span-sendCode {
  color: rgba(74, 144, 224, 1);
  font-size: 13px;
  line-height: 15px;
  height: 15px;
}
.span-sendCode[disabled] {
  color: #323233;
}
.div-login {
  margin-top: 35px;
}
.img-see {
  width: 17px;
  height: 9px;
}
.van-group {
  display: -webkit-inline-box;
  width: 100%;
  margin-left: 5px;
}
.forget-password {
  display: block;
  font-size: 12px;
  float: right;
  margin-bottom: 19px;
  margin-top: 16px;
}
.div-container {
  margin-top: 71px;
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 117px;
}
.input-icon {
  width: 20px;
  height: 20px;
}
.van-nav-bar .van-icon {
  color: rgba(49, 49, 52, 1);
}
.van-nav-bar__text {
  color: rgba(49, 49, 52, 1);
}
.bt-login {
  background: rgba(74, 144, 224, 1);
  color: #fff;
}
.bt-login[disabled] {
  background: rgba(74, 144, 224, 0.5);
}
.bt-register {
  color: rgba(74, 144, 224, 1);
  background: #fff;
  margin-top: 15px;
}
.van-button--primary {
  border: 1px solid rgba(74, 144, 224, 1);
}
.e-logo {
  width: 166px;
  height: 31px;
  margin-top: 52px;
}
</style>


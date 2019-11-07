<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack" fixed/>
    <div class="div-container">
      <van-cell-group border>
        <van-cell
          type="number"
          class="van-phone"
          maxlength="11"
          clearable
          disabled
          title="原手机号"
          :value="oldPhone"
          v-if="type"
        />
        <van-field
          v-else
          v-model.trim="phone"
          type="number"
          class="van-phone"
          label="新手机号"
          placeholder="请输入手机号码"
          maxlength="11"
          clearable
          :oninput="setClickable()"
        />
        <van-field
          v-model.trim="code"
          clearable
          label="验证码"
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
      </van-cell-group>
      <div class="div-login">
        <van-button
          class="bt-login"
          block
          @click="onClickLogin"
          :disabled="isClickable"
        >{{type?'下一步':'确认'}}</van-button>
      </div>
      <div class="div-xieyi">
        <img src="../../../assets/login/ic_attention.png">
        <span>温馨提示</span>
        <p>1. 绑定手机号码修改成功后，登录账号也变更为新的手机号码。</p>
        <p>2. 绑定手机号码修改成功后，您需要使用新账号重新登录一次。</p>
      </div>
    </div>
  </div>
</template>
<script>
import { SendSmsCode, CheckSmsCode } from "@/api/login";
import { BindMobile } from "@/api/accountSetting";
import { Cell, CellGroup, Toast } from "vant";
export default {
  components: {
    "van-cell-group": CellGroup,
    "van-cell": Cell
  },
  data() {
    return {
      type: true, //type true原手机号 false新手机号
      code: "",
      codeMsg: "获取验证码",
      disabled: false,
      isClickable: true,
      phone: localStorage.getItem("phone"),
      t: ""
    };
  },
  computed: {
    oldPhone() {
      return (
        this.phone.slice(0, 3) +
        "****" +
        this.phone.slice(-4, this.phone.length)
      );
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    /* 登录 */
    onClickLogin() {
      if (!/^((1[0-9]))\d{9}$/.test(this.phone)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      if (!/\d{6}$/.test(this.code)) {
        Toast("短信验证码格式有误，请重新输入");
        return;
      }
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      CheckSmsCode(this.phone, this.type ? 2 : 1, this.code)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              if (this.type) {
                this.type = false;
                this.phone = "";
                this.code = "";
                this.timer(false);
              } else {
                this.bindMobile();
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
    bindMobile() {
      BindMobile(this.phone).then(response => {
        console.log(response);
        if (response) {
          if (response.ResultCode == 0) {
            Toast(response.ResultMsg);
            localStorage.removeItem("token");
            this.$router.replace("myaccount");
          } else {
            Toast(response.ResultMsg);
          }
        }
      });
    },
    /* 发送验证码 */
    onClickCode() {
      if (!/^((1[0-9]))\d{9}$/.test(this.phone)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      SendSmsCode(this.phone, this.type ? 2 : 1).then(response => {
        if (response) {
          if (response.ResultCode == 0) {
            Toast("验证码发送成功");
            this.timer(true);
          } else {
            Toast(response.ResultMsg);
          }
        }
      });
    },
    /* 验证码倒计时 */
    timer(status) {
      this.disabled = true;
      let i = 60;
      var _this = this;
      if (status) {
        _this.codeMsg = "重新获取 " + i + "s";
        clearInterval(_this.t);
        _this.t = setInterval(function() {
          i--;
          _this.codeMsg = "重新获取 " + i + "s";
          // alert(this.codeMsg);
          if (i == 0) {
            _this.codeMsg = "重新获取";
            _this.disabled = false;
            clearInterval(_this.t);
            i = 60;
          }
        }, 1000);
      } else {
        _this.codeMsg = "获取验证码";
        clearInterval(_this.t);
        _this.disabled = false;
      }
    },
    //登录按钮是否可点击
    setClickable() {
      if (this.oldPhone.length > 0 && this.code.length == 6) {
        this.isClickable = false;
      } else {
        this.isClickable = true;
      }
    }
  }
};
</script >

<style scoped lang="scss">
.page {
  height: 100%;
  width: 100%;
  position: fixed;
  background: rgba(250, 250, 250, 1);
}
/deep/.van-cell__title.van-field__label {
  text-align: left;
}
/deep/.van-cell__title {
  max-width: 70px;
}
/deep/.van-cell__title,
.van-cell__value {
  text-align: left;
}
.van-button--default {
  border: none;
}
.van-cell {
  // border-bottom: 1px solid rgba(237, 237, 237, 1);
  //   width: 318px;
  margin: 0px 10px;
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
  margin-top: 25px;
  margin-left: 15px;
  margin-right: 15px;
}
.img-see {
  width: 17px;
  height: 9px;
}
.forget-password {
  display: block;
  font-size: 12px;
  float: right;
  margin-bottom: 19px;
  margin-top: 16px;
}
.div-container {
  margin-top: 10px;
  margin-bottom: 117px;
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
.div-xieyi {
  margin-top: 15px;
  margin-left: 10px;
  margin-right: 10px;
  text-align: left;
  p {
    font-size: 12px;
    color: rgba(185, 191, 198, 1);
    line-height: 18px;
    margin-top: 10px;
  }
  img {
    width: 14px;
    height: 14px;
    left: 20px;
  }
  span {
    font-size: 12px;
    width: 100px;
    color: rgba(185, 191, 198, 1);
    text-align: left;
    line-height: 18px;
    letter-spacing: 0px;
    margin-left: 5px;
    position: relative;
    bottom: 2px;
  }
}
.van-hairline--top-bottom::after{
  border-width: 0;
}
</style>


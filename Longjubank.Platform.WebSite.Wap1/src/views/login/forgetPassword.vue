<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack" style="position:fixed"/>
    <div class="div-container">
      <div class="van-group">
        <van-field
          v-model.trim="phone"
          type="number"
          class="van-phone"
          placeholder="请输入手机号码"
          label="手机号"
          maxlength="11"
          clearable
          :oninput="setClickable() "
        />
      </div>

      <div class="van-group">
        <van-field v-model.trim="code" clearable type="number" placeholder="请输入验证码" label="验证码">
          <van-button
            slot="button"
            class="span-sendCode"
            type="default"
            :oninput="setClickable() "
            :disabled="disabled"
            @click="onClickCode"
          >{{codeMsg}}</van-button>
        </van-field>
      </div>

      <div class="div-login">
        <van-button
          class="bt-login"
          block
          type="default"
          @click="onClickSure"
          :disabled="isClickable"
        >下一步</van-button>
      </div>
    </div>
    <v-phone></v-phone>
  </div>
</template>
<script>
import ServicePhone from "../../components/layout/servicePhone";
import { SendSmsCode, CheckSmsCode } from "@/api/login";
import { Toast } from "vant";
export default {
  components: {
    "v-phone": ServicePhone
  },
  data() {
    return {
      phone: "",
      code: "",
      codeMsg: "获取验证码",
      disabled: false,
      isClickable: false
    };
  },
  methods: {
    //登录按钮是否可点击
    setClickable() {
      if (this.phone.length > 0 && this.code.length > 0) {
        this.isClickable = false;
      } else {
        this.isClickable = true;
      }
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    onClickCode() {
      if (!/^((1[0-9]))\d{9}$/.test(this.phone)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      SendSmsCode(this.phone, 2).then(response => {
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
    onClickSure() {
      if (!/^((1[0-9]))\d{9}$/.test(this.phone)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      if (!/\d{6}$/.test(this.code)) {
        Toast("短信验证码格式有误，请重新输入");
        return;
      }
      CheckSmsCode(this.phone, 1, this.code).then(response => {
        console.log(response);
        if (response) {
          if (response.ResultCode == 0) {
            this.$router.push({
              name: "setPassword",
              query: {
                //1 忘记密码
                type: 2,
                phone: this.phone
              }
            });
          } else {
            Toast(response.ResultMsg);
          }
        }
      });
    }
  }
};
</script >

<style scoped lang="scss">
.page {
  background: rgba(250, 250, 250, 1);
  position:fixed;
  width: 100%;
  height: 100%;
}
/deep/.van-field__label {
  text-align: left;
  max-width: 60px;
}
.van-button--default {
  border: none;
}
.van-cell {
  border-bottom: 0.3px solid rgba(237, 237, 237, 1);
  padding: 15px 18px;
}
.span-sendCode {
  color: rgba(74, 144, 224, 1);
  font-size: 13px;
  line-height: 15px;
  height: 15px;
  text-align: right;
}
.span-sendCode[disabled] {
  color: #323233;
}
.div-login {
  margin-top: 35px;
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
}
.input-icon {
  width: 15px;
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
  margin: 15px, 15px, 15px;
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
.van-button--normal {
  padding: 0px;
}
</style>


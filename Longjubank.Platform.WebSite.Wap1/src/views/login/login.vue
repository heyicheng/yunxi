<template>
  <div class="page">
    <van-nav-bar
      :title="$route.meta.title"
      right-text="快速登录"
      left-arrow
      @click-left="goBack"
      @click-right="onClickRight"
      style="position:fixed"
    />
    <img class="e-logo" src="../../assets/login/e-logo.png">
    <div class="div-container">
      <div class="van-group">
        <img class="input-icon" src="../../assets/login/ic_phone.png">
        <van-field
          v-model.trim="username"
          type="number"
          class="van-phone"
          placeholder="请输入手机号码"
          maxlength="11"
          border
          clearable
          :oninput="setClickable() "
        />
      </div>

      <div class="van-group" style="margin-top:15px">
        <img class="input-icon" src="../../assets/login/ic_lock.png">
        <van-field
          v-model.trim="password"
          :type="passwordShow"
          placeholder="请输入密码"
          maxlength="16"
          border
          clearable
          :oninput="setClickable()"
          @keyup.enter="login"
        >
          <img
            v-if="passwordEye"
            slot="button"
            class="img-see"
            src="../../assets/login/ic_see.png"
            @click="passwordClose"
          >
          <img
            v-else
            slot="button"
            class="img-see"
            src="../../assets/login/ic_invisible.png"
            @click="passwordClose"
          >
        </van-field>
      </div>

      <div>
        <router-link class="forget-password" :to="{name:'forgetPassword', query:{type: 2 }}">忘记密码?</router-link>
      </div>

      <div class="div-login div-button">
        <van-button class="bt-login" block @click="login" :disabled="isClickable">登录</van-button>
      </div>
      <div class="div-register div-button">
        <van-button router-link :to="{name:'register'}" class="bt-register" block type="primary">注册</van-button>
      </div>
    </div>
    <v-phone></v-phone>
  </div>
</template>
<script>
import { LOGIN } from "@/api/login";
import ServicePhone from "../../components/layout/servicePhone";
import OpenEscrowAccount from "@/components/openEscrow/openEscrowAccount.js";
import { Toast } from "vant";
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
      password: "",
      passwordShow: "password",
      passwordEye: false,
      isClickable: true
    };
  },
  methods: {
    goBack() {
      if (this.backToActivityLength() > 0) {
        this.$router.go(this.backToActivityLength() - window.history.length);
      } else {
        window.history.length > 1
          ? this.$router.go(-1)
          : this.$router.push("/");
      }
    },
    //导航栏右上角
    onClickRight() {
      this.$router.push({ name: "quickLogin" });
      // OpenEscrowAccount().then();
    },
    //密码输入框小眼睛
    passwordClose() {
      if (this.passwordEye) {
        this.passwordEye = false;
        this.passwordShow = "password";
      } else {
        this.passwordEye = true;
        this.passwordShow = "text";
      }
    },
    //登录
    login() {
      if (!/^((1[0-9]))\d{9}$/.test(this.username)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password)) {
        Toast("密码错误，请重新输入");
        return;
      }
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      LOGIN(this.username, this.password)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode > 0) {
              Toast(response.ResultMsg);
            } else {
              // this.goBack();
              if (this.backToActivityLength() > 0) {
                this.$router.go(
                  this.backToActivityLength() - window.history.length
                );
              } else {
                this.$router.push({ name: "home" });
              }
              localStorage.setItem("token", response.Data.token);
              localStorage.setItem("phone", response.Data.useraccount);
            }
          }
        })
        .catch(error => {
          toast1.clear();
        });
    },
    //登录按钮是否可点击
    setClickable() {
      if (this.username.length > 0 && this.password.length > 0) {
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
</script>
<style>
.van-button--default {
  border: none;
}
</style>

<style scoped lang="scss">
.page {
  background: white;
  position: fixed;
  width: 100%;
  height: 100%;
}
.van-cell {
  border-bottom: 0.3px solid rgba(237, 237, 237, 1);
  width: 308px;
}
.img-see {
  width: 19px;
  height: 12px;
}
.van-group {
  display: -webkit-inline-box;
  width: 95%;
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
  margin-bottom: 100px;
}
.input-icon {
  width: 20px;
  height: 20px;
}
.van-nav-bar .van-icon {
  color: rgba(49, 49, 52, 1);
}
.div-button {
  width: 340px;
  margin: auto;
}
.van-nav-bar__right {
  font-size: 13px;
  line-height: 40px;
  height: auto;
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


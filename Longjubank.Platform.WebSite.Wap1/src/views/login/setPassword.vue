<template>
  <div class="page">
    <van-nav-bar :title="title" left-arrow @click-left="goBack" style="position:fixed"/>
    <span class="span-tips" v-show="type==1">提示：尊敬的用户您好，请输入您用于登录龙驹财行的登录密码</span>
    <div class="van-group">
      <van-field
        v-model.trim="passwordFirst"
        :type="passwordShowFirst"
        label="登录密码"
        placeholder="请输入您的登录密码"
        border
        clearable
        :oninput="setClickable()"
        maxlength="16"
      >
        <van-checkbox
          slot="button"
          v-model="passwordFirstEye"
          @click="passwordFirstEye?passwordShowFirst='text':passwordShowFirst='password'"
        >
          <img
            slot="icon"
            class="img-see"
            :src="passwordFirstEye?propsIcon.see:propsIcon.invisible"
          >
        </van-checkbox>
      </van-field>
    </div>
    <span class="span-tips">登录密码必须同时包含数字和英文字母，限定6-16位字符</span>
    <div class="van-group">
      <van-field
        v-model.trim="passwordSecond"
        :type="passwordShowSecond"
        label="重复密码"
        placeholder="请重复输入您的登录密码"
        maxlength="16"
        border
        clearable
        :oninput="setClickable() "
      >
        <van-checkbox
          slot="button"
          v-model="passwordSecondEye"
          @click="passwordSecondEye?passwordShowSecond='text':passwordShowSecond='password'"
        >
          <img
            slot="icon"
            class="img-see"
            :src="passwordSecondEye?propsIcon.see:propsIcon.invisible"
          >
        </van-checkbox>
      </van-field>
    </div>
    <div class="div-button">
      <van-button
        class="bt-sure"
        block
        :disabled="isClickable"
        @click="onClickNext"
      >{{type==1?'完成':'确认'}}</van-button>
    </div>
    <van-dialog class="van-register" v-model="register_Show" show-cancel-button>
      <img src="../../assets/login/ic_regist.png">
      <p>恭喜您,注册成功!</p>
      <span>即将跳转到登录页面...</span>
    </van-dialog>
    <van-dialog class="van-reset" v-model="find_Show" show-cancel-button>
      <img src="../../assets/login/ic_resetpassword.png">
      <p>恭喜您,密码已重置成功</p>
      <van-button router-link :to="{name:'login'}" class="bt-login">立即登录</van-button>
    </van-dialog>
    <v-phone></v-phone>
  </div>
</template>



<script>
import Checkbox from "vant/lib/checkbox";
import "vant/lib/checkbox/style";
import ServicePhone from "../../components/layout/servicePhone";
import { AccountRegister, RetrieveLoginPwd } from "@/api/login";
import { Toast } from "vant";
export default {
  components: {
    "van-checkbox": Checkbox,
    "v-phone": ServicePhone
  },
  created() {
    document.title = this.title;
  },
  data() {
    return {
      //1 登录密码  2 忘记密码
      type: this.$route.query.type,
      passwordFirst: "",
      passwordSecond: "",
      passwordShowFirst: "password",
      passwordShowSecond: "password",
      passwordFirstEye: false,
      passwordSecondEye: false,
      propsIcon: {
        invisible: require("../../assets/login/ic_invisible.png"),
        see: require("../../assets/login/ic_see.png")
      },
      register_Show: false,
      find_Show: false
    };
  },
  computed: {
    title: function() {
      return this.$route.query.type == 1 ? "登录密码" : "找回密码";
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    //登录按钮是否可点击
    setClickable() {
      if (this.passwordFirst.length > 0 && this.passwordSecond.length > 0) {
        this.isClickable = false;
      } else {
        this.isClickable = true;
      }
    },
    onClickNext() {
      if (
        !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.passwordFirst)
      ) {
        Toast("请输入正确的登录密码");
        return;
      }
      if (
        !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(
          this.passwordSecond
        )
      ) {
        Toast("请输入正确的重复密码");
        return;
      }
      if (this.passwordFirst != this.passwordSecond) {
        Toast("登录密码与重复密码不一致");
        return;
      }
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      if (this.type == 1) {
        AccountRegister(
          this.$route.query.phone,
          this.passwordFirst,
          this.$route.query.reference
        )
          .then(response => {
            toast1.clear();
            console.log(response);
            if (response) {
              if (response.ResultCode == 0) {
                localStorage.setItem("phone", response.Data.useraccount);
                this.timer();
              } else {
                Toast(response.ResultMsg);
              }
            }
          })
          .catch(error => {
            toast1.clear();
          });
      } else {
        RetrieveLoginPwd(this.$route.query.phone, this.passwordFirst)
          .then(response => {
            toast1.clear();
            console.log(response);
            if (response) {
              if (response.ResultCode == 0) {
                this.find_Show = true;
              } else {
                Toast(response.ResultMsg);
              }
            }
          })
          .catch(error => {
            toast1.clear();
          });
      }
    },
    /* 注册成功跳转登录倒记时 */
    timer() {
      this.register_Show = true;
      let i = 2;
      let t;
      var _this = this;
      clearInterval(t);
      t = setInterval(function() {
        i--;
        if (i == 0) {
          clearInterval(t);
          _this.register_Show = false;
          _this.$router.replace({ name: "login" });
        }
      }, 1000);
    }
  }
};
</script>
<style scoped lang="scss">
.page {
  background: rgba(250, 250, 250, 1);
  position: fixed;
  width: 100%;
  height: 100%;
}
/deep/.van-hairline--top.van-dialog__footer.van-dialog__footer--buttons {
  display: none;
}
.bt-login {
  width: 240px;
  height: 40px;
  margin-top: 30px;
  background: rgba(74, 144, 224, 1);
}
.van-register {
  width: 270px;
  height: 280px;
  border-radius: 7px;
  img {
    width: 149px;
    height: 108px;
    margin-top: 38px;
  }
  p {
    font-size: 20px;
    color: rgba(255, 145, 0, 1);
    margin-bottom: 30px;
    margin-top: 35px;
  }
  span {
    font-size: 12px;
    color: rgba(154, 163, 173, 1);
  }
}
.van-reset {
  width: 270px;
  height: 280px;
  border-radius: 7px;
  img {
    height: 128px;
  }
  p {
    margin-top: 39px;
    font-size: 15px;
    color: rgba(49, 49, 52, 1);
    line-height: 22px;
  }
}
.van-group {
  display: -webkit-inline-box;
  width: 100%;
}
.img-see {
  width: 19px;
  height: 12px;
}
.span-tips {
  font-size: 12px;
  color: rgba(74, 144, 224, 1);
  line-height: 15px;
  margin: 12px 15px;
  float: left;
  text-align: left;
}
/deep/.van-cell__title.van-field__label {
  text-align: left;
  max-width: 70px;
}
.div-button {
  margin-top: 30px;
  width: calc(100% - 30px);
  // overflow: scroll;
}
.bt-sure {
  background: rgba(74, 144, 224, 1);
  margin-left: 15px;
  // margin-right: 15px;
  // margin: auto;
  color: #fff;
}
.bt-login[disabled] {
  background: rgba(74, 144, 224, 0.5);
}
</style>


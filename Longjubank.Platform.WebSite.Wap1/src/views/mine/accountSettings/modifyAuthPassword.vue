<template>
  <div class="page">
    <van-nav-bar :title="title" left-arrow @click-left="goBack"/>
    <div>
      <p id="tips">{{tips}}</p>
      <!-- 密码输入框 -->
      <van-password-input :value="value"/>
      <!-- 数字键盘 -->
      <van-number-keyboard :show="true" @input="onInput" @delete="onDelete" hide-on-click-outside/>
    </div>
  </div>
</template>
<script>
import { PasswordInput, NumberKeyboard, Toast } from "vant";
import {
  SetPayPwd,
  EditPayPwd,
  CheckPayPwd,
  RetrievePayPwd
} from "@/api/accountSetting";
import { error } from "util";
export default {
  components: {
    "van-password-input": PasswordInput,
    "van-number-keyboard": NumberKeyboard
  },
  data() {
    return {
      //0设置授权密码  1修改授权密码  2重置授权密码
      type: this.$route.query.type,
      title:
        this.$route.query.type == 0
          ? "设置授权密码"
          : this.$route.query.type == 1
          ? "修改授权密码"
          : "重置授权密码",
      tips:
        this.$route.query.type == 1
          ? "输入原授权密码，以验证身份"
          : "请输入新授权密码",
      value: "",
      oldpassword: "",
      firstpass: "",
      checkPass: false
    };
  },
  computed: {},
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length == 6) {
        if (this.firstpass.length <= 1) {
          document.getElementById("tips").className = "";
          this.firstpass = this.value;
          this.tips = "请再次输入新授权密码";
          this.value = "";
          if (this.type == 1 && !this.checkPass) {
            this.checkPassword();
          }
        } else {
          if (this.firstpass == this.value) {
            if (this.type == 0) {
              this.setPassword();
            } else if (this.type == 1) {
              this.editPassword();
            } else if (this.type == 2) {
              this.retrievePayPwd();
            }
          } else {
            this.tips = "两次输入不一致，请重新输入";
            document.getElementById("tips").className += " text-color";
            this.firstpass = "";
            this.value = "";
          }
        }
      }
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    /* 设置授权密码 */
    setPassword() {
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      SetPayPwd(this.value)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              Toast.success("设置密码成功");
              this.$router.replace("accountSettings");
            } else {
              Toast(response.ResultMsg);
            }
          }
        })
        .catch(error => {
          toast1.clear();
        });
    },
    /* 验证授权密码 */
    checkPassword() {
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      CheckPayPwd(this.firstpass)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              this.oldpassword = this.firstpass;
              this.firstpass = "";
              this.checkPass = true;
              this.tips = "请输入新授权密码";
            } else {
              this.tips = "原授权密码输入错误，请重新输入";
              document.getElementById("tips").className += " text-color";
              this.firstpass = "";
            }
          }
        })
        .catch(error => {
          toast1.clear();
        });
    },
    /* 修改授权密码 */
    editPassword() {
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      EditPayPwd(this.oldpassword, this.value)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              Toast.success("修改密码成功");
              this.goBack();
            } else {
              if (response.ResultMsg == "新旧支付密码一致,无需修改") {
                this.tips = "新旧授权密码一样，请重新输入";
                document.getElementById("tips").className += " text-color";
                this.firstpass = "";
                this.value = "";
              } else {
                Toast(response.ResultMsg);
              }
            }
          }
        })
        .catch(error => {
          toast1.clear();
        });
    },
    /* 重置授权密码 */
    retrievePayPwd() {
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      RetrievePayPwd(localStorage.getItem("phone"), this.value)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              Toast.success("修改密码成功");
              this.goBack();
            } else {
              Toast(response.ResultMsg);
            }
          }
        })
        .catch(error => {
          toast1.clear();
        });
    }
  }
};
</script>
<style scoped lang="scss">
.page {
  background: rgba(255, 255, 255, 1);
  position: fixed;
  width: 100%;
  height: 100%;
}
div {
  p {
    opacity: 1;
    font-size: 14px;
    font-family: PingFang SC;
    color: rgba(99, 105, 118, 1);
    line-height: 15px;
    letter-spacing: 0px;
    margin-top: 60px;
  }
}
.van-password-input {
  margin-top: 70px;
}
.text-color {
  color: rgba(250, 84, 84, 1);
}
</style>



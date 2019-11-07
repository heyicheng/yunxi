<template>
  <div class="emailContainer page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <van-field class="emailField" v-model="emailAddress" placeholder="请输入您常用的邮箱"/>
    <van-button
      class="emailButton"
      :disabled="emailAddress && emailAddress.length === 0"
      type="default"
      @click="saveEmailAddress"
    >提交</van-button>
  </div>
</template>

<script>
import { Field, Button, Toast } from "vant";
import { BindEmail } from "@/api/account.js";

export default {
  data() {
    return {
      emailAddress: ""
    };
  },
  components: {
    "van-field": Field,
    "van-button": Button
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    saveEmailAddress() {
      if (!this.checkEmailValid()) {
        Toast({ message: "请输入正确的邮箱地址", duration: 1500 });
        return;
      }
      Toast.loading({ mask: true, duration: 0 });
      BindEmail(this.emailAddress)
        .then(response => {
          if (response.ResultCode === 0) {
            Toast.clear();
            this.$router.go(-1);
          } else {
            Toast({ message: response.ResultMsg, duration: 1500 });
          }
        })
        .catch(error => {
          Toast.clear();
        });
    },
    checkEmailValid() {
      let re = new RegExp("^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$");
      return re.test(this.emailAddress);
    }
  },
  mounted() {
    var accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
    this.emailAddress = accountInfo.bindemail;
  }
};
</script>

<style scoped lang='scss'>
.emailContainer {
  position: fixed;
  background: rgba(248, 248, 248, 1);
  height: 100%;
  width: 100%;
}

.emailContainer .emailField {
  margin-top: 11px;
  height: 50px;
  font-size: 16px;
}

.emailContainer .emailButton {
  height: 40px;
  width: calc(100% - 30px);
  margin-top: 25px;
}
/deep/.van-button--default {
  border: none;
  color: white;
  background: rgba(42, 117, 204, 1);
}
/deep/.van-button::before {
  background-color: rgba(74, 144, 224, 1);
}
</style>

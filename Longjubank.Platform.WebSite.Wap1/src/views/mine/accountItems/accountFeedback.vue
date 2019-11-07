<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div class="backgroundDiv"></div>
    <van-input
      class="filedInput"
      v-model="suggestion"
      placeholder="请留下您的宝贵意见或建议"
      rows="5"
      type="textarea"
    />
    <van-input class="phoneInput" v-model="phone" placeholder="请留下您的手机联系方式" rows="1" type="number" maxlength="32"/>
    <button
      class="confirmBtn"
      type="button"
      :disabled="suggestion.length === 0"
      @click="submitSuggestion"
    >提交</button>
  </div>
</template>

<script>
import { Field, Toast } from "vant";
import { submitSuggestion } from "@/api/account";

export default {
  data() {
    return {
      suggestion: "",
      phone: ""
    };
  },
  components: {
    "van-input": Field
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    submitSuggestion() {
      if (this.suggestion.length === 0) {
        Toast({ message: "反馈内容不能为空", duration: 1500 });
        return;
      }
      Toast.loading({ mask: true, duration: 0 });
      submitSuggestion(this.suggestion, this.phone)
        .then(response => {
          if (response.ResultCode === 0) {
            Toast({ message: "提交成功", duration: 500 });
            setTimeout(() => {
              this.$router.go(-1);
            }, 500);
          } else {
            Toast({ message: response.ResultMsg, duration: 1500 });
          }
        })
        .catch(err => {
          Toast({ message: "提交失败", duration: 1500 });
        });
    }
  }
};
</script>

<style scoped lang="scss">
.backgroundDiv {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fafafa;
}

.filedInput {
  height: 140px;
  width: 100%;
  margin-top: 11px;
}

.phoneInput {
  margin-top: 15px;
}

/deep/.van-field__body {
  font-size: 16px;
}

.confirmBtn {
  margin-top: 25px;
  position: relative;
  width: calc(100% - 30px);
  height: 40px;
  background: rgba(74, 144, 224, 1);
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
  border-radius: 2px;
  outline: none;
  border: none;
}
.confirmBtn:disabled {
  background: rgba(74, 144, 224, 1);
  opacity: 0.5;
}
.confirmBtn:active {
  background: rgba(42, 117, 204, 1);
}
</style>
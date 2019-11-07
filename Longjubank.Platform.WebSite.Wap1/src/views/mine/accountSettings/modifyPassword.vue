<template>
  <div class='page' style="background:rgba(250,250,250,1);position:fixed;height:100%;width:100%">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <div class="van-group">
      <van-field
        v-model.trim="passwordOld"
        :type="passwordShowOld"
        label="原登录密码"
        placeholder="请输入原登录密码"
        border
        clearable
        :oninput="setClickable()"
        maxlength="16"
      >
        <van-checkbox
          slot="button"
          v-model="passwordOldEye"
          @click="passwordOldEye?passwordShowOld='text':passwordShowOld='password'"
        >
          <img slot="icon" class="img-see" :src="passwordOldEye?propsIcon.see:propsIcon.invisible">
        </van-checkbox>
      </van-field>
    </div>
    <div class="van-group">
      <van-field
        v-model.trim="passwordFirst"
        :type="passwordShowFirst"
        label="新登录密码"
        placeholder="请输入新登录密码"
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
        label="重复新密码"
        placeholder="请重复输入新登录密码"
        border
        clearable
        :oninput="setClickable() "
        maxlength="16"
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
      >确认修改</van-button>
    </div>
  </div>
</template>



<script>
import Checkbox from "vant/lib/checkbox";
import "vant/lib/checkbox/style";
import { EditLoginPwd } from "@/api/accountSetting";
import { Toast } from "vant";
export default {
  components: {
    "van-checkbox": Checkbox
  },
  data() {
    return {
      passwordFirst: "",
      passwordSecond: "",
      passwordOld: "",
      passwordShowFirst: "password",
      passwordShowSecond: "password",
      passwordShowOld: "password",
      passwordFirstEye: false,
      passwordSecondEye: false,
      passwordOldEye: false,
      propsIcon: {
        invisible: require("../../../assets/login/ic_invisible.png"),
        see: require("../../../assets/login/ic_see.png")
      }
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    //按钮是否可点击
    setClickable() {
      if (this.passwordFirst.length > 0 && this.passwordSecond.length > 0) {
        this.isClickable = false;
      } else {
        this.isClickable = true;
      }
    },
    onClickNext() {
      if (
        !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.passwordOld)
      ) {
        Toast("请输入正确原登录密码");
        return;
      }
      if (
        !/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(
          this.passwordFirst
        )
      ) {
        Toast("请输入正确的新登录密码");
        return;
      }
      if (this.passwordFirst != this.passwordSecond) {
        Toast("两次密码输入不一致");
        return;
      }
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      EditLoginPwd(this.passwordOld, this.passwordFirst).then(response => {
        toast1.clear();
        console.log(response);
        if (response) {
          if (response.ResultCode == 0) {
            Toast("修改成功");
            this.goBack();
          } else {
            Toast(response.ResultMsg);
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
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
  margin-top: 10px;
}
.img-see {
  width: 19px;
  height: 12px;
}
.span-tips {
  font-size: 12px;
  color: rgba(74, 144, 224, 1);
  line-height: 15px;
  margin: 10px 15px 0px;
  float: left;
  text-align: left;
}
/deep/.van-cell__title.van-field__label {
  text-align: left;
  max-width: 90px;
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


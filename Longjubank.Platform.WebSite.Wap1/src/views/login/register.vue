<template>
  <div class="page" style="background:rgba(250,250,250,1);position:fixed;height:100%;width:100%">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <div>
      <div class="div-container">
        <div class="van-group">
          <van-field
            v-model.trim="username"
            ref="field"
            type="number"
            class="van-phone"
            label="手机号"
            placeholder="请输入注册手机号码"
            maxlength="11"
            border
            clearable
            :oninput="setClickable()"
          />
        </div>

        <div class="van-group">
          <van-field
            v-model.trim="code"
            ref="field"
            style="padding:9.6px 0px 9.6px 14px"
            clearable
            type="number"
            label="验证码"
            maxlength="6"
            placeholder="请输入验证码"
            :oninput="setClickable()"
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
        <div class="van-group" style="margin-top:15px">
          <van-field
            v-model.trim="reference"
            type="number"
            class="van-phone"
            label="推荐人"
            placeholder="(选填)请输入推荐码或推荐人手机号"
            maxlength="11"
            border
            clearable
          />
        </div>
      </div>
    </div>
    <div class="div-button">
      <van-button
        class="bt-login"
        block
        type="default"
        :disabled="isClickable"
        @click="onClickNext"
      >下一步</van-button>
    </div>
    <div class="div-xieyi">
      <van-checkbox v-model="checked">
        <span class="text-xieyi">
          同意
          <router-link
            :to="{name:'activityDetail',  query: {
          path: xieyiUrl,
          title:'龙驹财行注册协议'
        }}"
          >《龙驹财行注册协议》</router-link>
        </span>
        <img
          style="width:14px;height:14px"
          slot="icon"
          slot-scope="props"
          :src="props.checked ? icon.active : icon.normal"
        >
      </van-checkbox>
    </div>
    <v-phone></v-phone>
  </div>
</template>
<script>
import Checkbox from "vant/lib/checkbox";
import "vant/lib/checkbox/style";
import ServicePhone from "../../components/layout/servicePhone";
import Toast from "vant/lib/toast";
import "vant/lib/toast/style";
import { SendSmsCode, CheckSmsCode } from "@/api/login";
export default {
  components: {
    "van-checkbox": Checkbox,
    "v-phone": ServicePhone
  },
  data() {
    return {
      username: "",
      reference: "",
      code: "",
      codeMsg: "获取验证码",
      disabled: false,
      checked: true,
      icon: {
        normal: require("../../assets/login/ic_un.png"),
        active: require("../../assets/login/ic_agree.png")
      },
      xieyiUrl:
        process.env.VUE_APP_H5SERVER +
        "/p2ph5/person/protocol/protocol_register.html"
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    //登录按钮是否可点击
    setClickable() {
      if (this.username.length > 0 && this.code.length > 0 && this.checked) {
        this.isClickable = false;
      } else {
        this.isClickable = true;
      }
    },
    //获取验证码
    onClickCode() {
      if (!/^((1[0-9]))\d{9}$/.test(this.username)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      SendSmsCode(this.username, 1).then(response => {
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
    /* 验证码倒记时 */
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
    //下一步
    onClickNext() {
      this.$refs.field.blur();
      if (!/^((1[0-9]))\d{9}$/.test(this.username)) {
        Toast("输入手机号有误，请重新输入");
        return;
      }
      if (!/\d{6}$/.test(this.code)) {
        Toast("短信验证码格式有误，请重新输入");
        return;
      }
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      CheckSmsCode(this.username, 1, this.code)
        .then(response => {
          toast1.clear();
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              this.$router.push({
                name: "setPassword",
                query: {
                  //1 登录密码
                  type: 1,
                  reference: this.reference,
                  phone: this.username
                }
              });
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
.div-xieyi {
  margin: 15px;
  text-align: left;
}
.text-xieyi {
  font-size: 12px;
  color: rgba(185, 191, 198, 1);
  line-height: 12px;
  letter-spacing: 0px;
  a {
    margin-left: -5px;
  }
}
.van-cell {
  border-bottom: 0.3px solid rgba(237, 237, 237, 1);
  width: 100%;
}
.van-group {
  background: #fff;
  text-align: left;
}
/deep/.van-cell__title.van-field__label {
  text-align: left;
  max-width: 60px;
}
.van-button--default {
  border: none;
}
.div-container {
  margin-top: 10px;
}
.van-nav-bar .van-icon {
  color: rgba(49, 49, 52, 1);
}
.div-button {
  margin-top: 30px;
  width: calc(100% - 30px);
}
.bt-login {
  background: rgba(74, 144, 224, 1);
  margin-left: 15px;
  // margin-right: 15px;
  // margin: auto;
  color: #fff;
}
.bt-login[disabled] {
  background: rgba(74, 144, 224, 0.5);
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
</style>

<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK()"></van-nav-bar>
    <div class="object flex-row-start">
      <div class="pig"></div>
      <span class="text">理财投资</span>
      <span class="amount orange">￥{{Number($route.query.payamount).toFixed(2)}}</span>
    </div>
    <div class="choicepay">选择支付方式</div>
    <div class="balance flex-row-between">
      <div class="flex-row-start">
        <div class="img"></div>
        <span class="text">龙驹财行账户余额</span>
        <span class="orange text">￥{{$route.query.blanceamount}}</span>
      </div>
      <div
        class="switch"
        @click="choiceBalance"
        :class="{switched:is_switch,'not-switch':!is_switch}"
      ></div>
      <!-- <div  :class="{choiced:switch==0}"></div> -->
    </div>
    <van-button
      v-if="is_balance&&is_switch"
      type="warning"
      @click="submitPay"
      class="comfirn"
    >确认支付￥{{Number($route.query.payamount).toFixed(2)}}</van-button>
    <van-button
      v-else
      type="warning"
      class="comfirn nocomfirn"
    >确认支付￥{{Number($route.query.payamount).toFixed(2)}}</van-button>

    <!-- 数字键盘 -->
    <van-number-keyboard :show="showboard" @input="onInput" @delete="onDelete"/>
    <!-- 授权码弹窗 -->
    <van-dialog class="popcode" v-model="is_auth_code" :showConfirmButton="false">
      <div class="auth-code">
        <div class="head flex-row-between">
          <div></div>
          <span class="inputpass">输入授权密码</span>
          <img @click="closeCode" src="@/assets/moneyManage/-e-ic_colse.png" alt class="close">
        </div>
        <div class="code" style="position:relative;">
          <!-- 密码输入框 -->
          <van-password-input :value="veryCode" @focus="showboard = true"/>
        </div>
        <div class="forget">
          <router-link :to="{name:'forgetAuthPassword'}">忘记密码?</router-link>
        </div>
      </div>
    </van-dialog>
    <!-- 没有设置授权码 -->
    <van-dialog v-model="shouquanPop" class="notice" :show-confirm-button="false ">
      <div class="header">使用余额支付需要您设置授权密码后才能继续进行</div>
      <div class="flex-row-center">
        <div class="style-btn te-left" @click="$router.push({ name: 'authorizationPassword' })">去设置</div>
        <div class="style-btn" @click="GOBACK()">取消</div>
      </div>
    </van-dialog>
    <!-- 余额不足 -->
    <van-dialog v-model="balancePop" class="notice" :show-confirm-button="false ">
      <div class="header">账户余额不足</div>
      <div class="flex-row-center">
        <div class="style-btn te-left" @click="balancePop=false">取消</div>
        <div class="style-btn" @click="$router.push('/recharge')">充值</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import { SUBMITPASSWORD, PAYORDER } from "@/api/moneyManage";
import { PasswordInput, NumberKeyboard } from "vant";
import { mainTainCode } from "@/api/messageCode";
export default {
  components: {
    "van-password-input": PasswordInput,
    "van-number-keyboard": NumberKeyboard
  },
  data() {
    return {
      is_switch: true, // 是否勾选余额
      is_auth_code: false, //输入授权密码弹窗
      veryCode: "",
      is_balance: true, //余额是否充足,
      showKeyboard: false,

      value: "",
      showboard: false,
      submitSwitch: true, //防止重复提交支付订单
      shouquanPop: false, //是否有授权密码弹窗
      balancePop: false //余额不足弹窗
    };
  },
  computed: {
    veryCodeList() {
      return this.veryCode.toString().split("");
    }
  },
  methods: {
    onInput(key) {
      this.veryCode = (this.veryCode + key).slice(0, 6);
      if (!this.submitSwitch) {
        //为false则不能 点击
        return;
      }
      if (this.veryCode.length == 6) {
        this.submitSwitch = false; //这里关闭
        SUBMITPASSWORD({
          paypwd: this.veryCode
        }).then(res => {
          if (res.ResultCode == 0) {
            PAYORDER({
              paytype: 3,
              orderid: this.$route.query.orderid
            }).then(res => {
              this.submitSwitch = true; //在支付接口之后也需要打开
              if (res.ResultCode == 0) {
                this.popcode = false;
                this.$router.replace({
                  name: "payResult",
                  query: {
                    payResult: "success",
                    planname: this.$route.query.planname,
                    amount: this.$route.query.payamount
                  }
                });
              } else if (mainTainCode.indexOf(res.ResultCode) > -1) {
                this.submitSwitch = true; //授权密码输入错误需要打开
                this.veryCode = "";
                // this.$toast(res.ResultMsg);
              } else {
                this.$router.replace({
                  name: "payResult",
                  query: {
                    payResult: "faild",
                    planname: this.$route.query.planname,
                    amount: this.$route.query.payamount
                  }
                });
              }
            });
          } else {
            this.submitSwitch = true; //授权密码输入错误需要打开
            this.veryCode = "";
            this.$toast(res.ResultMsg);
          }
        });
      }
    },
    onDelete() {
      this.veryCode = this.veryCode.slice(0, this.veryCode.length - 1);
    },
    choiceBalance() {
      if (this.is_balance) {
        this.is_switch = !this.is_switch;
      } else {
        // 余额不足弹窗
        this.balancePop = true;
      }
    },
    closeCode() {
      this.veryCode = "";
      this.is_auth_code = false;
      this.showboard = false;
    },
    validatorCode() {
      if (this.$route.query.issetpay == 0) {
        this.shouquanPop = true;
      }
    },
    submitPay() {
      this.showboard = true;
      this.is_auth_code = true;
      // this.$nextTick(function() {
      //   // DOM 更新了
      //   this.$refs.code.focus();
      // });
      // this.$refs.code.focus();
    },
    judgeBalance() {
      if (
        Number(this.$route.query.payamount) <=
        Number(this.$route.query.blanceamount)
      ) {
        this.is_balance = true;
        this.is_switch = true;
      } else {
        this.is_balance = false;
        this.is_switch = false;
      }
    }
  },
  mounted() {
    this.judgeBalance();
    this.validatorCode(); //授权密码
  }
};
</script>
<style lang="scss" scoped>
/deep/ [class*="van-hairline"]::after {
  border-color: rgba(212, 213, 215, 1);
}
.page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(248, 248, 248, 1);
}
.object {
  height: 128px;
  background: url(~@/assets/moneyManage/paymentboder.png) center / 100% 100%;
  .pig {
    width: 50px;
    height: 50px;
    background: url(~@/assets/moneyManage/pig.png) center / 100% 100%;
    margin-left: 16px;
  }
  .text {
    font-size: 14px;
    margin-left: 16px;
  }
  .amount {
    font-size: 21px;
    margin-left: 5px;
  }
}
.choicepay {
  color: rgba(154, 163, 173, 1);
  height: 55px;
  padding-left: 15px;
  text-align: left;
  font-size: 14px;
  line-height: 55px;
}
.balance {
  height: 50px;
  background: white;
  font-size: 14px;
  padding: 0 15px;
  .text {
    margin-left: 15px;
  }
  .switch {
    width: 18px;
    height: 18px;
  }
  .switched {
    background: url(~@/assets/moneyManage/ic_selected.png) center / 100% 100%;
  }
  .not-switch {
    background: url(~@/assets/moneyManage/ic_weixuanze.png) center / 100% 100%;
  }
  .orange {
    margin-left: 4px;
  }
  .img {
    background: url(~@/assets/moneyManage/zf_ic_wallet.png) center / 100% 100%;
    width: 17px;
    height: 18px;
    margin-top: -4px;
  }
}
.comfirn {
  background: rgba(74, 144, 226, 1);
  width: 345px;
  height: 40px;
  margin: 0 auto;
  border: 0;
  margin-top: 25px;
  font-size: 16px;
}
.auth-code {
  padding: 19px 0px 21px 0px;
  .head {
    color: rgba(49, 49, 52, 1);
    padding: 0 17px;
  }
  .inputpass {
    font-weight: 500;
    font-size: 17px;
  }
  .close {
    width: 11px;
    height: 11px;
  }
  .code {
    border-top: 1px solid rgba(212, 213, 215, 1);
    margin-top: 20px;
    padding: 17px;
    padding-bottom: 23px;
  }
  .forget {
    margin-top: 7px;
    padding-right: 17px;
    text-align: right;
    a {
      font-size: 14px;
      color: rgba(74, 144, 226, 1);
    }
  }
  .number-unit {
    // box-sizing: border-box;
    line-height: 40px;
    font-size: 18px;
    width: 40px;
    height: 40px;
    border-left: 1px solid rgba(212, 213, 215, 1);
    border-bottom: 1px solid rgba(212, 213, 215, 1);
    border-top: 1px solid rgba(212, 213, 215, 1);
    //     border-left: 1px solid red;
    // border-bottom: 1px solid red;
    // border-top: 1px solid red;
    &.te {
      border-right: 1px solid rgba(212, 213, 215, 1);
    }
  }
}
.popcode {
  width: 270px;
  z-index: 1;
  .van-password-input {
    margin: auto;
  }
  &.van-dialog {
    top: 5rem;
  }
  ul {
    height: 40px;
    li {
      width: 40px;
      height: 40px;
    }
  }
}
.nocomfirn {
  background: rgba(74, 144, 226, 0.5);
}
/deep/ .van-number-keyboard {
  z-index: 10000 !important;
}
.notice {
  width: 270px !important;
  font-size: 17px;
  .header {
    padding: 20px 20px;
    line-height: 20px;
    border-bottom: 1px solid rgba(212, 213, 215, 1);
  }
  .style-btn {
    color: #4a90e2;
    flex: 1;
    padding: 14px 0;
  }
  .te-left {
    border-right: 1px solid rgba(212, 213, 215, 1);
  }
}
</style>
<style lang="scss">
.shouquan .van-dialog__header {
  padding-left: 40px;
  padding-right: 40px;
  line-height: 20px;
}
.notSufficientFunds {
  width: 318px !important;
}
</style>

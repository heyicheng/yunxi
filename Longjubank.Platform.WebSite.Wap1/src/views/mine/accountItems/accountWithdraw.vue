
<template>
  <div class="page container graybackground">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div class="graybackground" style="height:10px;"></div>
    <p class="balance">
      账户余额:
      <span>{{balanceAmount}}</span> 元
    </p>
    <div class="graybackground" style="height:1px;"></div>
    <!-- 金额输入部分 -->
    <div class="amountinput clearfix">
      <img class="fl amounticon" src="@/assets/account/rmb.png">
      <p
        id="input"
        class="fl amount"
        :class="(withdrawAmount.length === 0)?'amountPlaceHolder':'amountNum'"
        @touchstart.stop="focuswithdrawAmount"
      >{{amountShow}}</p>
      <p class="allin fr" @click="allBalanceWithdraw">全部提现</p>
    </div>
    <van-number-keyboard
      id="keyboard"
      :show="showNumkeyboard"
      extra-key="."
      close-button-text="完成"
      @blur="keyboardClose"
      @close="keyboardClose"
      @input="keyboardInput"
      @delete="keyboardDelete"
    />
    <!-- 方式选择 -->
    <p class="modeSelectHint graybackground">选择提现方式</p>
    <div class="clearfix modeContainer">
      <div class="clearfix" style="width:100%;">
        <img src="@/assets/account/ic_putong.png" class="fl modeIcon">
        <p class="fl modeName">
          普通到账
          <span>(预计下一个工作日到账)</span>
        </p>
        <img
          :src="selectedMode === 1 ? require('@/assets/account/ic_selected.png') :require('@/assets/account/ic_unselected.png')"
          class="fr selectIcon"
          @click="selectedModeChange(1)"
        >
      </div>
    </div>
    <div class="graybackground modeSeperator"></div>
    <div class="clearfix modeContainer">
      <div class="clearfix" style="width:100%;">
        <img src="@/assets/account/ic_jishi.png" class="fl modeIcon">
        <p class="fl modeName">
          即时到账
          <span>(两小时内到账)</span>
        </p>
        <img
          :src="selectedMode === 2 ? require('@/assets/account/ic_selected.png') :require('@/assets/account/ic_unselected.png')"
          class="fr selectIcon"
          @click="selectedModeChange(2)"
        >
      </div>
    </div>
    <!-- 手续费及到账金额显示 -->
    <p class="graybackground serviceCharge">{{serviceFeeAmount}}</p>
    <p class="accountMoney">
      实际到账金额：
      <span>{{ intoAccount }}</span>元
    </p>
    <!-- 按钮及提示 -->
    <div class="graybackground operateContainer">
      <button
        type="button"
        class="withdrawBtn"
        :disabled="buttonEnabled"
        @click="confirmWithdraw"
      >提现</button>
      <div class="clearfix">
        <p class="fl hintLabel">!</p>
        <p class="fl">温馨提示</p>
      </div>
      <p>1. 具体收费标准请在“帮助中心”页面查看。</p>
      <p>
        2. 如有其他疑问请联系我们的客服
        <a href="tel:4000-119-888">4000-119-888</a>。
      </p>
      <p>3. 使用提现补偿金后，抵扣手续费金额将返还转账到账户余额。</p>
    </div>
  </div>
</template>

<script>
import { NumberKeyboard, Toast } from "vant";
import {
  GetUserAccount,
  GetCashConfig,
  CreateCashOrder,
  AccountCashNew
} from "@/api/account.js";
import { setInterval, clearInterval } from "timers";
export default {
  data() {
    return {
      withdrawAmount: "",
      showNumkeyboard: false,
      selectedMode: 1,
      account: null,
      cashConfig: null,
      serviceFeeAmount: "提现手续费0.00元",
      intoAccount: "0.00"
    };
  },
  components: {
    "van-number-keyboard": NumberKeyboard
  },
  computed: {
    amountShow() {
      if (!this.showNumkeyboard && this.withdrawAmount.length === 0) {
        return "请输入提现金额";
      }
      return this.withdrawAmount;
    },
    balanceAmount() {
      if (this.account != null && "blanceamount" in this.account) {
        return this.account.blanceamount.toFixed(2);
      }

      return "0.00";
    },
    buttonEnabled() {
      return !(
        this.withdrawAmount.length > 0 && parseFloat(this.withdrawAmount) > 0
      );
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    allBalanceWithdraw() {
      this.withdrawAmount = this.balanceAmount;
    },
    selectedModeChange(mode) {
      this.selectedMode = mode;
    },
    calcServiceAmount() {
      if (
        this.cashConfig === null ||
        Object.keys(this.cashConfig).length === 0 ||
        this.withdrawAmount.length === 0
      ) {
        this.serviceFeeAmount = "提现手续费0.00元";
        this.intoAccount = "0.00";
        return;
      }
      var _serviceFee = 0;
      var _intoAccount = parseFloat(this.withdrawAmount);
      // 普通到账
      if (this.selectedMode === 1) {
        if (this.cashConfig.commonlycounterfeetype === 1) {
          _serviceFee = this.cashConfig.commonlyrate;
        } else {
          _serviceFee =
            (Math.round(_intoAccount * this.cashConfig.commonlyrate * 100) *
              (this.cashConfig.cashday + 1)) /
              100 +
            2;
        }
      }
      // 即时到账
      else if (this.selectedMode === 2) {
        if (this.cashConfig.instantcashcounterfeetype === 1) {
          _serviceFee = this.cashConfig.instantcashrate;
        } else {
          _serviceFee =
            (Math.round(_intoAccount * this.cashConfig.instantcashrate * 100) *
              (this.cashConfig.cashday + 1)) /
              100 +
            2;
        }
      }

      if (this.cashConfig.isexceededsubsidy === 1) {
        this.serviceFeeAmount =
          "提现手续费" + _serviceFee.toFixed(2) + "元（已补贴）";
        this.intoAccount = _intoAccount.toFixed(2);
      } else {
        this.serviceFeeAmount = "提现手续费" + _serviceFee.toFixed(2) + "元";
        this.intoAccount = (_intoAccount - _serviceFee).toFixed(2);
      }
    },
    confirmWithdraw() {
      if (this.withdrawAmount.length === 0) {
        Toast("请输入正确的金额");
        return;
      }

      if (parseFloat(this.withdrawAmount) > parseFloat(this.balanceAmount)) {
        Toast("账户余额不足");
        return;
      }

      Toast.loading({ mask: true, duration: 0 });
      CreateCashOrder(this.withdrawAmount, 0)
        .then(response => {
          if (response.ResultCode != 0) {
            Toast({ message: response.ResultMsg, duration: 1500 });
          } else {
            AccountCashNew(response.Data.cashorderid, this.selectedMode)
              .then(response => {
                if (response.ResultCode != 0) {
                  Toast({ message: response.ResultMsg, duration: 1500 });
                } else {
                  Toast.clear();
                  localStorage.setItem(
                    "accountBalance",
                    JSON.stringify(response.Data)
                  );
                  this.$router.push("/withdrawCallback");
                }
              })
              .catch(error => {
                Toast({ message: "网络异常", duration: 1500 });
              });
          }
        })
        .catch(error => {
          Toast({ message: "网络异常", duration: 1500 });
        });
    },
    focuswithdrawAmount(e) {
      document.getElementById("input").classList.add("focus");
      document.getElementById("input").focus();
      if (this.showNumkeyboard != true) {
        this.showNumkeyboard = true;
      }
    },
    keyboardClose() {
      document.getElementById("input").classList.remove("focus");
      this.showNumkeyboard = false;
    },
    keyboardInput(key) {
      var result = this.withdrawAmount + key;
      var dotArr = result.split(".");

      if (dotArr.length > 2) {
        return;
      }

      if (dotArr.length === 2 && dotArr[1].length > 2) {
        return;
      }

      if (parseFloat(result) > this.balanceAmount) {
        result = this.balanceAmount;
      }
      this.withdrawAmount = result;
    },
    keyboardDelete() {
      this.withdrawAmount = this.withdrawAmount.substring(
        0,
        this.withdrawAmount.length - 1
      );
    }
  },
  mounted() {
    this.account = JSON.parse(localStorage.getItem("account"));
    GetUserAccount().then(response => {
      if (response.ResultCode === 0) {
        this.account = response.Data;
      }
    });
    GetCashConfig().then(response => {
      if (response.ResultCode === 0 && Object.keys(response.Data).length > 0) {
        this.cashConfig = response.Data;
      }
    });
    document.getElementById("keyboard").addEventListener("touchstart", e => {
      e.stopPropagation();
    });
  },
  watch: {
    selectedMode() {
      this.calcServiceAmount();
    },
    withdrawAmount() {
      this.calcServiceAmount();
    }
  }
};
</script>

<style scoped lang='scss'>
.container {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  overflow: auto;
}
.graybackground {
  background: rgba(250, 250, 250, 1);
}

.balance {
  text-indent: 15px;
  text-align: left;
  font-size: 14px;
  color: rgba(49, 49, 52, 1);
  line-height: 46px;
  background: white;
  span {
    color: rgba(255, 145, 0, 1);
  }
}

.amountinput {
  background: white;
  position: relative;
  height: 80px;
  .amounticon {
    margin-top: 40px;
    margin-left: 20px;
    width: 10px;
    height: 13px;
  }
  .amount {
    margin-top: 33px;
    margin-left: 12px;
    font-size: 24px;
    line-height: 30px;
    min-width: 200px;
    text-align: left;
  }
  .amountPlaceHolder {
    color: rgba(185, 191, 198, 1);
  }
  .amountNum {
    color: #000;
  }
  .allin {
    font-size: 16px;
    color: rgba(74, 144, 224, 1);
    margin-right: 16px;
    margin-top: 38px;
  }
}

#input.focus:after {
  content: "";
  background-color: #000;
  width: 1px;
  height: 20px;
  left: 4px;
  display: inline-block;
  overflow: hidden;
  position: relative;
  animation: opacity 1s infinite;
}
@keyframes opacity {
  0% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modeSelectHint {
  font-size: 14px;
  color: rgba(154, 163, 173, 1);
  line-height: 41px;
  text-align: left;
  text-indent: 13px;
}

.modeContainer {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  .modeIcon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    margin-left: 15px;
    margin-right: 13px;
  }

  .modeName {
    font-size: 16px;
    color: rgba(49, 49, 52, 1);
    span {
      font-size: 14px;
      color: rgba(154, 163, 173, 1);
    }
  }

  .selectIcon {
    width: 19px;
    height: 19px;
    object-fit: contain;
    margin-right: 15px;
  }
}

.modeSeperator {
  width: 360px;
  margin-left: calc(100% - 360px);
  height: 1px;
  background: rgba(237, 237, 237, 1);
}

.serviceCharge {
  font-size: 14px;
  color: rgba(250, 84, 84, 1);
  line-height: 41px;
  text-align: left;
  text-indent: 15px;
}
.accountMoney {
  font-size: 16px;
  color: rgba(49, 49, 52, 1);
  line-height: 52px;
  text-align: left;
  text-indent: 16px;
  span {
    color: rgba(255, 145, 0, 1);
  }
}

.operateContainer {
  min-height: 200px;
  text-align: left;
  .withdrawBtn {
    margin-top: 26px;
    margin-left: 15px;
    margin-bottom: 4px;
    width: 345px;
    height: 40px;
    opacity: 1;
    background: rgba(74, 144, 224, 1);
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    border-radius: 2px;
    outline: none;
    border: none;
  }
  .withdrawBtn:disabled {
    background: rgba(74, 144, 224, 1);
    opacity: 0.5;
  }
  .withdrawBtn:active {
    background: rgba(42, 117, 204, 1);
  }
  p {
    font-size: 12px;
    color: rgba(185, 191, 198, 1);
    letter-spacing: 0px;
    margin-left: 12px;
    margin-top: 12px;
    a {
      color: rgba(74, 144, 224, 1);
    }
  }
  .hintLabel {
    width: 14px;
    line-height: 14px;
    background: rgba(185, 191, 198, 1);
    border-radius: 7px;
    color: white;
    text-align: center;
    margin-right: -5px;
  }
}
</style>

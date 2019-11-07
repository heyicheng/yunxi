<template>
  <div class="page container usualbackground">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div class="usualbackground" style="height:11px;"></div>
    <p class="balance">
      可用余额:
      <span>{{balanceAmount}}</span>元
    </p>
    <!-- 有银行卡的显示 -->
    <div v-if="hasBankcard" class="carditem hascard">
      <div class="fl banklogo whitebackground">
        <img class="banklogopic" :src="bankcard.logo" alt>
      </div>
      <p class="fl bankname">
        {{ bankcard.name }}
        <span>借记卡</span>
      </p>
      <img class="fr fastcard" src="@/assets/account/fast_payment.png">
      <p class="fl cardnum">{{bankcard.number}}</p>
    </div>
    <!-- 无银行卡的显示 -->
    <div v-else class="carditem nocard">
      <div class="fl banklogo graybackground">
        <img class="banklogopic" src="@/assets/account/bankcard.png" alt>
      </div>
      <div class="fl">
        <p class="bankname">未绑定银行卡</p>
        <p class="bindhint">首次充值后绑卡</p>
      </div>
    </div>
    <!-- 金额输入页面 -->
    <div class="amountinput clearfix" @touchstart.stop="focusRechargeAmount">
      <img class="fl amounticon" src="@/assets/account/rmb.png">
      <p
        id="input"
        class="fl amount"
        :class="(rechargeAmount.length === 0)?'amountPlaceHolder':'amountNum'"
        @touchstart.stop="focusRechargeAmount"
      >{{amountShow}}</p>
    </div>
    <van-number-keyboard
      id="keyboard"
      :show="showNumkeyboard"
      extra-key="."
      close-button-text="完成"
      @close="keyboardClose"
      @input="keyboardInput"
      @delete="keyboardDelete"
      @blur="keyboardClose"
    />
    <!-- 充值按钮及以下 -->
    <div class="operate">
      <button
        type="button"
        class="rechargeButton"
        :disabled="buttonEnabled"
        @click="accountCharge"
      >充值</button>
      <div class="rechargeHint clearfix">
        <p class="fl hintIcon">!</p>
        <p class="fl">温馨提示</p>
      </div>
      <p class="paragraph">1. 首次充值将绑定您使用的银行卡为默认银行卡，请选择您的常用银行卡。</p>
      <p class="paragraph">2. 充值、提现操作只能使用默认银行卡。</p>
      <p class="paragraph">3. 默认银行卡的解绑、更换操作需要您到合作支付平台进行操作。</p>
      <p class="paragraph">4. 最低充值金额为100元。</p>
    </div>
  </div>
</template>

<script>
import { NumberKeyboard, Toast } from "vant";
import {
  GetBankcardList,
  GetUserAccountInfo,
  GetUserAccount,
  CreateChargeOrder,
  AccountCharge
} from "@/api/account.js";
import openEscrow from "@@/openEscrow/openEscrowAccount.js";

export default {
  data() {
    return {
      rechargeAmount: "",
      showNumkeyboard: false,
      bankcardList: null,
      account: null,
      accountInfo: null
    };
  },
  components: {
    "van-number-keyboard": NumberKeyboard
  },
  computed: {
    // 账户下是否拥有银行卡
    hasBankcard() {
      return this.bankcardList && this.bankcardList.length > 0;
    },
    // 银行卡信息
    bankcard() {
      var params = {
        name: "unknown",
        logo: require("@/assets/account/bankcard.png"),
        number: "**** **** **** ****"
      };
      if (this.bankcardList.length === 0) {
        return params;
      }

      let bankcard = this.bankcardList[0];
      params.name = bankcard.bankname;
      params.logo = bankcard.banklogo;
      if (bankcard.bankcardno.length >= 4) {
        params.number =
          "**** **** **** " +
          bankcard.bankcardno.slice(-4, bankcard.bankcardno.length);
      }
      return params;
    },
    // 显示输入框文字
    amountShow() {
      if (!this.showNumkeyboard && this.rechargeAmount.length === 0) {
        return "请填写充值金额";
      }
      return this.rechargeAmount;
    },
    // 余额
    balanceAmount() {
      if (this.account != null && "blanceamount" in this.account) {
        return this.account.blanceamount.toFixed(2);
      }

      return "0.00";
    },
    // 是否启用按钮
    buttonEnabled() {
      return !(
        this.rechargeAmount.length > 0 && parseFloat(this.rechargeAmount) > 0
      );
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    focusRechargeAmount(e) {
      document.getElementById("input").classList.add("focus");
      document.getElementById("input").focus();
      if (this.showNumkeyboard != true) {
        this.showNumkeyboard = true;
      }
    },
    accountCharge() {
      Toast.loading({ mask: true, duration: 0 });
      // 获取账户信息
      GetUserAccountInfo().then(response => {
        if (response.ResultCode != 0) {
          Toast({ message: response.ResultMsg, duration: 1500 });
          return;
        }

        // 未开户 或者 未开通自动投标
        if (response.Data.isopenescrow != 1 || !response.Data.isautobid) {
          Toast.clear();
          openEscrow();
          return;
        }

        this.accountChargeGetbankCardlist();
      });
    },
    accountChargeGetbankCardlist() {
      GetBankcardList()
        .then(response => {
          if (response.ResultCode != 0) {
            Toast({ message: response.ResultMsg, duration: 1500 });
            return;
          }

          var bankcardid = 0;
          if (
            "bankcardlist" in response.Data &&
            response.Data.bankcardlist.length > 0
          ) {
            bankcardid = response.Data.bankcardlist[0].bankcardid;
          }

          this.accountChargeCreateOrder(bankcardid);
        })
        .catch(error => {
          Toast({ message: "网络异常", duration: 1500 });
        });
    },
    accountChargeCreateOrder(bankcardid) {
      CreateChargeOrder(this.rechargeAmount, bankcardid)
        .then(response => {
          if (response.ResultCode != 0) {
            Toast({ message: response.ResultMsg, duration: 1500 });
            return;
          }

          if ("chargeorderid" in response.Data) {
            this.accountChargeOrderCharge(response.Data.chargeorderid);
          }
        })
        .catch(error => {
          Toast({ message: "网络异常", duration: 1500 });
        });
    },
    accountChargeOrderCharge(orderid) {
      AccountCharge(orderid)
        .then(response => {
          if (response.ResultCode != 0) {
            Toast({ message: response.ResultMsg, duration: 1500 });
          } else {
            Toast.clear();
            localStorage.setItem(
              "accountBalance",
              JSON.stringify(response.Data)
            );
            this.$router.push("/rechargeCallback");
          }
        })
        .catch(error => {
          Toast({ message: "网络异常", duration: 1500 });
        });
    },
    keyboardClose() {
      document.getElementById("input").classList.remove("focus");
      this.showNumkeyboard = false;
    },
    keyboardInput(key) {
      var dotArr = this.rechargeAmount.split(".");
      if (dotArr.length >= 2 && dotArr[1].length >= 2) {
        return;
      }
      this.rechargeAmount += key;
    },
    keyboardDelete() {
      this.rechargeAmount = this.rechargeAmount.substring(
        0,
        this.rechargeAmount.length - 1
      );
    }
  },
  mounted() {
    this.account = JSON.parse(localStorage.getItem("account"));
    this.accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
    GetBankcardList()
      .then(response => {
        if (response.ResultCode != 0) {
          Toast({ message: response.ResultMsg, duration: 1500 });
        } else {
          this.bankcardList = response.Data.bankcardlist;
        }
      })
      .catch(error => {
        Toast({ message: "网络异常", duration: 1500 });
      });
    GetUserAccount().then(response => {
      if (response.ResultCode === 0) {
        this.account = response.Data;
      }
    });
    GetUserAccountInfo().then(response => {
      if (response.ResultCode == 0) {
        this.accountInfo = response.Data;
        localStorage.setItem("accountInfo", JSON.stringify(this.accountInfo));
      }
    });
    document.getElementById("keyboard").addEventListener("touchstart", e => {
      e.stopPropagation();
    });
  }
};
</script>

<style scoped lang='scss'>
.container {
  position: fixed;
  width: 100%;
  height: 100%;
}

.usualbackground {
  background: rgba(250, 250, 250, 1);
}

.balance {
  margin-top: 25px;
  margin-left: 15px;
  text-align: left;
  font-size: 14px;
  color: rgba(49, 49, 52, 1);
  span {
    color: rgba(255, 145, 0, 1);
  }
}

.hascard {
  box-shadow: 0px 10px 28px 0px rgba(45, 127, 255, 0.75);
  background: linear-gradient(rgba(88, 159, 239, 1), rgba(74, 144, 224, 1));
}
.nocard {
  background: rgba(212, 214, 216, 1);
  box-shadow: 0px 10px 28px 0px rgba(209, 209, 209, 0.75);
}

.carditem {
  position: relative;
  margin: 18px auto 0 auto;
  width: 345px;
  height: 80px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  text-align: left;
  .banklogo {
    width: 44px;
    height: 44px;
    border-radius: 22px;
    margin-left: 16px;
    margin-top: 18px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .banklogopic {
      object-fit: contain;
      width: 70%;
      height: 70%;
    }
  }
  .whitebackground {
    background: white;
  }
  .graybackground {
    background: rgba(238, 238, 238, 1);
  }
  .bankname {
    margin-top: 21px;
    margin-left: 11px;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
    span {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }
  }
  .fastcard {
    margin-top: 22px;
    margin-right: 16px;
    width: 48px;
    height: 12px;
  }
  .cardnum {
    margin-left: 11px;
    margin-top: 14px;
    font-size: 24px;
    color: rgba(255, 255, 255, 1);
  }
  .bindhint {
    font-size: 12px;
    color: rgba(241, 241, 241, 1);
    margin-left: 11px;
    margin-top: 14px;
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
  }
  .amountPlaceHolder {
    color: rgba(185, 191, 198, 1);
  }
  .amountNum {
    color: #000;
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

.operate {
  background: rgba(250, 250, 250, 1);
  min-height: 340px;
  .rechargeButton {
    width: 345px;
    height: 40px;
    background: rgba(255, 145, 0, 1);
    border: none;
    outline: none;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    border-radius: 2px;
    margin-top: 26px;
  }
  .rechargeButton:disabled {
    background: rgba(255, 145, 0, 0.5);
    opacity: 0.5;
  }
  .rechargeButton:active {
    background: rgba(255, 114, 0, 1);
  }
  p {
    font-size: 12px;
    color: rgba(185, 191, 198, 1);
    text-align: left;
  }
  .rechargeHint {
    margin-top: 15px;
    margin-left: 17px;
    line-height: 17px;
    .hintIcon {
      color: white;
      background: rgba(185, 191, 198, 1);
      width: 14px;
      line-height: 14px;
      border-radius: 7px;
      text-align: center;
      margin-right: 7px;
      margin-bottom: 5px;
    }
  }
  .paragraph {
    width: 344px;
    margin-left: 17px;
    margin-top: 12px;
    line-height: 17px;
  }
}
</style>

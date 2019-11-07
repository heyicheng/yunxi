<template>
  <div class="showbuttonCallback" v-if="dictForShow && dictForShow.showBtn">
    <img class="callbackImage" :src="dictForShow.icon">
    <p class="callbackResultMsg">{{ dictForShow.msg }}</p>
    <p
      v-if="dictForShow.secmsg && dictForShow.desc.length > 0"
      class="callbackResultDesc"
    >{{ dictForShow.secmsg }}</p>
    <button class="callbackButton" @click="finishClick">完成</button>
  </div>
  <div class="normalCallback" v-else-if="dictForShow && !dictForShow.showBtn">
    <img class="normalCallbackImg" :src="dictForShow.icon">
    <p class="normalMsg" :class="dictForShow.msgClass" v-html="dictForShow.msg"></p>
    <div class="responseMsg" v-if="dictForShow.desc && dictForShow.desc.length > 0">
      <div class="normalSeperate"></div>
      <p class="normalResponseMsg">{{ dictForShow.desc }}</p>
    </div>
  </div>
</template>

<script>
import { GetChargeResult } from "@/api/account.js";
import { setInterval, clearInterval } from "timers";

export default {
  data() {
    return {
      cmdId: "",
      RespCode: "",
      RespDesc: "",
      secRespDesc: "",
      order: "",
      cashChannel: "",
      dictForShow: null,
      tryCount: 0
    };
  },
  computed: {
    successDict() {
      return {
        UserRegister: {
          icon: require("@/assets/huifucallback/home.png"),
          msg: "您的资金存管账户已开通成功！",
          desc: "",
          showBtn: true
        },
        AutoTenderPlan: {
          icon: require("@/assets/huifucallback/home.png"),
          msg: "您的自动投标已开通成功！",
          desc: "",
          showBtn: true
        },
        NetSave: {
          icon: require("@/assets/huifucallback/ic_paysuccess.png"),
          msg: "充值成功",
          desc: "",
          showBtn: false,
          msgClass: "normalBlue"
        },
        Cash: {
          icon: require("@/assets/huifucallback/ic_paysuccess.png"),
          msg: "提现成功",
          desc: "",
          showBtn: false,
          msgClass: "normalBlue"
        }
      };
    },
    failedDict() {
      return {
        UserRegister: {
          icon: require("@/assets/huifucallback/recharge_lose.png"),
          msg: this.RespDesc,
          desc: "",
          showBtn: true
        },
        AutoTenderPlan: {
          icon: require("@/assets/huifucallback/recharge_lose.png"),
          msg: this.RespDesc,
          desc: "",
          showBtn: true
        },
        NetSave: {
          icon: require("@/assets/huifucallback/ic_fail.png"),
          msg: "充值失败",
          desc: this.RespDesc,
          showBtn: false,
          msgClass: "normalGray"
        },
        Cash: {
          icon: require("@/assets/huifucallback/ic_fail.png"),
          msg: "提现失败",
          desc: this.RespDesc,
          showBtn: false,
          msgClass: "normalGray"
        }
      };
    }
  },
  mounted() {
    this.cmdId = this.$route.query.cmdId;
    this.RespCode = this.$route.query.RespCode;
    this.RespDesc = this.$route.query.RespDesc;
    this.secRespDesc = this.$route.query.secRespDesc;
    this.order = this.$route.query.order;
    this.cashChannel = this.$route.query.cashChannel;

    if (this.RespCode === "000") {
      this.dictForShow = this.successDict[this.cmdId];
    } else {
      this.dictForShow = this.failedDict[this.cmdId];
    }

    // 充值处理中
    if (this.cmdId === "NetSave" && this.RespCode === "443") {
      this.dictForShow.icon = require("@/assets/huifucallback/ic_waiting.png");
      this.dictForShow.msg = "充值处理中！请稍候...";
      this.dictForShow.desc = this.respDesc;
      this.dictForShow.msgClass = "normalOrange";
      this.loopQueryChargeResult();
    } else if (this.cmdId === "Cash") {
      // 提现处理中
      if (this.RespCode === "999") {
        this.dictForShow = this.successDict[this.cmdId];
        this.dictForShow.msg = "提现处理中";
        this.dictForShow.msgClass = "normalOrange";
        this.dictForShow.icon = require("@/assets/huifucallback/ic_waiting.png");
      }
      // 提现成功
      if (this.RespCode === "000" || this.RespCode === "999") {
        if (this.cashChannel === "GENERAL") {
          this.dictForShow.desc = "预计到账时间：下一个工作日";
        } else if (this.cashChannel === "IMMEDIATE") {
          this.dictForShow.desc = "预计到账时间：2小时内";
        }
      }
    }
  },
  methods: {
    queryChargeResult() {
      GetChargeResult(this.order)
        .then(response => {
          if (response.ResultCode === 0) {
            this.dictForShow.msg = response.ResultMsg;
            if (
              response.ResultMsg.includes("成功") &&
              !response.ResultMsg.includes("失败")
            ) {
              this.dictForShow.icon = require("@/assets/huifucallback/ic_paysuccess.png");
            } else {
              this.dictForShow.icon = require("@/assets/huifucallback/ic_fail.png");
            }
          } else {
            this.loopQueryChargeResult();
          }
        })
        .catch(error => {
          this.loopQueryChargeResult();
        });
    },
    loopQueryChargeResult() {
      if (this.tryCount >= 5) {
        this.dictForShow.msg = "请稍后查看，<br>如有问题请联系客服";
        return;
      }
      var queryInterval = setInterval(() => {
        this.tryCount += 1;
        this.queryChargeResult();
        clearInterval(queryInterval);
      }, 2000);
    },
    finishClick() {
      if (window.closeView) {
        window.closeView();
      } else if (window.parent === window) {
        this.$router.replace("/myaccount");
      } else {
        window.parent.location.replace("/myaccount");
      }
    }
  }
};
</script>

<style scoped lang='scss'>
.showbuttonCallback {
  position:fixed;
  width: 100%;
  height: 100%;
  background: white;
  .callbackImage {
    margin-top: 60px;
    width: 89px;
    height: 89px;
    object-fit: contain;
  }

  .callbackResultMsg {
    margin-top: 32px;
    opacity: 1;
    font-size: 16px;
    color: rgba(49, 49, 52, 1);
  }

  .callbackResultDesc {
    width: 100%;
    text-align: center;
    letter-spacing: 1px;
    font-size: 20px;
    color: #3c3c3c;
  }

  .callbackButton {
    width: calc(100% - 30px);
    height: 40px;
    color: #fff;
    border-radius: 2px;
    background: rgba(74, 144, 226, 1);
    font-size: 16px;
    cursor: pointer;
    margin-top: 40px;
    border: none;
    outline: none;
  }

  .callbackButton:active {
    opacity: 0.5;
  }
}

.normalCallback {
  position:fixed;
  width: 100%;
  height: 100%;
  background: white;
  .normalCallbackImg {
    margin-top: 60px;
    width: 68px;
    height: 68px;
    object-fit: contain;
  }
  .normalMsg {
    margin-top: 23px;
    font-size: 24px;
    font-weight: bold;
  }
  .normalOrange {
    color: rgba(255, 145, 0, 1);
  }
  .normalGray {
    color: #b9bfc6;
  }
  .normalBlue {
    color: #4a90e0;
  }

  .responseMsg {
    position: absolute;
    top: 50%;
    width: 100%;
    .normalSeperate {
      margin-bottom: 15px;
      margin-left: 33px;
      width: calc(100% - 66px);
      height: 2px;
      background: #f4f4f4;
    }
    .normalResponseMsg {
      margin-top: 5px;
      width: 100%;
      font-size: 16px;
      color: rgba(185, 191, 198, 1);
    }
  }
}
</style>

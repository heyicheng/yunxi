<template>
  <div class="jdCard" :class="card.isValidate ? 'activeBackground':'expriedBackground'">
    <img v-if="card.isValidate" src="@/assets/account/jdcard_icon.png" class="jdCardIcon">
    <img v-else src="@/assets/account/jdcard_icon_expired.png" class="jdCardIcon">
    <div class="clearfix"></div>
    <p ref="jdCard" class="fl cardHint" v-html="card.cardHint"></p>
    <div class="clearfix"></div>
    <p
      class="cardSource"
      :class="card.isValidate ? 'cardSourceOrange':'cardSourceGray'"
    >获奖来源: {{card.cardSource}}</p>
    <p class="cardExpiredDate">{{card.cardExpired}}</p>
    <div class="cardNum">
      <p class="cardAmount">&yen;{{card.cardNum }}</p>
      <p class="cardStatus">{{ card.cardStatus}}</p>
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { Toast } from "vant";
export default {
  data() {
    return {
      shouldCopyPwd: false
    };
  },
  props: ["jdcard"],
  computed: {
    card() {
      var params = {
        isValidate: true,
        cardHint: "",
        cardSource: "",
        cardExpired: "",
        cardNum: 100,
        cardStatus: ""
      };
      if (this.jdcard) {
        params.isValidate = this.jdcard.prizestatus != 2;
        params.cardSource = this.jdcard.cardsourcename;
        params.cardNum = this.jdcard.prizeparameter;
        if (this.jdcard.prizestatus === 0) {
          params.cardStatus = "投资后激活";
          params.cardExpired =
            "有效期至：" + this.jdcard.expiretime.split(" ")[0];
        } else if (this.jdcard.prizestatus === 1) {
          if ("sendtime" in this.jdcard) {
            params.cardExpired =
              "发放时间：" + this.jdcard.sendtime.split(" ")[0];
          } else {
            params.cardExpired = "";
          }

          params.cardStatus = "已激活";
        } else if (this.jdcard.prizestatus === 2) {
          params.cardExpired = this.jdcard.expiretime.split(" ")[0] + "过期";
          params.cardStatus = "已过期";
        }

        if (this.jdcard.prizestatus === 1) {
          if (this.jdcard.sendstate != 2) {
            params.cardHint = this.jdcard.remark;
          } else {
            params.cardHint =
              "账号: " +
              this.jdcard.cardno +
              "<br/>密码: " +
              this.jdcard.cardpassword;
          }
        } else {
          var hintArr = [];
          for (const index in this.jdcard.memberprizes) {
            let dic = this.jdcard.memberprizes[index];
            if (dic.prizelimitingcondition === 1 && dic.investlimit === 1) {
              hintArr.push(
                "单笔投资" +
                  dic.investday +
                  "天项目满" +
                  dic.prizelimitingparameter +
                  "元"
              );
            } else if (
              dic.prizelimitingcondition === 1 &&
              dic.investlimit === 2
            ) {
              hintArr.push(
                "单笔投资" +
                  dic.investday +
                  "天及以上项目满" +
                  dic.prizelimitingparameter +
                  "元"
              );
            } else if (
              dic.prizelimitingcondition === 1 &&
              dic.investlimit === 3
            ) {
              hintArr.push(
                "单笔投资" +
                  dic.investday +
                  "天以内项目满" +
                  dic.prizelimitingparameter +
                  "元"
              );
            } else if (dic.prizelimitingcondition === 1) {
              hintArr.push("单笔投资满" + dic.prizelimitingparameter + "元");
            } else if (dic.investlimit === 1) {
              hintArr.push(
                "年化金额" +
                  dic.investday +
                  "天项目满" +
                  dic.prizelimitingparameter +
                  "元"
              );
            } else if (dic.investlimit === 2) {
              hintArr.push(
                "年化金额" +
                  dic.investday +
                  "天及以上项目满" +
                  dic.prizelimitingparameter +
                  "元"
              );
            } else if (dic.investlimit === 3) {
              hintArr.push(
                "年化金额" +
                  dic.investday +
                  "天以内项目满" +
                  dic.prizelimitingparameter +
                  "元"
              );
            } else {
              hintArr.push("年化金额" + dic.prizelimitingparameter + "元");
            }
          }
          params.cardHint = hintArr.join("<br/>或");
        }
      }
      return params;
    }
  },
  mounted() {
    this.$refs["jdCard"].addEventListener("click", e => {
      if (
        this.jdcard.prizestatus === 1 &&
        this.jdcard.sendstate === 2 &&
        this.shouldCopyPwd
      ) {
        const input = document.createElement("input");
        document.body.appendChild(input);
        input.select();
        input.setAttribute("value", this.jdcard.cardpassword);
        input.readOnly = true;
        input.contentEditable = true;
        input.setSelectionRange(0, 999);
        if (document.execCommand("copy")) {
          document.execCommand("copy");
        }
        document.body.removeChild(input);
      }
    });
    this.$refs["jdCard"].addEventListener("touchstart", e => {
      var _self = this;
      _self.shouldCopyPwd = false;
      if (this.jdcard.prizestatus === 1 && this.jdcard.sendstate === 2) {
        _self.touchTimer = setTimeout(e => {
          _self.shouldCopyPwd = true;
          Toast({ message: "京东卡密码已复制到剪切版", duration: 1500 });
        }, 500);
      }
    });
    this.$refs["jdCard"].addEventListener("touchend", e => {
      var _self = this;
      if (_self.touchTimer) {
        clearTimeout(_self.touchTimer);
      }
    });
  }
};
</script>

<style scoped lang='scss'>
.jdCard {
  margin-left: 15px;
  width: calc(100% - 30px);
  background-size: 100% 100%;
  box-shadow: 0px 2px 12px 0px rgba(195, 195, 195, 0.2);
  position: relative;
  overflow: hidden;
  text-align: left;
}

.activeBackground {
  background-image: url("../../assets/account/jd_card.png");
}

.expriedBackground {
  background-image: url("../../assets/account/jdcard_disabled.png");
}

.jdCard .cardHint {
  font-size: 12px;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  margin-top: 16px;
  margin-left: 10px;
  min-height: 30px;
}

.jdCard .cardSource {
  font-size: 10px;
  text-align: left;
  margin-top: 11px;
  margin-left: 10px;
  margin-bottom: 17px;
  float: left;
}

.jdCard .cardSourceOrange {
  color: rgba(255, 209, 174, 1);
}

.jdCard .cardSourceGray {
  color: rgba(250, 250, 250, 1);
}

.jdCard .cardExpiredDate {
  float: right;
  font-size: 10px;
  color: rgba(249, 249, 249, 1);
  text-align: right;
  margin-top: 11px;
  margin-right: 12px;
}

.jdCard .jdCardIcon {
  width: 63px;
  height: 18px;
  margin-left: 0px;
  margin-top: 12px;
}

.jdCard .cardNum {
  position: absolute;
  top: 11px;
  right: 12px;
  text-align: right;
  .cardAmount {
    font-size: 24px;
    color: rgba(255, 255, 255, 1);
  }
  .cardStatus {
    margin-top: 6px;
    font-size: 11px;
    color: rgba(255, 255, 255, 1);
  }
}
</style>

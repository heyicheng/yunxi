<template>
  <div class="coupons" :class="item.backgroundImage" @click="choicedCoupon({mpno:item.mpno,typeLabel:item.typeLabel,mpparameter:item.couponNum,mpday:item.mpday})">
    <div class="clearfix fl leftContent">
      <p class="typeDetail">{{item.typeDetail}}</p>
      <p class="typeHint">{{item.typeLabel}}</p>
    </div>
    <div class="clearfix fl rightContent">
      <p
        class="validDate"
        :class="item.isvalidate ? 'couponNumBlackColor' :'couponNumGrayColor'"
      >有效期至：{{item.expiredTime}}</p>
      <p class="couponNum" :class="item.numColor">
        {{item.couponNum}}
        <span>{{item.couponUnit}}</span>
      </p>
      <p v-html="item.couponDesc" class="couponDesc"></p>
    </div>
    <template v-if="item.couponLogo.length >0">
      <img v-if="item.smallLogo" class="couponsLogo" :src="item.couponLogo" alt>
      <img v-else class="couponsBigLogo" :src="item.couponLogo" alt>
    </template>
  </div>
</template>

<script>
export default {
  props: ["coupon"],
  computed: {
    item() {
      var params = {
        typeDetail: "",
        typeLabel: "",
        expiredTime: "",
        couponNum: "0.00",
        couponUnit: "",
        couponDesc: "",
        couponLogo: "",
        backgroundImage: "",
        isvalidate: true,
        smallLogo: true,
        numColor: ""
      };
      if (this.coupon) {
        if (this.coupon.mptype === 1) {
          //  理财金券
          params.typeDetail = this.coupon.mpday === 0 ? "" : "体验天数:" + this.coupon.mpday +"天";
          params.typeLabel = "理财金券";
          params.expiredTime = this.coupon.expiretime.split(" ")[0];
          params.couponNum = this.coupon.mpparameter.toFixed(2);
          params.couponUnit = "元"; 

          params.backgroundImage = "experienceBackground";
          params.numColor = "couponNumBlueColor";
        } else if (this.coupon.mptype === 2) {
          //  加息券
          params.typeDetail = this.coupon.mpday === 0 ? "" : "加息天数:" + this.coupon.mpday +"天";;
          params.typeLabel = "加息券";
          params.expiredTime = this.coupon.expiretime.split(" ")[0];
          params.couponNum = this.coupon.mpparameter < 1 ?this.coupon.mpparameter.toFixed(2)*100 :this.coupon.mpparameter.toFixed(2);
          params.couponUnit = "%";

          params.backgroundImage = "rateBackground";
          params.numColor = "couponNumRedColor";
        } else if (this.coupon.mptype === 3) {
          //  现金券
          params.typeDetail = "投资后可提现";
          params.typeLabel = "现金券";
          params.expiredTime = this.coupon.expiretime.split(" ")[0];
          params.couponNum = this.coupon.mpparameter.toFixed(2);
          params.couponUnit = "元";
          params.backgroundImage = "cashBackground";
          params.numColor = "couponNumOrangeColor";
        }

        // 过期
        if (this.coupon.mpstatus === 2) {
          params.isvalidate = false;
          params.smallLogo = false;
          params.backgroundImage = "disabledBackground";
          params.numColor = "couponNumGrayColor";
          params.couponLogo = require("@/assets/account/quan_expired_logo.png");
        } else if (this.coupon.mpstatus === 1) {
          params.isvalidate = false;
          params.backgroundImage = "disabledBackground";
          params.numColor = "couponNumGrayColor";
          params.couponLogo = require("@/assets/account/quan_used.png");
        } else {
          if (this.coupon.remindmpstatus === 1) {
            // 新增
            params.couponLogo = require("@/assets/account/quan_new_logo.png");
          } else if (this.coupon.remindmpstatus === 2) {
            // 即将过期
            params.couponLogo = require("@/assets/account/quan_willExprired_logo.png");
          }
        }

        if (this.coupon.investlimit === 0) {
          params.couponDesc =
            "投资满" + this.coupon.mplimitingparameter.toFixed(2) + "元";
        } else if (this.coupon.investlimit === 1) {
          params.couponDesc =
            "投资满" +
            this.coupon.mplimitingparameter.toFixed(2) +
            "元,仅用于" +
            this.coupon.investday +
            "天项目";
        } else if (this.coupon.investlimit === 2) {
          params.couponDesc =
            "投资满" +
            this.coupon.mplimitingparameter.toFixed(2) +
            "元,可用于满" +
            this.coupon.investday +
            "天项目";
        } else if (this.coupon.investlimit === 3) {
          params.couponDesc =
            "投资满" +
            this.coupon.mplimitingparameter.toFixed(2) +
            "元,可用于" +
            this.coupon.investday +
            "天以内项目";
        }
        if (this.coupon.mptype === 2 && this.coupon.mpamount > 0) {
          params.couponDesc +=
            "<br/>" + "超" + this.coupon.mpamount.toFixed(2) + "元部分不享加息";
        }

        // 在订单提交页需要优惠券 编号
        params.mpno = this.coupon.mpno;
        params.mpday=this.coupon.mpday
      }
      return params;
    }
  },
  methods: {
    choicedCoupon(mpno) {
      this.$emit('getCouponNo',mpno)
    }
  },
  mounted() {}
};
</script>

<style scoped lang='scss'>
.coupons {
  margin-left: 15px;
  width: calc(100% - 30px);
  height: 100px;
  background-size: 100% 100%;
  box-shadow: 0px 2px 12px 0px rgba(195, 195, 195, 0.2);
  position: relative;
}

.rateBackground {
  background-image: url("../../assets/account/quan_raise.png");
}
.experienceBackground {
  background-image: url("../../assets/account/quan_experience.png");
}
.cashBackground {
  background-image: url("../../assets/account/quan_cash.png");
}
.disabledBackground {
  background-image: url("../../assets/account/coupon_disabled.png");
}

.coupons .leftContent {
  width: 115px;
  display: flex;
  flex-direction: column;
  .typeDetail {
    margin-top: 35px;
    margin-bottom: 13px;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .typeHint {
    font-size: 16px;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
  }
}
.coupons .rightContent {
  position: relative;
  width: calc(100% - 115px);
  .validDate {
    margin-top: 6px;
    margin-left: 10px;
    font-size: 10px;
    text-align: left;
  }
  .couponNum {
    margin-top: 18px;
    font-size: 32px;
    width: 100%;
    span {
      font-size: 16px;
    }
  }
  .couponNumBlackColor {
    color: rgba(49, 49, 52, 1);
  }
  .couponNumBlueColor {
    color: rgba(74, 144, 224, 1);
  }
  .couponNumOrangeColor {
    color: rgba(255, 145, 0, 1);
  }
  .couponNumGrayColor {
    color: rgba(154, 163, 173, 1);
  }
  .couponNumRedColor {
    color: rgba(250, 84, 84, 1);
  }
  .couponDesc {
    margin-top: 6px;
    font-size: 10px;
    color: rgba(154, 163, 173, 1);
    word-wrap: break-word;
    word-break: break-all;
  }
}

.coupons .couponsLogo {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.coupons .couponsBigLogo {
  position: absolute;
  top: 0px;
  right: 0px;
  width: 57px;
  height: 53px;
  object-fit: contain;
}
</style>

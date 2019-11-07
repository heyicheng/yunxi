<template>
  <div class="coupons" :class="item.backgroundImage">
    <div class="clearfix fl leftContent">
      <p class="typeDetail">1444</p>
      <p class="typeHint">{item.typeLabel}}</p>
    </div>
    <div class="clearfix fl rightContent">
      <p
        class="validDate"
        :class="item.isvalidate ? 'couponNumBlackColor' :'couponNumGrayColor'"
      >有效期至：{tem.expiredTime}}</p>
      <p class="couponNum" :class="item.numColor">
        tem.couponNum}}<span>{tem.couponUnit}}</span>
      </p>
      <p v-html="item.couponDesc" class="couponDesc"></p>
    </div>
    <template v-if="item.couponLogo.length >0">
      <img v-if="item.smallLogo" class="couponsLogo" :src="item.couponLogo" alt>
      <img v-else class="couponsBigLogo" :src="item.couponLogo" alt>
    </template>
  </div>
</template>

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
  .typeDetail {
    margin-top: 35px;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .typeHint {
    margin-top: 13px;
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

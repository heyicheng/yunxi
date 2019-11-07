<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title"></van-nav-bar>
    <div class="payresult-bg">
      <div class="pay-img" :class="success?'pay-suc':'pay-fail'"></div>
      <div class="paytext">
        <span v-if="success" class="suc-text">支付成功</span>
        <span v-else class="fail-text">支付失败</span>
      </div>
      <div class="pay-info">
        <span class="title">支付信息:</span>
        <span class="gray" style="margin-left:15px">{{$route.query.planname}}</span>
      </div>
      <div class="pay-amount">
        <span class="title">支付金额:</span>
        <span class="blue" style="margin-left:15px">{{Number($route.query.amount).toFixed(2)}}元</span>
      </div>
    </div>
    <van-button class="ok" @click="$router.replace({name:'home'})" type="info">完成</van-button>
  </div>
</template>


<script>
export default {
  data() {
    return {
      success: this.$route.query.payResult == "success" ? true : false
    };
  },
};
</script>

<style lang="scss" scoped>
$blue: rgba(74, 144, 226, 1);
$gray: rgba(154, 163, 173, 1);
.gray {
  color: $gray;
}
.blue {
  color: $blue;
}
.page {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(248, 248, 248, 1);
}
.payresult-bg {
  width: 367px;
  height: 273px;
  margin: 0 auto;
  background: url(~@/assets/moneyManage/paybg.png) center / 100% 100%;
  position: relative;
  .pay-img {
    width: 68px;
    height: 68px;
    position: absolute;
    top: 30px;
    left: 150px;
    &.pay-suc {
      background: url(~@/assets/moneyManage/ic_paysuccess.png) center/100% 100%;
    }
    &.pay-fail {
      background: url(~@/assets/moneyManage/ic_fail.png) center/100% 100%;
    }
  }
  .paytext {
    font-size: 16px;
    position: absolute;
    top: 113px;
    left: 153px;
    // margin:  0 auto;
    .fail-text {
      color: $gray;
    }
    .suc-text {
      color: $blue;
    }
  }
}
.pay-info {
  font-size: 14px;
  position: absolute;
  left: 30px;
  top: 180px;
}
.pay-amount {
  position: absolute;
  left: 30px;
  top: 210px;
  font-size: 14px;
}
.title {
  color: rgba(49, 49, 52, 1);
}
.ok {
  background: $blue;
  color: white;
  width: 345px;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
}
</style>
<template>
  <div class="foot">
    <div class="foot-warning flex-row-center">
      <div class="dan"></div>
      <div style="margin:0 5px"> 市场有风险，投资需谨慎 </div>
      <div class="dan"></div>
    </div>
    <div class="foot-notice flex-row-center" v-show="false">
      <img class="foot-notice-img" src="@/assets/home/foot_ic_protect.png" alt>
      <span class="foot-notice-text">账户资金安全由安心财险承保</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dan{
  width: 30px;
  border-top: 1px solid #ededed;
  // color: #ededed
}
.foot {
  background: rgba(250, 250, 250, 1);
}
.foot-warning {
  font-size: 10px;
  // vertical-align: baseline;
  color: rgba(154, 163, 173, 1);
}
.foot-notice {
  margin-top: 18px;
}
.foot-notice-img {
  width: 14px;
  height: 14px;
}
.foot-notice-text {
  color: rgba(99, 105, 118, 1);
  font-size: 12px;
  line-height: 14px;
  margin-left: 6px;
}
</style>

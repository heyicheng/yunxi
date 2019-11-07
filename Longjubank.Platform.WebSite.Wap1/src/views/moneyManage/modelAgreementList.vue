<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK()"></van-nav-bar>
    <ul class="agreement">
      <li
        class="agreement-unit flex-row-between"
        @click="goPage('/p2ph5/person/protocol/manageInvest.html','债券投资咨询与服务协议')"
      >
        <div class>《债权投资咨询与服务协议》</div>
        <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
      </li>
      <li
        class="agreement-unit flex-row-between"
        @click="goPage('/p2ph5/person/protocol/guaranteeContract.html','保证合同')"
      >
        <div class>《保证合同》</div>
        <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
      </li>
      <li
        class="agreement-unit flex-row-between"
        @click="goPage('/p2ph5/person/protocol/protocol_register.html','龙驹财行平台注册及服务协议')"
      >
        <div class>《龙驹财行平台注册及服务协议》</div>
        <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
      </li>
      <li
        class="agreement-unit flex-row-between"
        @click="goPage('/p2ph5/person/protocol/manageContract.html','授权委托书')"
      >
        <div class>《授权委托书》</div>
        <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
      </li>
      <li
        class="agreement-unit flex-row-between"
        @click="goPage('/p2ph5/person/protocol/equitableAssignment.html','债权转让及受让协议')"
      >
        <div class>《债权转让及受让协议》</div>
        <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  methods: {
    goPage(url,title) {
      const src = process.env.VUE_APP_H5SERVER;

      this.$router.push({
        name: "activityDetail",
        query: {
          path: `${src}${url}`,
          title
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  background: rgba(250, 250, 250, 1);
  position: fixed;
  width: 100%;
  height: 100%;
}
.separate {
  height: 10px;
  opacity: 1;
  background: rgba(250, 250, 250, 1);
}
.agreement {
  margin-top: 10px;
  background: white;
  padding: 0 15px;
  color: rgba(49, 49, 52, 1);
  font-size: 18px;
  .agreement-unit {
    font-size: 16px;
    height: 50px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }
  .turn-right {
    width: 6px;
    height: 10px;
  }
}
</style>
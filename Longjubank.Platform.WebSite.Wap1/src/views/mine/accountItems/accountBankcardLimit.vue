<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div class="limitBackground"></div>
    <div class="limitContainer">
      <div v-for="(bank, index) in banklist" :key="index" class="bankitem">
        <div v-if="index != 0" class="bankseperate"></div>
        <img class="fl bankicon" :src="bank.icon">
        <p class="fl bankname">{{ bank.name }}</p>
        <p class="fr banklimit">{{ bank.singleLimie }}/笔，{{ bank.dayLimit }}/日</p>
      </div>
    </div>
  </div>
</template>

<script>
import { GetBankCodeList } from "@/api/account";
import CommonUtils from  '@/utils/public'

export default {
  data() {
    return {
      bankCodeList: null
    };
  },
  computed: {
    banklist() {
      if (CommonUtils.isEmpty(this.bankCodeList)) {
        return null;
      }

      var result = [];
      this.bankCodeList.forEach(bank => {
        if (bank.daylimit != 0) {
          var data = {};
          data.name = bank.bankname;
          try {
            data.icon = require("../../../assets/bank/" +
              bank.bankcode.toLowerCase() +
              ".png");
          } catch (error) {
            data.icon = "";
          }
          data.singleLimie =
            bank.singlelimit < 10000
              ? bank.singlelimit.toFixed(0)
              : (bank.singlelimit / 10000).toFixed(0) + "万";
          data.dayLimit =
            bank.daylimit < 10000
              ? bank.daylimit.toFixed(0)
              : (bank.daylimit / 10000).toFixed(0) + "万";

          result.push(data);
        }
      });
      return result;
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    }
  },
  mounted() {
    GetBankCodeList()
      .then(response => {
        if (response.ResultCode === 0) {
          this.bankCodeList = response.Data.list;
        }
      })
      .catch(err => {});
  }
};
</script>

<style scoped lang='scss'>
.limitBackground {
  position: fixed;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
}

.limitContainer {
  position: relative;
  background: white;
  margin-top: 10px;
  margin-bottom: 10px;
}

.limitContainer .bankitem {
  height: 50px;
  background: white;
  .bankseperate {
    margin-left: 15px;
    width: calc(100% - 15px);
    height: 1px;
    opacity: 1;
    background: rgba(230, 230, 230, 1);
  }
  .bankicon {
    width: 23px;
    height: 23px;
    object-fit: contain;
    margin-left: 16px;
    margin-top: 12px;
  }

  .bankname {
    margin-left: 10px;
    font-size: 16px;
    color: rgba(51, 51, 51, 1);
    line-height: 50px;
  }

  .banklimit {
    font-size: 12px;
    color: rgba(99, 105, 118, 1);
    line-height: 50px;
    margin-right: 15px;
  }
}
</style>

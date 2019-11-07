<template>
  <div class="moneyReturnContainer">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <template v-if="moneyReturnList.length > 0">
      <div class="topContent">
        <p class="moneyReturnHint">已收到利息(元)</p>
        <p class="moneyReturnNum">{{totalProfit}}</p>
      </div>
      <!-- 债权列表 -->
      <div class="listTitle">
        <p class="fl" style="width:33%">季度</p>
        <p class="fl" style="width:33%">金额(元)</p>
        <p class="fl" style="width:33%">时间</p>
      </div>
      <div class="listContain">
        <van-list
          :finished="finished"
          v-model="loading"
          @load="onLoad"
          :immediate-check="false"
          style="background:white;"
        >
          <template v-for="(item, index) in moneyReturnList">
            <div class="listContent" :key="index+'s'">
              <p class="fl blackColor" style="width:33%">{{ item.quarter }}</p>
              <p class="fl blackColor" style="width:33%">{{ item.amount }}</p>
              <p class="fl blackColor" style="width:33%">{{ item.time }}</p>
            </div>
            <div class="seperate" :key="index+ 'a'"></div>
          </template>
        </van-list>
      </div>
    </template>
    <div v-else>
      <img class="norecord" src="@/assets/account/ac_norecord.png">
      <p class="norecordLabel">暂无记录</p>
    </div>
  </div>
</template>

<script>
import { List } from "vant";
import { GetQuarterProfitList } from "@/api/account.js";
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 20,
      finished: false,
      loading: false,
      moneyReturnList: [],
      totalProfit: "0.00"
    };
  },
  components: {
    "van-list": List
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    onLoad() {
      this.loadMoneyReturnList();
    },
    loadMoneyReturnList() {
      GetQuarterProfitList(this.$route.params.financialID)
        .then(response => {
          console.log(response)
          if (response.ResultCode === 0) {
            if (
              response.Data.profitlist.length === 0 ||
              response.Data.isexistprofit === false
            ) {
              this.moneyReturnList = [];
            } else {
              this.totalProfit = response.Data.totalprofit.toFixed(2);
              for (
                let index = 0;
                index < response.Data.profitlist.length;
                index++
              ) {
                const profit = response.Data.profitlist[index];
                var data = {};
                data.quarter = "第" + profit.rownumber + "季度";
                data.amount = profit.financialprofit.toFixed(2);
                if (profit.plusprofit > 0) {
                  data.amount += "+" + profit.plusprofit.toFixed(2);
                }
                data.time = profit.profitdate.split(" ")[0];

                this.moneyReturnList.push(data);
              }

              if (response.Data.allrows <= this.creditorList.length) {
                this.finished = true;
              }
            }
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
        });
    }
  },
  mounted() {
    this.loadMoneyReturnList();
  }
};
</script>

<style scoped lang='scss'>
.moneyReturnContainer {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  top: 40px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.moneyReturnContainer .topContent {
  width: 100%;
  height: 113px;
  background: #FF9100;
  overflow: hidden;
  .moneyReturnHint {
    margin-top: 25px;
    text-align: center;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
  }
  .moneyReturnNum {
    margin-top: 23px;
    font-size: 32px;
    color: rgba(255, 255, 255, 1);
  }
}

.moneyReturnContainer .listTitle {
  width: 100%;
  height: 40px;
  p {
    vertical-align: middle;
    font-size: 14px;
    line-height: 40px;
    color: rgba(154, 163, 173, 1);
  }
}

.moneyReturnContainer .listContain {
  position: relative;
  overflow: auto;
  flex: 1;
  width: 100%;

  .listContent {
    width: 100%;
    height: 50px;
    background: white;
    p {
      vertical-align: middle;
      font-size: 14px;
      line-height: 50px;
      color: rgba(154, 163, 173, 1);
    }
  }
  .seperate {
    background: #f4f4f4;
    height: 2px;
    width: calc(100% - 30px);
    margin-left: 15px;
  }
}

.blackColor {
  color: #313134 !important;
}

.moneyReturnContainer .norecord {
  margin-top: 70px;
  width: 90px;
  height: 90px;
}
.moneyReturnContainer .norecordLabel {
  margin-top: 5px;
  color: rgba(154, 163, 173, 1);
  font-size: 15px;
}
</style>

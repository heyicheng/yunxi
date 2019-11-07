<template>
  <div class="page">
    <van-tabs class="record-tab" type="card">
      <van-icon @click="GOBACK()" name="arrow-left"/>
      <div class="div-container">
        <van-tab title="中奖记录">
          <van-list
            v-model="loading"
            :finished="finished"
            :finished-text="prizeRecordList.length>0?'':'暂无记录'"
            @load="onLoad"
          >
            <div class="head flex-row-around">
              <div class="flex1">获得奖品</div>
              <div class="flex1">获奖时间</div>
            </div>
            <ul class="list" v-if="prizeRecordList.length>0">
              <li class="flex-row-around unit" v-for="(item,index) in prizeRecordList" :key="index">
                <div class="text flex1">{{item.fullprizename}}</div>
                <div class="time flex1">{{item.drawprizetime}}</div>
              </li>
            </ul>
            <div v-else class="none"></div>
          </van-list>
        </van-tab>
        <van-tab title="抽奖次数">
          <van-list
            v-model="loadingTwo"
            :finished="finishedTwo"
            :finished-text="drawPrizeNumList.length>0?'':'暂无记录'"
            @load="onLoadss"
          >
            <div class="head flex-row-around">
              <div class="flex1">抽奖次数来源</div>
              <div class="flex1">获得时间</div>
            </div>
            <ul class="list" v-if="drawPrizeNumList.length>0">
              <li
                class="flex-row-around unit"
                v-for="(item,index) in drawPrizeNumList "
                :key="index"
              >
                <div class="text flex1">{{item.sourcename}}</div>
                <div class="time flex1">{{item.createtime}}</div>
              </li>
            </ul>
            <div v-else class="none"></div>
          </van-list>
        </van-tab>
      </div>
    </van-tabs>
  </div>
</template>
<script>
import { List } from "vant";
import { MYDRAWRECORD } from "@/api/home";
export default {
  components: {
    "van-list": List
  },
  data() {
    return {
      active: 1,
      uuu: 2,
      list: [],
      loading: false,
      finished: false,
      loadingTwo: false,
      finishedTwo: false,
      prizeRecordList: [],
      drawPrizeNumList: [],
      recordPage: 1,
      numPage: 1
    };
  },
  methods: {
    onLoad() {
      MYDRAWRECORD({
        pageindex: this.recordPage,
        pagesize: 10,
        type: 1
      }).then(res => {
        if (res.ResultCode == 0) {
          this.prizeRecordList = this.prizeRecordList.concat(
            res.Data.chancelist
          );
          this.recordPage++;
          this.loading = false;
          if (this.prizeRecordList.length >= res.Data.allrows) {
            this.finished = true;
          }
        } else {
          this.$toast(res.ResultMsg);
        }
      });
    },

    onLoadss() {
      MYDRAWRECORD({
        pageindex: this.numPage,
        pagesize: 10,
        type: 0
      }).then(res => {
        if (res.ResultCode == 0) {
          this.drawPrizeNumList = this.drawPrizeNumList.concat(
            res.Data.chancelist
          );
          this.numPage++;
          this.loadingTwo = false;
          if (this.drawPrizeNumList.length >= res.Data.allrows) {
            this.finishedTwo = true;
          }
        } else {
          this.$toast(res.ResultMsg);
        }
      });
    }
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>

.div-container {
  position: fixed;
  width: 100%;
  height: calc(100% - 0.4rem);
  overflow: auto;
  background: white;
  -webkit-overflow-scrolling:touch;
}
/deep/ .record-tab {
  padding: 0;
  .van-tabs__wrap {
    position: fixed;
    height: 40px;
    background: white;
    border-bottom: 1px solid rgba(230, 230, 230, 0.9);
  }
  .van-tab {
    color: #4a90e0;
    // border-ri
    border: none;
  }
  .van-tabs__nav {
    width: 164px;
    height: 27px;
    line-height: 27px;
    font-size: 14px;
    margin-top: 7px;
    margin-left: auto;
    margin-right: auto;
    border: 1px solid #4a90e0;
    border-radius: 2px;
  }
  .van-tab.van-tab--active {
    color: white;
    background: #4a90e0;
    // border-left: 1px solid ;
  }
  .van-icon-arrow-left {
    // height: 12px;
    font-size: 16px;
    position: fixed;
    left: 14px;
    top: 15px;
    z-index: 99;
    // width: 7px;
  }
}
.flex1 {
  flex: 1;
}
.head {
  font-size: 14px;
  color: #9aa3ad;
  padding: 16px 15px;
  background: #fafafa;
  border-bottom: 1px solid #f4f4f4;
}
.list {
  padding: 0 15px;

  .unit {
    font-size: 14px;
    border-bottom: 1px solid #f4f4f4;

    .text {
      color: rgba(51, 51, 51, 1);
    }
    .time {
      color: rgba(99, 105, 118, 1);
      font-size: 12px;
      padding: 17px 0 18px 0;
    }
  }
}
.none {
  margin: 89px auto 0 auto;
  height: 93px;
  width: 90px;
  background: url(~@/assets/moneyManage/invitation_ic_kong.png) no-repeat
    center/100% 100%;
}
</style>
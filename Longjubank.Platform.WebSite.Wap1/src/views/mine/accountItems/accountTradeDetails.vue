<template>
  <div class="container page">
    <!-- 顶部栏 -->
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      @click-left="GOBACK"
      @click-right="rightClick"
    >
      <img v-if="showFilter" slot="right" src="@/assets/account/ic_closemenu.png" class="rightIcon">
      <img v-else slot="right" src="@/assets/account/ic_menu.png" class="rightIcon">
    </van-nav-bar>
    <!-- 类别栏 -->
    <div v-if="showFilter" class="categoryItems clearfix">
      <p
        v-for="item in catrgoryItems"
        class="fl item"
        :class="{'itemActive':currentFilter === item.flag}"
        :key="item.flag"
        @click="categoryClick(item.flag)"
      >{{item.name}}</p>
    </div>
    <!-- 列表栏 -->
    <div v-if="tradeList.length > 0" class="tradeList">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
        <van-list
          v-model="moreLoading"
          :finished="moreFinished"
          :immediate-check="false"
          @load="onLoad"
        >
          <div v-for="(item, index) in tradeList" class="tradeItem clearfix" :key="item.id">
            <div class="topInfo clearfix">
              <p class="fl itemName">{{item.name}}</p>
              <p class="fr itemAmount">{{item.amount}}</p>
            </div>
            <div class="bottomInfo clearfix">
              <p class="fl itemTime">{{item.time}}</p>
              <p class="fr itemState">成功</p>
            </div>
            <div v-if="index != tradeList.length-1" class="fr itemSeperate"></div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <div v-else class="clearfix norecord">
      <img class="norecordIcon" src="@/assets/account/ac_norecord.png">
      <p class="norecordLabel">暂无记录</p>
    </div>
  </div>
</template>

<script>
import { List, Toast, PullRefresh } from "vant";
import { GetTradeList } from "@/api/account.js";
export default {
  data() {
    return {
      showFilter: true,
      currentFilter: -10,
      refreshLoading: false,
      moreLoading: false,
      moreFinished: false,
      pageSize: 20,
      pageIndex: 1,
      tradeList: []
    };
  },
  components: {
    "van-list": List,
    "van-pull-refresh": PullRefresh
  },
  computed: {
    catrgoryItems() {
      return [
        {
          name: "全部",
          flag: -10
        },
        {
          name: "充值",
          flag: 1
        },
        {
          name: "提现",
          flag: 2
        },
        {
          name: "投资",
          flag: 3
        },
        {
          name: "回款",
          flag: 4
        },
        {
          name: "其他",
          flag: 99
        }
      ];
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    rightClick() {
      this.showFilter = !this.showFilter;
    },
    categoryClick(flag) {
      this.currentFilter = flag;
      this.onRefresh();
    },
    onRefresh() {
      this.loadTradeList(false);
    },
    onLoad() {
      this.loadTradeList(true);
    },
    loadTradeList(more) {
      if (!more) {
        this.pageIndex = 1;
        this.tradeList = [];
      }
      Toast.loading({ mask: true, duration: 0 });
      GetTradeList(this.pageIndex, this.pageSize, this.currentFilter)
        .then(response => {
          if (response.ResultCode != 0) {
            showToast && Toast({ message: response.ResultMsg, duration: 1500 });
          } else {
            for (const index in response.Data.list) {
              let item = response.Data.list[index];
              var data = {};
              data.name = item.feename;
              if (item.activeamount >= 0) {
                data.amount = "+" + item.activeamount.toFixed(2);
              } else {
                data.amount = item.activeamount.toFixed(2);
              }

              data.time = item.optime;
              data.id = item.id;
              this.tradeList.push(data);
            }

            if (this.tradeList.length >= response.Data.allrows) {
              this.moreFinished = true;
            }

            this.refreshLoading = false;
            this.moreLoading = false;
            this.pageIndex += 1;
            Toast.clear();
          }
        })
        .catch(error => {
          Toast.clear();
        });
    }
  },
  mounted() {
    this.onRefresh();
  }
};
</script>

<style scoped lang='scss'>
.container {
  position: fixed;
  background: rgba(248, 248, 248, 1);
  height: calc(100% - 40px);
  width: 100%;
  display: flex;
  flex-direction: column;
}

.container .rightIcon {
  width: 15px;
  height: 13px;
  object-fit: contain;
}

.container .categoryItems {
  margin: 0px 11px 9px;
  .item {
    font-size: 14px;
    line-height: 26px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 1);
    margin-right: 4px;
    margin-left: 4px;
    margin-top: 8px;
    color: rgba(154, 163, 173, 1);
    width: calc((100% - 24px) / 3);
  }
  .itemActive {
    background: rgba(74, 144, 224, 1);
    color: rgba(255, 255, 255, 1);
  }
}

.container .tradeList {
  margin-top: 1.5px;
  overflow: auto;
  position: relative;
  .tradeItem {
    background: white;
    .itemName {
      font-size: 14px;
      color: rgba(49, 49, 52, 1);
      text-align: left;
      min-width: 1px;
      margin-top: 20px;
      margin-left: 14px;
    }
    .itemAmount {
      font-size: 16px;
      color: rgba(49, 49, 52, 1);
      text-align: right;
      margin-top: 20px;
      margin-right: 14px;
    }
    .itemTime {
      font-size: 12px;
      color: rgba(154, 163, 173, 1);
      text-align: left;
      margin-top: 10px;
      margin-left: 14px;
      margin-bottom: 15px;
    }
    .itemState {
      font-size: 12px;
      color: rgba(74, 144, 224, 1);
      text-align: right;
      margin-top: 10px;
      margin-right: 14px;
    }
    .itemSeperate {
      margin-left: 15px;
      width: calc(100% - 15px);
      height: 1px;
      background: rgba(230, 230, 230, 1);
    }
  }
}

.norecord {
  min-height: 400px;
  .norecordIcon {
    width: 90px;
    height: 90px;
    margin-top: 75px;
  }

  .norecordLabel {
    margin-top: 15px;
    opacity: 0.5;
    font-size: 14px;
    color: rgba(154, 163, 173, 1);
  }
}
</style>

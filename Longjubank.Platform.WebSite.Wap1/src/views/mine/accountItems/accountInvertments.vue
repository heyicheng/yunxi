<template>
  <div>
    <van-nav-bar id="investmentNav" :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <!-- 顶部信息栏 -->
    <div class="topInfo">
      <p class="topLabel">在投金额（元）</p>
      <p class="totalinvest">{{accountAmount.amountInvesting}}</p>
      <p class="waitprofit">
        待收收益
        <span>{{accountAmount.amountForProfit}}</span>元
      </p>
    </div>
    <!-- 分类显示 -->
    <div class="amountclassify clearfix">
      <div class="classifyAmount blurbackground fl">
        <p class="categoryTitle">累计投资(元)</p>
        <p class="categoryLabel">{{accountAmount.totalInvest}}</p>
      </div>
      <div class="classifyAmount blurbackground fl">
        <p class="categoryTitle">累计收益(元)</p>
        <p class="categoryLabel">{{accountAmount.totalProfit}}</p>
      </div>
      <div class="classifyTitle fl" @click="selectedIndexChange(1)">
        <p class="categoryName" :class="{active:selectedIndex === 1}">投资中</p>
      </div>
      <div class="classifyTitle fl" @click="selectedIndexChange(2)">
        <p class="categoryName" :class="{active:selectedIndex === 2}">已回款</p>
      </div>
      <div class="classifyState graybackground fl">
        <div v-show="selectedIndex === 1" class="categorySelected"></div>
      </div>
      <div class="classifyState graybackground fl">
        <div v-show="selectedIndex === 2" class="categorySelected"></div>
      </div>
    </div>
    <!-- 列表显示 -->
    <div class="itemList">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
        <van-list
          v-if="showingData && showingData.length > 0"
          v-model="moreLoading"
          :finished="moreFinished"
          :immediate-check="false"
          finished-text="没有更多啦~"
          @load="onLoad"
        >
          <div
            v-for="data in showingData"
            class="clearfix item"
            :key="data.orderId"
            @click="itemClick(data.orderId)"
          >
            <div class="clearfix">
              <p class="fl itemName blackColor">{{data.planname}}</p>
              <p class="fl itemSubName grayColor">{{data.planSubName}}</p>
              <p v-if="data.orderstatus === 10" class="fr stateType investedState">已投标</p>
              <p
                v-else-if="data.orderstatus === 20 || data.orderstatus === 21"
                class="fr stateType investingState"
              >投资中</p>
              <p v-else-if="data.orderstatus === 30" class="fr stateType returningState">回款中</p>
              <p v-else-if="data.orderstatus === 40" class="fr stateType returnedState">到期回款</p>
              <p v-else-if="data.orderstatus === 50" class="fr stateType alreadyReturned">提前回款</p>
              <p v-else-if="selectedIndex === 1" class="fr stateType investingState">投资中</p>
              <p v-else class="fr stateType returnedState">到期回款</p>
            </div>
            <div class="clearfix" style="padding-left:15px;">
              <div class="fl" style="width:37%;">
                <p class="itemTitle grayColor">投资本金(元)</p>
                <p class="itemLabel blackColor">{{ data.bidAmount }}</p>
                <p
                  v-if="'extraBidAmount' in data"
                  class="itemSublabel orangeColor"
                >+{{ data.extraBidAmount }}&nbsp;(理财金)</p>
                <p v-else style="height:12px"></p>
              </div>
              <div class="fl" style="width:30%;">
                <p class="itemTitle grayColor">收益率</p>
                <p class="itemLabel blackColor">{{data.bidRate}}%</p>
                <p
                  v-if="'extraBidRate' in data"
                  class="itemSublabel orangeColor"
                >+{{ data.extraBidRate }}%(加息券)</p>
                <p v-else style="height:12px"></p>
              </div>
              <div class="fl" style="width:26%;">
                <template v-if="selectedIndex === 1">
                  <p class="itemTitle grayColor specialItem">待收收益(元)</p>
                  <p class="itemLabel orangeColor specialItem">{{data.bidProfit}}</p>
                </template>
                <template v-else>
                  <p class="itemTitle grayColor specialItem">回款收益(元)</p>
                  <p class="itemLabel orangeColor specialItem">{{data.backamount}}</p>
                </template>
                <p
                  v-if="'extraBidProfit' in data"
                  class="itemSublabel orangeColor specialItem"
                >+{{ data.extraBidProfit }}</p>
                <p
                  v-else-if="'activitybackamount' in data"
                  class="itemSublabel orangeColor specialItem"
                >+{{ data.activitybackamount }}</p>
                <p v-else style="height:12px"></p>
              </div>
              <img v-if="selectedIndex === 1" class="fl" src="@/assets/moneyManage/ic_jiaobiao.png">
            </div>
            <div class="clearfix datetime">
              <p v-if="selectedIndex === 1" class="fl timeLabel">购买日期：{{data.bidtime}}</p>
              <p v-if="selectedIndex === 2" class="fl timeLabel">投资期限：{{data.investmentterm}}天</p>
              <p v-if="selectedIndex === 2" class="fr timeLabel">回款日期：{{data.backtime}}</p>
            </div>
            <p
              v-if="'advancedprofit' in data"
              class="alreadyReturn"
            >已提前回款收益: {{ data.advancedprofit }}</p>
            <div class="bottomLine"></div>
          </div>
        </van-list>
        <div v-else class="clearfix norecord">
          <img class="norecordIcon" src="@/assets/account/ac_norecord.png">
          <p class="norecordLabel">暂无记录</p>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { List, Toast, PullRefresh } from "vant";
import { GetMyOrderFinancialList, GetMyOrderExperience } from "@/api/account.js";
export default {
  components: {
    "van-list": List,
    "van-pull-refresh": PullRefresh
  },
  data() {
    return {
      selectedIndex: 1,
      refreshLoading: false,
      investRefreshLoading: false,
      returnRefreshLoading: false,
      moreLoading: false,
      investMoreLoading: false,
      returnMoreLoading: false,
      investFinished: false,
      returnFinished: false,
      pagesize: 5,
      investingPage: 1,
      returnPage: 1,
      investingList: [],
      returnList: [],
      investAmount: 0,
      returnAmount: 0,
      queryingInvestList: false,
      queryingReturnList: false,
      accountAmount: {
        totalInvest: "0.00",
        totalProfit: "0.00",
        amountInvesting: "0.00",
        amountForProfit: "0.00"
      },
      experienceOrder: null
    };
  },
  computed: {
    showingData() {
      if (this.selectedIndex === 1) {
        return this.investingList;
      } else {
        return this.returnList;
      }
    },
    moreFinished() {
      if (this.selectedIndex === 1) {
        return this.investFinished;
      } else {
        return this.returnFinished;
      }
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    onRefresh() {
      if (this.selectedIndex === 1) {
        this.loadInvestingData(false);
      } else {
        this.loadReturnedData(false);
      }
    },
    onLoad() {
      if (this.selectedIndex === 1) {
        this.loadInvestingData(true);
      } else {
        this.loadReturnedData(true);
      }
    },
    selectedIndexChange(index) {
      this.selectedIndex = index;
    },
    itemClick(orderid) {
      if (this.selectedIndex === 1) {
        this.$router.push({
          name: "investmentDetail",
          params: { id: orderid }
        });
      }
    },
    loadInvestingData(more, showToast = true) {
      if (this.queryingInvestList) {
        return;
      }
      if (!more) {
        this.investingPage = 1;
        this.investingList = [];
        this.mergeExprienceOrderList()
      }
      this.queryingInvestList = true;
      showToast && Toast.loading({ mask: true, duration: 0 });
      GetMyOrderFinancialList(this.investingPage, 5, 1)
        .then(response => {
          if (response.ResultCode != 0) {
            showToast && Toast({ message: response.ResultMsg, duration: 1500 });
          } else {
            var investData = response.Data;

            // 加载投资金额信息
            this.accountAmount.totalInvest = investData.allamount.toFixed(2);
            this.accountAmount.totalProfit = investData.allprofit.toFixed(2);
            this.accountAmount.amountInvesting = investData.totalwaitamount.toFixed(
              2
            );
            if (
              investData.totalwaitprofit >= investData.totalwaitactivityprofit
            ) {
              this.accountAmount.amountForProfit =
                (
                  investData.totalwaitprofit -
                  investData.totalwaitactivityprofit
                ).toFixed(2);
                if (investData.totalwaitactivityprofit > 0) {
                  this.accountAmount.amountForProfit = this.accountAmount.amountForProfit + "+" + investData.totalwaitactivityprofit.toFixed(2);
                }
            } else {
              this.accountAmount.amountForProfit = investData.totalwaitprofit.toFixed(
                2
              );
            }

            this.loadResponseData(this.investingList, investData.finalist);
            this.investRefreshLoading = false;
            this.investMoreLoading = false;
            this.investAmount = investData.allrows;
            this.investFinished = this.investAmount <= this.investingList.length;
            this.investingPage += 1;
            this.queryingInvestList = false;
            this.updateCurrentLoadingStatus();
            showToast && Toast.clear();
          }
        })
        .catch(error => {
          this.investRefreshLoading = false;
          this.investMoreLoading = false;
          this.updateCurrentLoadingStatus();
          showToast && Toast.clear();
        });
    },
    loadReturnedData(more, showToast = true) {
      if (this.queryingReturnList) {
        return;
      }
      if (!more) {
        this.returnPage = 1;
        this.returnList = [];
        this.mergeExprienceOrderList()
      }
      this.queryingReturnList = true;
      showToast && Toast.loading({ mask: true, duration: 0 });
      GetMyOrderFinancialList(this.returnPage, 5, 2)
        .then(response => {
          if (response.ResultCode != 0) {
            showToast && Toast({ message: response.ResultMsg, duration: 1500 });
          } else {
            var returnData = response.Data;

            this.loadResponseData(this.returnList, returnData.finalist);

            this.returnAmount = returnData.allrows;
            this.returnPage += 1;

            this.returnRefreshLoading = false;
            this.returnMoreLoading = false;
            this.returnFinished = this.returnAmount <= this.returnList.length;
            this.queryingReturnList = false;
            this.updateCurrentLoadingStatus();
            showToast && Toast.clear();
          }
        })
        .catch(err => {
          this.returnRefreshLoading = false;
          this.returnMoreLoading = false;
          this.updateCurrentLoadingStatus();
          showToast && Toast.clear();
        });
    },
    loadExperoenceOrder() {
      GetMyOrderExperience(10).then(response =>{
        if (response.ResultCode === 0) {
          var orderlist = []
          response.Data.investmentterm = response.Data.experienceterm
          orderlist.push(response.Data)
          var experienceList = []
          this.loadResponseData(experienceList, orderlist)
          if (experienceList.length > 0) {
            this.experienceOrder =  experienceList[0]

            if (this.experienceOrder.orderstatus === 30) {
              this.experienceOrder.orderstatus = 40
            } else if (this.experienceOrder.orderstatus === 10 || this.experienceOrder.orderstatus === 18 ||this.experienceOrder.orderstatus === 20) {
              if (this.experienceOrder.orderstatus === 18 || this.experienceOrder.orderstatus === 20) {
                this.experienceOrder.orderstatus = 30
              } else {
                this.experienceOrder.orderstatus = 20
              }
            }
          }
          this.mergeExprienceOrderList()
        }
      }).catch(err => {
      })
    },
    mergeExprienceOrderList() {
      if (this.experienceOrder === null) {
        return
      }

      if (this.experienceOrder.orderstatus === 40) {
        this.returnList.unshift(this.experienceOrder)
      } else if (this.experienceOrder.orderstatus === 20 || this.experienceOrder.orderstatus === 30) {
        this.investingList.unshift(this.experienceOrder)
      }
    },
    loadResponseData(datalist, responseDataList) {
      // 加载投资列表
      for (const index in responseDataList) {
        let financial = responseDataList[index];
        var data = {
          planname: financial.planname,
          planSubName: financial.plansummary,
          bidRate: financial.annualrate.toFixed(2),
          bidProfit: financial.waitprofit.toFixed(2),
          orderId: financial.orderid,
          backamount: financial.backamount.toFixed(2),
          orderstatus: financial.orderstatus,
          investmentterm: financial.investmentterm
        };

        if ('bidamount' in financial) {
          data.bidAmount = financial.bidamount.toFixed(2);
        } else if ('experienceamount' in financial) {
          data.bidAmount = financial.experienceamount.toFixed(2);
        }

        if ("activitylist" in financial) {
          for (const numorder in financial.activitylist) {
            var acticity = financial.activitylist[numorder];
            if (acticity.activitytype === 1) {
              data.extraBidAmount = acticity.activityparameter.toFixed(2);
            } else if (acticity.activitytype === 2) {
              data.extraBidRate = acticity.activityparameter.toFixed(2);
            }
          }
        }

        if ("activitybackamount" in financial && financial.activitybackamount > 0) {
          data.activitybackamount = financial.activitybackamount.toFixed(2)
        }

        if ("bidtime" in financial) {
          data.bidtime = financial.bidtime.split(" ")[0];
        }

        if ("backtime" in financial) {
          data.backtime = financial.backtime.split(" ")[0];
        }

        if (parseFloat(financial.activitywaitprofit) > 0) {
          data.extraBidProfit = financial.activitywaitprofit.toFixed(2);
        }

        if (parseFloat(financial.advancedprofit) > 0) {
          data.advancedprofit = financial.advancedprofit.toFixed(2);
        }

        datalist.push(data);
      }
    },
    updateCurrentLoadingStatus() {
      if (this.selectedIndex === 1) {
        this.moreLoading = this.investMoreLoading
        this.refreshLoading = this.investRefreshLoading
      } else {
        this.moreLoading = this.returnMoreLoading
        this.refreshLoading = this.returnRefreshLoading
      }
    },
    windowScrolled() {
      let offset =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (offset > 164) {
        offset = 164;
      }
      document.getElementById("investmentNav").style.opacity = 1 - offset / 164;
    }
  },
  mounted() {
    this.loadExperoenceOrder()
    this.loadInvestingData(false);
    this.loadReturnedData(false, false);
    window.addEventListener("scroll", this.windowScrolled);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.windowScrolled);
  }
};
</script>

<style scoped lang='scss'>
/deep/.van-nav-bar {
  background-color: transparent;
  color: white;
}
/deep/.van-nav-bar::after {
  border: none;
}
/deep/.van-nav-bar .van-icon {
  color: white;
}
/deep/.van-nav-bar .van-nav-bar__title {
  color: white;
}

.topInfo {
  height: 164px;
  background: linear-gradient(rgba(88, 159, 239, 1), rgba(74, 144, 224, 1));
  overflow: hidden;
  .topLabel {
    margin-top: 55px;
    opacity: 0.5;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .totalinvest {
    font-size: 41px;
    color: rgba(255, 255, 255, 1);
    margin-top: 13px;
  }
  .waitprofit {
    margin-top: 13px;
    opacity: 1;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    span {
      color: rgba(255, 255, 255, 1);
    }
  }
}

.amountclassify {
  .classifyAmount {
    width: 50%;
    height: 63px;
  }
  .classifyTitle {
    width: 50%;
    height: 43px;
  }
  .classifyState {
    width: 50%;
    height: 2px;
  }
  .blurbackground {
    background: rgba(74, 144, 224, 1);
  }
  .graybackground {
    background: rgba(250, 250, 250, 1);
  }
  .categoryTitle {
    margin-top: 15px;
    opacity: 0.5;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .categoryLabel {
    margin-top: 10px;
    font-size: 14px;
    color: rgba(255, 255, 255, 1);
  }
  .categoryName {
    font-size: 14px;
    color: rgba(154, 163, 173, 1);
    line-height: 43px;
  }
  .active {
    color: rgba(74, 144, 226, 1);
  }
  .categorySelected {
    width: 55px;
    height: 2px;
    background: rgba(74, 144, 226, 1);
    margin: auto;
  }
}
.itemList {
  background: rgba(250, 250, 250, 1);
  min-height: 376px;
}

.itemList .item {
  background: white;
  text-align: left;
  .itemName {
    margin-left: 15px;
    font-size: 16px;
    font-weight: bold;
    line-height: 45px;
  }
  .itemSubName{
    margin-left: 10px;
    font-size: 10px;
    line-height: 45px;
  }
  .stateType {
    font-size: 12px;
    line-height: 22px;
    text-align: right;
    text-indent: 10px;
    padding-right: 5px;
    border-bottom-left-radius: 14px;
  }
  .returnedState {
    color: rgba(250, 84, 84, 1);
    background: rgba(250, 84, 84, 0.2);
  }
  .investingState {
    color: rgba(74, 144, 224, 1);
    background: rgba(74, 144, 224, 0.2);
  }
  .returningState {
    color: #71e0a0;
    background: #dff6e9;
  }
  .investedState {
    color: rgba(255, 145, 0, 1);
    background: rgba(255, 145, 0, 0.2);
  }
  .alreadyReturned {
    color: #717ce0;
    background: #dfe2f6;
  }
  .itemTitle {
    font-size: 13px;
    text-align: left;
    margin-top: 6px;
  }
  .itemLabel {
    font-size: 14px;
    text-align: left;
    margin-top: 10px;
    font-weight: 500;
  }
  .itemSublabel {
    margin-top: 3px;
    font-size: 12px;
    text-align: left;
    font-weight: 500;
  }
  .blackColor {
    color: rgba(49, 49, 52, 1);
  }
  .grayColor {
    color: rgba(154, 163, 173, 1);
  }
  .orangeColor {
    color: rgba(255, 145, 0, 1);
  }
  .specialItem {
    text-align: right;
  }
  img {
    margin-left: 5px;
    margin-top: 16px;
    width: 6px;
    height: 10px;
  }
  .datetime {
    margin-top: 10px;
    padding-left: 15px;
    padding-right: 30px;
    .timeLabel {
      font-size: 11px;
      color: rgba(185, 191, 198, 1);
    }
  }
  .alreadyReturn {
    font-size: 11px;
    color: rgba(74, 144, 226, 1);
    line-height: 20px;
    text-indent: 15px;
    margin-top: 5px;
  }
  .bottomLine {
    margin-top: 6px;
    width: 100%;
    height: 1px;
    background: rgba(230, 230, 230, 1);
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

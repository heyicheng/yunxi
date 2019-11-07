<template>
  <div class="container">
    <van-nav-bar left-arrow @click-left="GOBACK" class="navbar">
      <van-tabs slot="title" v-model="currentCategory" type="card">
        <van-tab title="优惠券"/>
        <van-tab title="京东E卡"/>
      </van-tabs>
    </van-nav-bar>
    <div class="subCatefory clearfix">
      <van-tabs v-if="currentCategory === 0" slot="title" v-model="couponsCategory">
        <van-tab title="可使用"/>
        <van-tab title="已失效"/>
      </van-tabs>
      <van-tabs v-else slot="title" v-model="ecardCategory">
        <van-tab title="未激活"/>
        <van-tab title="已激活"/>
        <van-tab title="已过期"/>
      </van-tabs>
    </div>
    <div class="couponsList clearfix">
      <van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
        <van-list
          v-if="currentCoupons.list.length > 0"
          v-model="moreLoading"
          :finished="moreFinished"
          :immediate-check="false"
          @load="onLoad"
        >
          <template v-if="currentCategory === 0">
            <coupons
              v-for="item in currentCoupons.list"
              :key="item.mpno"
              :coupon="item"
              style="margin-top:15px;"
            ></coupons>
          </template>
          <template v-else>
            <jdcard
              v-for="item in currentCoupons.list"
              :key="item.memberprizeid"
              :jdcard="item"
              style="margin-top:15px;"
            ></jdcard>
          </template>
          <p
            v-if="currentCategory === 1 && ecardCategory === 0"
            class="activeEcardHint"
          >提示：京东E卡激活需要时间，请客官稍后查询哦~</p>
        </van-list>
        <div class="clearfix norecord" v-else>
          <img class="norecordIcon" src="@/assets/account/ac_norecord.png">
          <p class="norecordLabel">暂无记录</p>
        </div>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { Tab, Tabs, List, Toast, PullRefresh } from "vant";
import Coupons from "@@/privilege/couponsPrivilege";
import JDCard from "@@/privilege/jdcardPrivilege";
import { GetMyPrizeinfo, GetMyPrivileges } from "@/api/account";

export default {
  data() {
    return {
      // 0为优惠券 1为京东E卡
      currentCategory: 0,
      // 优惠券子类
      couponsCategory: 0,
      // 京东e卡子类
      ecardCategory: 0,
      // 可使用优惠券
      validCoupons: {
        index: 1,
        list: [],
        listkey: "memberprivilist",
        loadData: GetMyPrivileges,
        finished: false,
        status: 0,
        querying: false
      },
      // 已失效优惠券
      invalidCoupons: {
        index: 1,
        list: [],
        listkey: "memberprivilist",
        loadData: GetMyPrivileges,
        finished: false,
        status: 1,
        querying: false
      },
      // 未激活e卡
      inactiveEcard: {
        index: 1,
        list: [],
        listkey: "list",
        loadData: GetMyPrizeinfo,
        finished: false,
        status: 0,
        querying: false
      },
      // 已激活e卡
      activeEcard: {
        index: 1,
        list: [],
        listkey: "list",
        loadData: GetMyPrizeinfo,
        finished: false,
        status: 1,
        querying: false
      },
      // 已过期e卡
      expiredEcard: {
        index: 1,
        list: [],
        listkey: "list",
        loadData: GetMyPrizeinfo,
        finished: false,
        status: 2,
        querying: false
      },
      pageSize: 10,
      refreshLoading: false,
      moreLoading: false,
      moreFinished: false
    };
  },
  computed: {
    currentCoupons() {
      if (this.currentCategory === 0 && this.couponsCategory === 0) {
        return this.validCoupons;
      } else if (this.currentCategory === 0 && this.couponsCategory === 1) {
        return this.invalidCoupons;
      } else if (this.currentCategory === 1 && this.ecardCategory === 0) {
        return this.inactiveEcard;
      } else if (this.currentCategory === 1 && this.ecardCategory === 1) {
        return this.activeEcard;
      } else {
        return this.expiredEcard;
      }
    }
  },
  components: {
    "van-tabs": Tabs,
    "van-tab": Tab,
    coupons: Coupons,
    jdcard: JDCard,
    "van-list": List,
    "van-pull-refresh": PullRefresh
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    // 类别改变事件
    categoryChanged(val) {
      this.currentCategory = val;
    },
    onRefresh() {
      this.loadCouponsList(this.currentCoupons, false, true);
    },
    onLoad() {
      this.loadCouponsList(this.currentCoupons, true, true);
    },
    // 加载优惠券信息
    loadCouponsList(container, more, current) {
      if (container.querying) {
        current && Toast.loading({ mask: true, duration: 0 });
        return;
      }
      container.querying = true;
      if (!more) {
        container.index = 1;
        container.finished = false;
        container.list = []
      }
      current && Toast.loading({ mask: true, duration: 0 });
      container
        .loadData(container.index, this.pageSize, container.status)
        .then(response => {
          if (response.ResultCode != 0) {
            current && Toast({ message: response.ResultMsg, duration: 1500 });
          } else {
            var returnData = response.Data;
            container.list = container.list.concat(
              returnData[container.listkey]
            );
            if (container.list.length >= returnData.allrows) {
              container.finished = true;
              if (current) {
                this.moreFinished = true;
              }
            }
            if (current) {
              this.moreLoading = false;
              this.refreshLoading = false;
            }
            container.index += 1;
            current && Toast.clear();
          }
          container.querying = false;
        })
        .catch(e => {
          Toast.clear();
        });
    },
    // refresh state
    refreshState() {
      this.moreFinished = this.currentCoupons.finished;
    }
  },
  mounted() {
    this.loadCouponsList(this.validCoupons, false, true);
    this.loadCouponsList(this.invalidCoupons, false, false);
    this.loadCouponsList(this.inactiveEcard, false, false);
    this.loadCouponsList(this.activeEcard, false, false);
    this.loadCouponsList(this.expiredEcard, false, false);
  },
  watch: {
    currentCoupons() {
      this.refreshState();
    },
    couponsCategory() {
      this.refreshState();
    }
  }
};
</script>

<style scoped lang="scss">
.container {
  position: fixed;
  background: rgba(248, 248, 248, 1);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  font-size: 0;
}

.container .navbar {
  /deep/.van-tab:last-child {
    border-right: none !important;
  }
  /deep/.van-nav-bar__title {
    margin-top: 6px;
    margin-bottom: 6px;
  }
  /deep/.van-tabs__wrap {
    height: 27px;
  }
  /deep/.van-tabs__nav--card {
    height: 27px;
    border-radius: 4px;
    border: 1px solid rgba(74, 144, 224, 1);
    .van-tab {
      color: rgba(74, 144, 224, 1);
      border-right: 0.02667rem solid rgba(74, 144, 224, 1);
    }
    .van-tab {
      color: rgba(74, 144, 224, 1);
      border-right: 0.02667rem solid rgba(74, 144, 224, 1);
    }
    .van-tab.van-tab--active {
      color: white;
      background: rgba(74, 144, 224, 1);
    }
  }
}

.container .subCatefory {
  margin-top: 40px;
  /deep/.van-tab {
    font-size: 14px;
    color: rgba(154, 163, 173, 1);
  }
  /deep/.van-tab.van-tab--active {
    color: rgba(74, 144, 224, 1);
  }
  /deep/.van-tabs__line {
    background: rgba(74, 144, 226, 1);
    height: 2px;
  }
}

.container .couponsList {
  margin-top: 8px;
  position: relative;
  overflow: auto;
}
.container .activeEcardHint {
  font-size: 13px;
  color: rgba(154, 163, 173, 1);
  text-align: left;
  margin-left: 15px;
  margin-top: 27px;
}

.container .couponsList .norecord {
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

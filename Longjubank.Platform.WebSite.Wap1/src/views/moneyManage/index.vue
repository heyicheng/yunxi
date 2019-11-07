<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" @click-right="goRouter('/message')">
      <div slot="right" class="clock">
        <div v-if="messageCount.personalnumber>0 || messageCount.systemnumber>0" class="ret-dot"></div>
        <img src="@/assets/home/ic_message.png" class="clock-img" alt>
      </div>
    </van-nav-bar>
    <div v-for="(item,index) in dataList" :key="index">
      <div class="separate"></div>

      <div class="contain">
        <!-- 驹宝盆 -->
        <div class="headline flex-row-between">
          <div class="flex-row-start">
            <div class="blue-bar"></div>
            <span class="headline-title">{{item.plantypename}}</span>
            <span class="headline-eg">{{item.node}}</span>
          </div>
          <div
            class="flex-row-center more-icon"
            style="display:flex"
            @click="goRouter({name:'objectList',query:{title:item.plantypename,plantype:item.plantype}})"
          >
            <span class="headline-eg headline-more">更多</span>
            <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
          </div>
        </div>
        <ul class="object-list">
          <li
            class="object-unit"
            v-for="(unit,num) in item.planlist"
            :key="num"
            @click="goDetail(unit.planno,unit.planname,unit.pid,unit.planstatus)"
          >
            <div class="object-title flex-row-between">
              <div>
                <span>{{unit.planname}}</span>
                <div
                  class="describe"
                  v-if="unit.plansummary"
                  style="display:inline;"
                >{{unit.plansummary}}</div>
              </div>
              <div class="brand" v-if="unit.plantag">
                <div class="masonrY fl"></div>
                <p class="fl icon-text">{{unit.plantag}}</p>
              </div>
            </div>
            <div class="object-body">
              <div class="earnings flex-row-start">
                <div class="all-rate">
                  <span class="rate">{{(unit.annualrate-unit.fixedinterestrate).toFixed(2)}}</span>
                  <span class="baifenbi">%</span>
                  <span class="baifenbi" v-if="unit.fixedinterestrate">+</span>
                  <span class="orangerate" style="positon:relative" v-if="unit.fixedinterestrate">
                    <span>{{unit.fixedinterestrate.toFixed(2)}}%</span>
                    <div class="pingtaijiaxi">{{unit.fixedinterestname}}</div>
                  </span>
                </div>
                <div class="deadline">
                  <span class="count">{{unit.investmentterm}}</span>
                  <span class="day">天</span>
                </div>
              </div>
              <div class="earnings flex-row-start">
                <div class="object-text">预期年化收益</div>
                <div class="object-text">项目金额{{unit.planamount/10000}}万</div>
                <div></div>
              </div>
              <van-button
                type="warning"
                v-if="unit.planstatus==10"
                class="invest"
                @click="goDetail(unit.planno,unit.planname,unit.pid,unit.planstatus)"
              >立即投资</van-button>
              <div class="gray-btn shouqing invest" v-if="unit.planstatus>10&&unit.planstatus<50"></div>
              <div class="gray-btn jiesu invest" v-if="unit.planstatus==50"></div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="kongbai separate"></div>
    <div class="kongbai separate"></div>
    <foot-notice></foot-notice>
    <div class="kongbai separate"></div>
  </div>
</template>
<script>
import FootNotice from "@/components/footNotice";
import { GetMessageCountUtils } from "@/utils/messageUtils.js";
import { GETMONEYMANAGELIST } from "@/api/moneyManage";
export default {
  data() {
    return {
      token: localStorage.getItem("token"),
      messageCount: { systemnumber: 0, personalnumber: 0 },
      dataList: []
    };
  },
  components: {
    FootNotice
  },
  methods: {
    goDetail(planno, planname, pid, status) {
      if (status == 10) {
        this.$router.push({
          name: "objectDetail",
          query: { title: planname, planno: planno, financialid: pid }
        });
      }
    },
    goRouter(router) {
      this.$router.push(router);
    },
    initWeb() {
      GetMessageCountUtils((personal, activity, system, error) => {
        this.messageCount.personalnumber = personal;
        this.messageCount.systemnumber = system;
      });
      GETMONEYMANAGELIST().then(res => {
        if (res.ResultCode == 0) {
          this.dataList = res.Data.planlist;
        }
      });
    }
  },
  mounted() {
    this.initWeb();
  }
};
</script>
<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
.clock {
  width: 16px;
  height: 18px;
  position: relative;
  .ret-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(247, 54, 54, 1);
    top: 9px;
    right: 0;
  }
}
.separate {
  height: 10px;
  opacity: 1;
  background: rgba(250, 250, 250, 1);
}

.contain {
  padding: 19px 16px 0px 16px;
}
.headline {
  height: 18px;
  margin-bottom: 19px;
  vertical-align: baseline;
}
.blue-bar {
  height: 18px;
  width: 3px;
  background: rgba(74, 144, 224, 1);
}
.headline-title {
  font-size: 15px;
  line-height: 18px;
  color: rgba(49, 49, 52, 1);
  margin-left: 10px;
  font-weight: 500;
}
.headline-eg {
  color: rgba(154, 163, 173, 1);
  font-size: 10px;
  line-height: 18px;
  margin-left: 15px;
}
.headline-more {
  font-size: 12px;
  line-height: normal;
  margin-right: 6px;
}
.object-list {
  // margin-top: 19px;
}
.object-unit {
  // box-shadow: 0px 2px 24px 0px rgba(195, 195, 195, 0.5);
  padding: 20px 0px;
  border-top: 1px solid #f4f4f4;
}
.object-title {
  font-size: 15px;
  line-height: 15px;
}
.masonrY {
  width: 19px;
  height: 19px;
  background: url(~@/assets/home/licai_gongyinglian.png) center / 100% 100%;
}
.icon-text {
  color: rgba(70, 162, 255, 1);
  line-height: 19px;
  font-size: 11px;
  margin-left: 4px;
  margin-right: 5px;
}
.brand {
  background: #ecf5ff;
  border-radius: 9px;
}
.describe {
  background: rgba(248, 248, 249, 1);
  height: 17px;
  width: 78px;
  color: rgba(99, 105, 118, 1);
  font-size: 10px;
  line-height: 17px;
  padding: 1px 2px;
  margin-left: 3px;
}
.earnings {
  align-items: flex-end;
  margin-top: 10px;
}
.rate {
  font-size: 24px;
  line-height: 28px;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
}
.orangerate {
  position: relative;
  font-weight: 500;
  font-size: 14px;
  color: rgba(255, 145, 0, 1);
}
.baifenbi {
  font-weight: 500;
  font-size: 14px;
}
.baifenbi {
  font: outline;
}
.invest {
  position: absolute;
  right: 0;
  width: 67px;
  height: 28px;
  background: rgba(255, 145, 0, 1);
  font-size: 12px;
  padding: 0;
  line-height: 28px;
  top: 50%;
  margin-top: -8px;
}
.object-text {
  text-align: left;
  width: 145px;
  font-size: 12px;
  line-height: 12px;
  color: rgba(154, 163, 173, 1);
}
.shuxian {
  border-left: 1px solid #ddd;
  padding-left: 10px;
  margin-left: 10px;
}
.deadline {
  color: rgba(49, 49, 53, 1);
  font-size: 18px;
  padding-bottom: 2px;
  .day {
    font-size: 12px;
  }
}
.pingtaijiaxi {
  text-align: center;
  position: absolute;
  width: 41px;
  height: 20px;
  background: url(~@/assets/home/ic_tag.png) no-repeat center / 100% 100%;
  z-index: 1;
  top: -22px;
  left: 2px;
  font-size: 9px;
  line-height: 18px;
  color: rgba(74, 144, 224, 1);
}
.turn-right {
  width: 6px;
  height: 10px;
}
.all-rate {
  width: 145px;
  text-align: left;
}
.object-body {
  position: relative;
  margin-top: 15px;
}
.kongbai {
  // margin-top: 12px
  height: 12px;
}
.more-icon {
  height: 25px;
}
.gray-btn {
  width: 61px;
  height: 51px;
  bottom: -20px;
  margin-top: 0;
}
.jiesu {
  background: url(~@/assets/moneyManage/licai_ic_over.png) center/100% 100%;
}
.shouqing {
  background: url(~@/assets/moneyManage/licai_ic_sold.png) center/100% 100%;
}
</style>
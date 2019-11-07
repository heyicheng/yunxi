<template>
  <div class="page">
    <!-- home
    <div class="page">sss</div>-->
    <van-nav-bar :title="$route.meta.title" @click-right="onClickRight">
      <div slot="right" class="clock">
        <div v-if="messageCount.personalnumber>0 || messageCount.systemnumber>0" class="ret-dot"></div>
        <img src="@/assets/home/ic_message.png" class="clock-img" alt>
      </div>
    </van-nav-bar>

    <van-swipe :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="(item,index) in bannerList"
        :key="index"
        @click="goActivity(item.link)"
      >
        <img :src="item.imagelogo" alt class="bannerimg">
      </van-swipe-item>
    </van-swipe>
    <ul class="nav-page flex-row-around">
      <li class="nav-list" @click="noviceExclusive()">
        <div class="nav-img">
          <img src="@/assets/home/home_icon_newaccount.png" alt>
        </div>
        <p>新手专享</p>
      </li>
      <li class="nav-list" @click="$router.push({name:'invitePresent'})">
        <div class="nav-img invite">
          <img src="@/assets/home/home_icon_invite.png" alt>
        </div>
        <p>邀请有礼</p>
      </li>
      <li class="nav-list" @click="$router.push({name:'drawPrize'})">
        <div class="nav-img clock">
          <img src="@/assets/home/home_icon_lottery.png" alt>
        </div>
        <p>参与抽奖</p>
      </li>
      <li class="nav-list" @click="safetyGuarantee()">
        <div class="nav-img">
          <img src="@/assets/home/home_icon_security.png" alt>
        </div>
        <p>安全保障</p>
      </li>
    </ul>

    <div class="notice">
      <notice height="40" width="280" bg="#fff" color="#333D53" :marqueeList="newNoticeList"></notice>
    </div>

    <div v-for="(item,index) in homeList" :key="index">
      <div class="separate"></div>
      <div class="contain">
        <div class="headline flex-row-start">
          <div class="blue-bar"></div>
          <span class="headline-title">{{item.plantypename}}</span>
          <span class="headline-eg">{{item.node}}</span>
        </div>
        <ul class="object-list">
          <li
            class="object-unit"
            v-for="(unit) in item.planlist"
            :key="unit.planno"
            @click="goDetail(unit.planno,unit.planname,unit.pid,unit.planstatus)"
          >
            <div class="object-title flex-row-between">
              <span>{{unit.planname}}</span>
              <div class="brand" v-if="unit.plantag">
                <div class="masonrY fl"></div>
                <p class="fl icon-text">{{unit.plantag}}</p>
              </div>
            </div>
            <div class="describe">{{unit.plansummary}}</div>
            <div class="earnings flex-row-between">
              <div>
                <span class="rate">{{(unit.annualrate-unit.fixedinterestrate).toFixed(2)}}</span>
                <span class="baifenbi">%</span>
                <span class="baifenbi" v-if="unit.fixedinterestrate">+</span>
                <span class="orangerate" style="positon:relative" v-if="unit.fixedinterestrate">
                  <span style="font-weight:500">{{unit.fixedinterestrate.toFixed(2)}}%</span>
                  <div class="pingtaijiaxi">{{unit.fixedinterestname}}</div>
                </span>
              </div>
              <van-button type="warning" v-if="unit.planstatus==10" class="invest">立即投资</van-button>
              <div class="gray-btn shouqing" v-if="unit.planstatus>10&&unit.planstatus<50"></div>
              <div class="gray-btn jiesu" v-if="unit.planstatus==50"></div>
            </div>
            <div class="object-foot flex-row-between">
              <span class="object-text">预期年化收益</span>
              <div class="flex-row-start">
                <span class="deadline">期限{{unit.investmentterm}}天</span>
                <div class="object-text shuxian">项目金额{{unit.planamount/10000}}万</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="separate"></div>
    <div class="foot-bg"></div>

    <foot-notice></foot-notice>
    <div class="tel flex-row-center">
      <img class="tel-img" src="@/assets/home/foot_ic_customer.png" alt>
      <a href="tel:4000-119-888" class="telphone">4000-119-888</a>
    </div>
  </div>
</template>
<script>
import { Swipe, SwipeItem } from "vant";
import Notice from "@@/home/notice";
import { LOGIN } from "@/api/login";
import FootNotice from "@/components/footNotice";
import { GETBANNER, GETHOMELIST, GETNOTICE } from "@/api/home";
import { GetMessageCountUtils } from "@/utils/messageUtils.js";

export default {
  name: "home",
  data() {
    return {
      bannerList: [],
      messageCount: { systemnumber: 0, personalnumber: 0 },
      token: localStorage.getItem("token"),
      noticeList: [],
      homeList: []
    };
  },
  inject: ["reload"],
  components: {
    vanSwipe: Swipe,
    vanSwipeItem: SwipeItem,
    Notice,
    FootNotice
  },
  computed: {
    newNoticeList() {
      var list = [];
      this.noticeList.forEach((val, index) => {
        let obj = {
          str: "",
          title: val.msgtitle,
          text: val.msgtext,
          id: val.id,
          time: val.createtime,
          url: ""
        };
        var date = new Date(val.createtime.slice(0, 10));
        obj.str =
          date.getFullYear() +
          "." +
          (date.getMonth() + 1) +
          "." +
          date.getDay();
        obj.str = obj.str + val.msgtitle;

        list.push(obj);
      });
      console.log(list,'公告')
      return list;
    }
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
    noviceExclusive() {
      this.$router.push('/newUsers');
    },
    safetyGuarantee() {
      this.$router.push('/safeGurante');
    },
    goActivity(src) {
      if (this.Global.isEmpty(src)) {
        return
      }
      localStorage.setItem("url_to_open", src);
      this.$router.push('/showContent')
    },
    onClickLeft() {
      Toast("返回");
    },
    onClickRight() {
      this.$router.push("/message");
    },
    webInit() {
      GETBANNER({ type: 1 }).then(res => {
        console.log(res);
        if (res.ResultCode == 0) {
          this.bannerList = res.Data.list;
        } else if (res.ResultCode == 501) {
          this.reload();
        }
      });
      GetMessageCountUtils((personal, activity, system, error) => {
        this.messageCount.personalnumber = personal;
        this.messageCount.systemnumber = system;
      });
      GETHOMELIST().then(res => {
        //传不传token都可以
        console.log(res);
        if (res.ResultCode == 0) {
          this.homeList = res.Data.planlist;
        }
      });
      GETNOTICE({
        //传不传token都可以
        msgtype: 3,
        isshowindex: -10,
        pageindex: 1,
        pagesize: 3
      }).then(res => {
        if (res.ResultCode == 0) {
          this.noticeList = res.Data.messagelist;
        }
      });
    }
  },
  mounted() {
    this.webInit();
    // 清除活动相关缓存
    localStorage.removeItem("url_to_open");
    localStorage.removeItem("activity_history_length");
  }
};
</script>

<style lang="scss" scoped>
img {
  width: 100%;
  height: 100%;
}
/deep/ .van-nav-bar__right {
  // top: 11px;
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
/deep/ .van-swipe {
  height: 198px;
}
.nav-page {
  height: 99px;
}
.nav-list {
  font-size: 12px;
  .nav-img {
    width: 38px;
    height: 38px;
    margin-left: 6px;
    margin-bottom: 14px;
  }
  // .clock {
  //   width: 36px;
  //   height: 36px;
  // }
  // .invite {
  //   width: 35px;
  //   height: 34px;
  // }
}
.separate {
  height: 10px;
  opacity: 1;
  background: rgba(250, 250, 250, 1);
}

.contain {
  padding: 19px 16px 20px 16px;
}
.headline {
  height: 18px;
  vertical-align: baseline;
}
.blue-bar {
  height: 18px;
  width: 3px;
  background: rgba(74, 144, 224, 1);
}
.headline-title {
  font-size: 18px;
  line-height: 18px;
  color: rgba(49, 49, 52, 1);
  margin-left: 15px;
  font-weight: 500;
}
.headline-eg {
  color: rgba(154, 163, 173, 1);
  font-size: 10px;
  line-height: 18px;
  margin-left: 15px;
}
.object-list {
  // margin-top: 19px;
}
.object-unit {
  text-align: left;
  margin-top: 19px;
  box-shadow: 0px 2px 24px 0px rgba(195, 195, 195, 0.5);
  padding: 20px 15px;
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
  text-align: left;
  display: inline-block;
  background: rgba(248, 248, 249, 1);
  height: 17px;
  // width: 78px;
  color: rgba(99, 105, 118, 1);
  font-size: 10px;
  line-height: 17px;
  margin-top: 7px;
  // padding: 1px 2px;
}
.earnings {
  align-items: flex-end;
  margin-top: 10px;
}
.rate {
  font-size: 32px;
  line-height: 28px;
  font-weight: 500;
}
.orangerate {
  position: relative;
  font-weight: 500;
  font-size: 18px;
  line-height: 16px;
  color: rgba(255, 145, 0, 1);
}
.baifenbi {
  font-weight: 500;
  font-size: 18px;
  line-height: 16px;
}
.baifenbi {
  font: outline;
}
.invest {
  background: rgba(255, 145, 0, 1);
  height: 32px;
  width: 82px;
  line-height: 32px;
  padding: 0;
}
.object-text {
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
  font-size: 12px;
  line-height: 12px;
}
.object-foot {
  margin-top: 40px;
  margin-bottom: 10px;
}
.foot-bg {
  height: 89px;
  background: rgba(250, 250, 250, 1) url(~@/assets/home/home_img.png) no-repeat
    left top / contain;
}
.tel {
  background: rgba(250, 250, 250, 1);
  height: 50px;
}
.tel-img {
  width: 12px;
  height: 12px;
}
.telphone {
  font-size: 12px;
  line-height: 12px;
  color: rgba(49, 49, 53, 1);
  margin-left: 4px;
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
.gray-btn {
  width: 61px;
  height: 61px;
  // background: red;
  margin-bottom: -10px;
}
.shouqing {
  background: url(~@/assets/home/home_ic_sold.png) center / 100% 100%;
}
.jiesu {
  background: url(~@/assets/home/home_ic_over.png) center / 100% 100%;
}
</style>
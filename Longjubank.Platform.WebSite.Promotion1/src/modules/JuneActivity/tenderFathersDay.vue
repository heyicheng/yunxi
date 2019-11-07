<template>
  <v-container activityID="24" @tokenExpired="tokenExpired" @activityStatus="loadActivityStatus">
    <template v-slot:content v-cloak>
      <div class="banner"></div>
      <div class="partOne"></div>
      <div class="partTwo"></div>
      <div
        v-if="!logintoken || activityStatus === 0 || activityStatus === 1"
        class="invest lowerframe"
      >
        <p v-if="activityStatus === 0 || activityStatus === 1" class="activityNotReady">“活动尚未开始”</p>
        <button v-else class="loginButton" @click="loginClick">登录查看</button>
      </div>
      <div v-else class="invest higherframe">
        <div class="clearfix investItem">
          <p class="fl investTitle">投资期限</p>
          <p class="fl rightinvestTitle">累计投资</p>
        </div>
        <div class="clearfix investItem">
          <div class="investSeperate"></div>
        </div>
        <div class="clearfix investItem investNum">
          <div class="leftcontent fl">
            <img src="./assets/web/itemicon.png" class="fl itemicon">
            <p class="fl itemTitle">温情礼遇91天</p>
          </div>
          <p class="fl amount">{{plan91totalbidamount}}</p>
        </div>
        <div class="clearfix investItem investNum">
          <div class="leftcontent fl">
            <img src="./assets/web/itemicon.png" class="fl itemicon">
            <p class="fl itemTitle">温情礼遇362天</p>
          </div>
          <p class="fl amount">{{plan362totalbidamount}}</p>
        </div>
        <div class="clearfix investItem investNum">
          <div class="leftcontent fl">
            <img src="./assets/web/itemicon.png" class="fl itemicon">
            <p class="fl itemTitle">温情礼遇176天</p>
          </div>
          <p class="fl amount">{{plan176totalbidamount}}</p>
        </div>
        <div class="clearfix investItem investNum">
          <div class="leftcontent fl">
            <img src="./assets/web/itemicon.png" class="fl itemicon">
            <p class="fl itemTitle">温情礼遇125天</p>
          </div>
          <p class="fl amount">{{plan125totalbidamount}}</p>
        </div>
      </div>
      <div class="activity">
        <div class="activityrule"></div>
        <p class="interpretation">如有任何疑问请咨询在线客服，或致电4000-119-888。本活动最终解释权归龙驹财行所有</p>
      </div>
      <v-mask
        :imgSrc="require('./assets/web/activity-finished.png')"
        @closeClick="closeActivityOverMask"
        :showMask="showActivityOver"
      ></v-mask>
    </template>
  </v-container>
</template>

<script>
import Container from "@@/ContentContainer/ContentContainer";
import Mask from "@@/ActivityFinishedMask/ActivityFinishedMask";

import {
  TopJetConfig,
  LongjulcServerRequest,
  GoToLogin
} from "@/javascripts/longjulc_activity.js";
export default {
  components: {
    "v-container": Container,
    "v-mask": Mask
  },
  data: function data() {
    return {
      activityStatus: 1,
      logintoken: TopJetConfig.token,
      showActivityOver: false,
      bidAmount: null
    };
  },

  computed: {
    plan91totalbidamount: function plan91totalbidamount() {
      if (this.bidAmount && "plan91totalbidamount" in this.bidAmount) {
        return this.bidAmount.plan91totalbidamount.toFixed(0) + "元";
      } else {
        return "0元";
      }
    },
    plan362totalbidamount: function plan362totalbidamount() {
      if (this.bidAmount && "plan362totalbidamount" in this.bidAmount) {
        return this.bidAmount.plan362totalbidamount.toFixed(0) + "元";
      } else {
        return "0元";
      }
    },
    plan176totalbidamount: function plan176totalbidamount() {
      if (this.bidAmount && "plan176totalbidamount" in this.bidAmount) {
        return this.bidAmount.plan176totalbidamount.toFixed(0) + "元";
      } else {
        return "0元";
      }
    },
    plan125totalbidamount: function plan125totalbidamount() {
      if (this.bidAmount && "plan125totalbidamount" in this.bidAmount) {
        return this.bidAmount.plan125totalbidamount.toFixed(0) + "元";
      } else {
        return "0元";
      }
    }
  },
  methods: {
    loginClick() {
      GoToLogin();
    },
    closeActivityOverMask() {
      this.showActivityOver = false;
    },
    loadActivityStatus(response) {
      var _this = this;
      if (response.ResultCode == 0) {
        var res = JSON.parse(response.Data);
        _this.activityStatus = res.activitytimearea;
        // 活动已经关闭或结束
        if (res.activitytimearea === 3) {
          _this.showActivityOver = true;
        }

        if (res.activitytimearea === 3 || res.activitytimearea === 2) {
          _this.logintoken && _this.loadActivityAmount();
        }
      }
    },
    loadActivityAmount() {
      var _this = this;

      LongjulcServerRequest(
        "GetMainActivityBidAmount",
        "JunePhonePrizeActivity"
      ).then(response => {
        if (response.ResultCode == 0) {
          _this.bidAmount = JSON.parse(response.Data);
        }
      });
    },
    tokenExpired() {
      this.logintoken = "";
    }
  },
  mounted() {
    document.title = '温情礼遇，贴心相赠';
  }
};
</script>

<style scoped>
@import "./tenderFathersDay.css";
</style>

<style scoped lang='scss'>
/deep/.foot {
  background: #bce6da;
}
/deep/.foot p,
/deep/.foot p a {
  font-size: 20px;
  color: #709b8e;
  height: 40px;
  line-height: 40px;
}
/deep/.foot p a:hover {
  color: blue;
}
</style>

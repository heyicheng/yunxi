<template>
  <v-container @tokenExpired="tokenExpired">
    <template v-slot:content v-cloak>
      <div class="banner"></div>
      <div class="bannertwo"></div>
      <div class="bodyone"></div>
      <div class="bodytwo">
        <div class="contain">
          <div v-if="activityStatus==1" class="notstart juzhong">“活动尚未开始”</div>
          <div v-else-if="!token" @click="login" class="login juzhong">登录查看</div>
          <div v-else class="myinvest">
            <ul>
              <li class="head clearfix">
                <div class="danyuan fl">投资期限</div>
                <div class="danyuan right fl">累计投资</div>
              </li>
              <li class="content clearfix">
                <div class="danyuan fl">
                  <img src="./assets/date.png" alt class="date">
                  <span>活力返场540天</span>
                </div>
                <div class="danyuan right fl">{{data.plan540totalbidamount}}元</div>
              </li>
              <li class="contenttwo clearfix">
                <div class="danyuan fl">
                  <img src="./assets/date.png" alt class="date">
                  <span>活力返场270天</span>
                </div>
                <div class="danyuan right fl">{{data.plan270totalbidamount}}元</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="rules"></div>
      <!-- </div> -->
      <div class="wap"></div>
      <div class="interpretation">如有任何疑问请咨询在线客服，或致电4000-119-888。本活动最终解释权归龙驹财行所有</div>
      <div class="interpretation-wap">
        如有任何疑问请咨询在线客服，或致电4000-119-888
        <div>本活动最终解释权归龙驹财行所有</div>
      </div>
      <v-mask
        :imgSrc="require('./assets/gameover.png')"
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
  LongjulcServerRequest
} from "@/javascripts/longjulc_activity.js";
export default {
  components: {
    "v-container": Container,
    "v-mask": Mask
  },
  data() {
    return {
      ActivityId: 25, //活动id
      activityStatus: 0, //1,2,3
      is_over: false, //活动是否结束
      token: TopJetConfig.token,
      data: {},
      showActivityOver: false
    };
  },
  methods: {
    getActivityStatus: function getActivityStatus() {
      var _this = this;

      LongjulcServerRequest("GetActivityInfo", "NP", {
        ActivityId: this.ActivityId
      }).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          // log(res)
          // res.activitytimearea = 3
          _this.activityStatus = res.activitytimearea;
          if (res.activitytimearea == 3) {
            _this.is_over = true;
          }
        }
      });
    },
    closeDialog: function closeDialog() {
      this.is_over = false;
    },
    getRecord: function getRecord() {
      var _this2 = this;

      LongjulcServerRequest(
        "GetBackActivityBidAmount",
        "JunePhonePrizeActivity"
      ).then(res => {
        if (res.ResultCode == 0) {
          _this2.data = JSON.parse(res.Data);
        }
      });
    },
    login: function login() {
      GoToLogin();
    },
    closeActivityOverMask() {
      this.showActivityOver = false;
    }
  },
  mounted: function mounted() {
    this.getActivityStatus();
    this.getRecord();
  }
};
</script>

<style scoped>
@import "./encore.css";
</style>

<style scoped lang='scss'>
/deep/.foot p,
/deep/.foot p a {
  font-size: 18px;
  color: #d3a3ff;
}
/deep/.foot p a:hover {
  color: blue;
}
/deep/.foot {
  margin-bottom: 50px;
}
/deep/.foot,
/deep/.foot p {
  height: 40px;
  line-height: 40px;
}
</style>

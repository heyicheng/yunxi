<template>
  <v-container @tokenExpired="tokenExpired">
    <template v-slot:content v-cloak>
      <div class="banner"></div>
      <div class="example">
        <div class="part1"></div>
      </div>
      <div class="myprize">
        <div class="not-start clearfix" v-if="activityStatus==1">
          <div class="fl hengxian left"></div>
          <div class="fl">活动尚未开始</div>
          <div class="fl hengxian right"></div>
        </div>
        <div class="amount" v-else-if="token">
          <div class="left50">
            <div class="card card50"></div>
            <span>
              <span>可获得</span>

              <span class="orange">{{data.supermarketcards50}}</span>张
            </span>
          </div>
          <div>
            <div class="card card200"></div>
            <span>
              <span>可获得</span>
              <span class="orange">{{data.supermarketcards200}}</span>张
            </span>
          </div>
        </div>
        <div class="logincontain" v-else>
          <div @click="login" class="login">登录查看</div>
        </div>
      </div>
      <div class="rules"></div>
      <div class="foot-explain">如有任何疑问请咨询在线客服，或致电4000-119-888。本活动最终解释权归龙驹财行所有</div>
      <!--活动结束-->
      <v-mask
        :imgSrc="require('./assets/gameover.png')"
        @closeClick="is_over = false"
        :showMask="is_over"
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
  computed: {},
  data() {
    return {
      ActivityId: 31, //活动id
      activityStatus: 0, //1,2,3
      is_over: false, //活动是否结束
      token: TopJetConfig.token,
      data: {}
    };
  },
  methods: {
    tokenExpired() {
      this.token = "";
    },
    login() {
      GoToLogin();
    },
    getActivityStatus: function getActivityStatus() {
      var _this = this;
      LongjulcServerRequest("GetActivityInfo", "NP", {
        ActivityId: this.ActivityId
      }).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          // res.activitytimearea = 2;
          _this.activityStatus = res.activitytimearea;
          if (res.activitytimearea == 3) {
            _this.is_over = true;
          }
        }
      });
    },
    getInfo() {
      LongjulcServerRequest(
        "getRecommendPrizeInfo",
        "OctoberActivity",
        {}
      ).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          this.data = res;
        }
      });
    }
  },
  mounted() {
    document.title = "推荐赚好礼";
    this.getActivityStatus();
    if (this.token) {
      this.getInfo();
    }
  },
  watch: {}
};
</script>
<style scoped lang='scss'>
/deep/.foot p,
/deep/.foot p a {
  font-size: 20px;
  color: #946142;
}
/deep/.foot p a:hover {
  color: blue!important;
}
/deep/.foot {
  padding-bottom: 50px;
}
/deep/.foot,
/deep/.foot p {
  height: 40px;
  line-height: 40px;
}
</style>
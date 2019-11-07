<template>
  <div>
    <!-- 副导航开始 -->
    <div class="nav">
      <div class="nav_content clearfix">
        <div class="fl nav_left">
          <span>客服电话：4000-119-888&nbsp;</span>
          <span class="line"></span>
          <a class="link" :href="homePageURL">
            龙驹财行首页
            <img src="./assets/guide_back.png">
          </a>
        </div>
        <div class="fr nav_right">
          <ul class="clearfix">
            <template v-if="isLogin">
              <li class="welcome hide" style="display: list-item;">欢迎{{ userAccount }}来到龙驹财行！</li>
              <li class="border_right hide" style="display: list-item;">
                <a class="link" :href="msgPageURL" id="msg">消息【{{ messageNum }}】</a>
              </li>
              <li class="hide border_right" style="display: list-item;">
                <a class="link" :href="exitPageURL">退出</a>
              </li>
            </template>
            <template v-else>
              <li class="welcome show" style="display: list-item;">欢迎来到龙驹财行！</li>
              <li class="border_right show" style="display: list-item;">
                <a class="link" :href="loginPageURL">登录</a>
              </li>
              <li class="border_right show" style="display: list-item;">
                <a class="link" :href="registerPageURL">注册</a>
              </li>
            </template>
            <li class="border_right">
              <a class="link" :href="activityPageURL" target="_blank">
                <img src="./assets/active_j.png">
              </a>
            </li>
            <li class="mobile">
              <a class="link" :href="appDownloadURL" target="_blank">手机客户端</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--副导航结束  -->
    <slot name="content"></slot>
    <!-- 尾部开始 -->
    <div class="foot">
      <p>
        Copyright © 2019
        <a :href="homePageURL" class="icpNumber">LongJuLC </a>
        <a href="http://www.miitbeian.gov.cn/" target="_blank" class="icpNumber">赣ICP备18014587号</a>
        市场有风险，投资需谨慎
      </p>
    </div>
    <p v-if="isIPhone" class="ios_content">苹果公司不是本活动的赞助商，不以任何形式参与此活动也不为此活动提供任何奖品</p>
    <!-- 尾部结束-->
  </div>
</template>

<script>
import "../../style/longjulc_activity.css";
import "../../javascripts/longjulc_activity.js";
import "../../javascripts/rem.js";

import {
  TopJetConfig,
  getCookie,
  LongjulcServerRequest
} from "../../javascripts/longjulc_activity.js";

export default {
  data() {
    return {
      isLogin: false,
      userAccount: "",
      messageNum: 0
    };
  },
  props: {
    activityID: {
      default: -1
    }
  },
  computed: {
    homePageURL() {
      return process.env.VUE_APP_LONGJULC_HOME_URL;
    },
    msgPageURL() {
      return process.env.VUE_APP_LONGJULC_HOME_URL + "/MyAccount/MyMessage";
    },
    exitPageURL() {
      return process.env.VUE_APP_LONGJULC_HOME_URL + "/common/Exit";
    },
    loginPageURL() {
      return process.env.VUE_APP_LONGJULC_HOME_URL + "/User/Login";
    },
    registerPageURL() {
      return process.env.VUE_APP_LONGJULC_HOME_URL + "/User/Register";
    },
    activityPageURL() {
      return (
        process.env.VUE_APP_LONGJULC_HOME_URL + "/Activity/ActivitySpeciaAll"
      );
    },
    appDownloadURL() {
      return process.env.VUE_APP_LONGJULC_MSG_URL + "/mobile_app.html";
    },
    isIPhone() {
      return navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    }
  },
  methods: {
    clearToken() {
      TopJetConfig.token = "";
      this.$emit("tokenExpired");
    },
    loadActivutyStatus() {
      LongjulcServerRequest("GetActivityInfo", "NP", {
        ActivityId: this.activityID
      }).then(response => {
        this.$emit('activityStatus', response);
      });
    },
  },
  mounted() {
    if (TopJetConfig.equipment === 'pc') {
      let information = getCookie(process.env.VUE_APP_INFORMATION_COOKIE_KEY);
      if (information === null) {
        this.clearToken();
      } else {
        LongjulcServerRequest("CheckToken", "Account")
        .then(response => {
          if (response.ResultCode === 0) {
            var attr = information.split(",");
            this.userAccount = attr[0];
            this.messageNum = attr[1];
            this.isLogin = true;
          } else {
            this.clearToken();
          }
        })
        .catch(err => {
          this.clearToken();
        });
      }
    }

    this.loadActivutyStatus();
  },
  watch:{
    activityID(val) {
      this.loadActivutyStatus();
    }
  }
};
</script>

<style scoped>
@import "./ContentContainer.css";
</style>

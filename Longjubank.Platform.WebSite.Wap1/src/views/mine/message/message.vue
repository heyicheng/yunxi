<template>
  <div id="page" class="page">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      @click-left="goBack"
      right-text="全设已读"
      @click-right="onClickRight"
    />
    <van-tabs
      v-model="active"
      swipeable
      animated
      title-active-color="rgba(74,144,224,1)"
      title-inactive-color="rgba(154,163,173,1)"
      color="rgba(74,144,224,1)"
    >
      <van-tab>
        <div slot="title" class="clock">
          <span>个人消息</span>
          <div class="ret-dot" v-if="personal>0"></div>
        </div>
        <div class="div-container">
          <v-person name="person" v-if="alreadyLogin()" :refresh="refresh"></v-person>
          <div v-else class="div-no-news">
            <img src="../../../assets/message/ic_no_news.png">
            <p>登录后可查看个人消息</p>
          </div>
        </div>
      </van-tab>
      <van-tab title="活动通知">
        <div class="div-container">
          <v-act name="activityNotice"></v-act>
        </div>
      </van-tab>
      <van-tab>
        <div slot="title" class="clock">
          <span>平台公告</span>
          <div class="ret-dot" v-if="system>0"></div>
        </div>
        <div class="div-container">
          <v-sys name="sysNotification" :islogin="alreadyLogin()" :refresh="refresh"></v-sys>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { Tab, Tabs } from "vant";
import personMessage from "@/views/mine/message/personMessage";
import sysNotification from "@/views/mine/message/sysNotification";
import activityNotice from "@/views/mine/message/activityNotice";
import { ReadAllMessage } from "@/api/message";
import { Toast } from "vant";
import { GetMessageCountUtils } from "@/utils/messageUtils.js";
export default {
  components: {
    "van-tab": Tab,
    "van-tabs": Tabs,
    "v-person": personMessage,
    "v-sys": sysNotification,
    "v-act": activityNotice
  },
  beforeDestroy() {
    localStorage.setItem("message_position", this.active);
  },
  data() {
    return {
      active: 0,
      refresh: 0,
      personal: 0,
      system: 0
    };
  },
  mounted() {
    let isposition = localStorage.getItem("message_back");
    if (isposition) {
      this.active = localStorage.getItem("message_position");
      localStorage.removeItem("message_back");
    }
    GetMessageCountUtils((personal, activity, system, error) => {
      this.personal = personal;
      this.system = system;
    });
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    alreadyLogin() {
      var token = localStorage.getItem("token");
      return token != null && token != "undefined" && token.length > 0;
    },
    onClickRight() {
      ReadAllMessage().then(response => {
        console.log(response);
        if (response.ResultCode == 0) {
          Toast(response.ResultMsg);
          this.refresh++;
          this.personal = 0;
          this.system = 0;
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
/deep/.van-tabs--line .van-tabs__wrap {
  height: 43px;
}
.van-tabs.van-tabs--line {
  height: 43px;
  padding-top: 43px;
}
/deep/.van-hairline--top-bottom::after {
  border-bottom: 1px solid #ededed;
  top: 0;
  bottom: 0px;
  -webkit-transform: none !important;
  transform: none !important;
}
.clock {
  position: relative;
  .ret-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(247, 54, 54, 1);
    top: 9px;
    right: 18px;
  }
}
.div-container {
  position: fixed;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.full-screen {
  position: absolute;
  height: 100%;
  width: 100%;
}
/deep/.van-tabs__wrap {
  // position: fixed;
  // top: 40px;
}
.v-list {
  position: relative;
  width: 100%;
  height: calc(100% - 20px);
  overflow: auto;
  padding-top: 14px;
}
.van-nav-bar__right {
  font-size: 13px;
  line-height: 40px;
  height: auto;
}
.van-nav-bar__text {
  color: rgba(49, 49, 52, 1);
}
.van-tabs {
  height: 100%;
}
/deep/.van-tabs__content--animated {
  position: relative;
  height: 100%;
  width: 100%;
}
.div-no-news {
  margin: auto;
  position: relative;
  top: 100px;
  height: 500px;
  img {
    width: 90px;
    height: 90px;
  }
  p {
    opacity: 0.5;
    font-size: 14px;
    color: rgba(154, 163, 173, 1);
    line-height: 15px;
    letter-spacing: 0px;
  }
}
</style>


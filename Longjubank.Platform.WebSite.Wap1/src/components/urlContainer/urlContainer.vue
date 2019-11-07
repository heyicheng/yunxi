<template>
  <div class="page">
    <van-nav-bar :title="title" left-arrow @click-left="GOBACK"/>
    <iframe id="frame" class="iframe" :src="destUrl" frameborder="0" @load="onLoad"></iframe>
  </div>
</template>

<script>
import {transCrossOriginURL, setTitle, getToken, p2p_OpenUI, goToLogin, enable_social_share} from "@/utils/iframeInteract.js"

export default {
  data() {
    return {
      destUrl: null,
      title: "",
      injectJSFunction: false
    };
  },
  beforeMount() {
    var data = localStorage.getItem("url_to_open");
    localStorage.setItem('activity_history_length', window.history.length)
    let transUrl = transCrossOriginURL(data);
    if (transUrl != data) {
      this.injectJSFunction = true;
    }
    this.destUrl = transUrl;
  },
  mounted() {
    if (this.injectJSFunction) {
      document.getElementById("frame").contentWindow.sug = {}
      document.getElementById("frame").contentWindow.sug.getToken = getToken;
      document.getElementById("frame").contentWindow.sug.goToLogin = goToLogin;
      document.getElementById("frame").contentWindow.sug.p2p_OpenUI = p2p_OpenUI;
      document.getElementById("frame").contentWindow.sug.enable_social_share = enable_social_share;
    }
  },
  methods: {
    onLoad() {
      this.title = document.getElementById(
        "frame"
      ).contentWindow.document.title;
      document.body.scrollIntoView()
    },
    GOBACK() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang='scss'>
.iframe {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: calc(100% - 40px);
  top: 40px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
/deep/.van-nav-bar__text {
  color: #313134;
  font-size: 14px;
}
</style>

<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <iframe id="frame" class="iframe" :src="destUrl" frameborder="0" @load="onload"></iframe>
  </div>
</template>

<script>
import {transCrossOriginURL, setTitle, getToken, p2p_OpenUI, goToLogin} from "@/utils/iframeInteract.js"

export default {
  mounted() {
    document.getElementById("frame").contentWindow.setTitle = setTitle;
    document.getElementById("frame").contentWindow.getToken = getToken;
    document.getElementById("frame").contentWindow.p2p_OpenUI = p2p_OpenUI;
  },
  computed: {
    destUrl() {
      if (this.$route.path === "/userguide") {
        return (
          process.env.VUE_APP_H5SERVER +
          "/p2ph5/act/safePreventative/index.html"
        );
      } else if (this.$route.path === "/partner") {
        return (
          process.env.VUE_APP_H5SERVER +
          "/p2ph5/introduce/CooperativePartner.html"
        );
      } else if (this.$route.path === "/introduce") {
        return (
          process.env.VUE_APP_H5SERVER + "/p2ph5/introduce/comprehend.html"
        );
      } else if (this.$route.path === "/QAcenter") {
        return process.env.VUE_APP_H5SERVER + "/p2ph5/person/help/help.html";
      } else if (this.$route.name === "newsDetail") {
        return (
          process.env.VUE_APP_H5SERVER +
          "/p2ph5/find/newsDetail.html?id=" +
          this.$route.params.newsid
        );
      } else if (this.$route.name === "newUsers") {
        return process.env.VUE_APP_H5SERVER + "/p2ph5/gg/2231/new.html";
      } else if (this.$route.name === "safeGurante") {
        return process.env.VUE_APP_H5SERVER + "/p2ph5/safe/safe.html";
      }
      return null;
    }
  },
  methods: {
    onload() {
      if (this.$route.name === "newsDetail") {
        let aTagList = document.getElementById('frame').contentWindow.document.getElementsByTagName('a');
        if (aTagList.length > 0) {
          aTagList[0].addEventListener('click', this.newsDetailsHrefClick);
        }
      }
    },
    newsDetailsHrefClick(e) {
      window.location.href = document.getElementById('frame').contentWindow.document.getElementsByTagName('a')[0].getAttribute('href')
    },
    GOBACK() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped lang="scss">
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
</style>

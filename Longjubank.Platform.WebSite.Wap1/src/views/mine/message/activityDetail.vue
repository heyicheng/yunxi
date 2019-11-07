<template>
  <div class="page">
    <van-nav-bar :title="title" left-arrow @click-left="goBack()"/>
    <iframe id="frame" name="frame" :src="destUrl" frameborder="0"></iframe>
  </div>
</template>
<script>
import { Toast } from "vant";
import { isNull } from "util";
export default {
  data() {
    return {
      destUrl: this.$route.query.path,
      title: this.$route.query.title
    };
  },
  mounted() {
    document.getElementById("frame").contentWindow.getToken = this.getToken;
    document.getElementById("frame").contentWindow.setTitle = this.setTitle;
    document.title = this.$route.query.title;
    if (this.$route.query.path.search('images.longjubank.com') != -1) {
      this.destUrl = `${this.$route.query.path}?imageView2/0/w/${
        document.body.clientWidth
      }`;
    }
  },
  created() {
    window.addEventListener("popstate", this.setstatus());
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.setstatus());
  },
  methods: {
    setstatus() {
      localStorage.setItem("message_back", true);
    },
    setTitle() {},
    getToken() {
      if (isNull(localStorage.getItem("token"))) {
        return "";
      } else return localStorage.getItem("token");
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>
<style scoped lang="scss">
iframe {
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: calc(100% - 40px);
  top: 40px;
  bottom: 0px;
  left: 0px;
  right: 0px;
}
/deep/.img {
  max-width: 100%;
}
</style>


<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <iframe class="iframe" id="frame" :src="destUrl" width="100%" height="800px" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  mounted() {
    document.getElementById("frame").contentWindow.setTitle = this.setTitle;
    document.getElementById("frame").contentWindow.getToken = this.getToken;
  },
  computed: {
    destUrl() {
      if (this.$route.path === "/bankcardUnbind") {
        return process.env.VUE_APP_HFUSER;
      }
      return null;
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    setTitle() {
      console.log("setTitle");
    },
    getToken() {
      return localStorage.getItem("token");
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

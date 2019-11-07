<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <iframe class="iframe" id="frame" :src="destUrl" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  mounted() {
    document.getElementById("frame").contentWindow.setTitle = this.setTitle;
    document.getElementById("frame").contentWindow.getToken = this.getToken;
    document.getElementById(
      "frame"
    ).contentWindow.getBorrowOrderID = this.getBorrowOrderID;

    if (this.$route.params.financialUrl) {
      window.location.replace(this.$route.params.financialUrl)
    }
  },
  computed: {
    destUrl() {
        if (this.$route.params.financialUrl) {
          return null
        }else {
          return process.env.VUE_APP_H5SERVER + "/p2ph5/agent/protocol/loanPro.html"
        }
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    setTitle() {},
    getToken() {
      return localStorage.getItem("token");
    },
    getBorrowOrderID() {
      return this.$route.params.protocol;
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

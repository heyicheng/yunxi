<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" right-text="关闭" @click-right="GOBACK"/>
    <iframe class="iframe" :src="destUrl" frameborder="0" @load="onLoad"></iframe>
  </div>
</template>

<script>
import { constants } from "crypto";
export default {
  data() {
    return {
      destUrl: null
    };
  },
  mounted() {
    var data = JSON.parse(localStorage.getItem("accountBalance"));

    var queryStr = "";
    var keys = Object.keys(data.PostData).sort(function(a, b) {
      return a.localeCompare(b);
    });
    for (const key in keys) {
      var value = data.PostData[keys[key]];
      if (value === null || value.length == 0) {
        value = "";
      }
      queryStr += keys[key] + "=" + encodeURI(value) + "&";
    }
    queryStr = queryStr.substring(0, queryStr.length - 1);

    this.destUrl = data.PayUrl + "?" + queryStr;
  },
  methods: {
    GOBACK() {
      this.$router.replace("/myaccount");
    },
    onLoad() {
      document.body.scrollIntoView()
    }
  },
  destroyed() {
    localStorage.removeItem("accountBalance");
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

<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <iframe
      id="frame"
      name="frame"
      :src="destUrl"
      style="position:fixed;height:100%;width:100%;left:0"
      frameborder="0"
      @load="load()"
    ></iframe>
  </div>
</template>
<script>
import { Toast } from "vant";
import myAccountVue from "../../views/mine/myAccount.vue";
// 在窗口B中监听 message 事件
window.addEventListener(
  "message",
  function(event) {
    // window.history.length > 1 ? window.history.go(-1) : window.history.go("/");
    console.log(event);
    if (event.data.msg == "btnClicked") {
      window.location.replace("myAccount");
    }
  },
  false
);
export default {
  data() {
    return {
      destUrl: this.$route.query.PayUrl,                           
      // destUrl: 
      //   process.env.VUE_APP_H5SERVER +
      //   "/p2ph5/person/detail/bankHomeSuccess.html",
      PostData: this.$route.query.PostData
    };
  },
  mounted() {
    // this.httpPost(this.$route.query.PayUrl, this.$route.query.PostData);
  },
  methods: {
    load() {
      console.log(parent.document.getElementById("frame").contentWindow.location.href);
      if (
        document
          .getElementById("frame")
          .contentWindow.location.href.search("") != -1
      ) {
        document.getElementById("frame").contentWindow.getToken = this.getToken;
        document.getElementById(
          "frame"
        ).contentWindow.closeVIew = this.closeVIew;
      }
    },
    getToken() {
      return localStorage.getItem("token");
    },
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    //发送POST请求跳转到指定页面
    httpPost(URL, PARAMS) {
      var temp = document.createElement("form");
      temp.action = URL;
      temp.method = "post";
      temp.style.display = "none";
      temp.target = "frame";

      for (var x in PARAMS) {
        var opt = document.createElement("textarea");
        opt.name = x;
        opt.value = PARAMS[x];
        temp.appendChild(opt);
      }

      document.getElementById("frame").appendChild(temp);
      // document.body.appendChild(temp);
      temp.submit();
      return temp;
    }
  }
};
</script>

<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <iframe
      id="frame"
      name="frame"
      :src="destUrl"
      style="position:absolute;height:100%;width:100%;left:0"
      frameborder="0"
    ></iframe>
  </div>
</template>
<script>
import { OpenEscrowAccount } from "@/api/account.js";
import { Toast } from "vant";
export default {
  computed: {
    destUrl() {
      return process.env.VUE_APP_H5SERVER + "/p2ph5/person/huifu/opendes.html";
    }
  },
  mounted() {
    document.getElementById("frame").contentWindow.getToken = this.getToken;
    document.getElementById(
      "frame"
    ).contentWindow.gotoOpenEscrowAccountURL = this.gotoOpenEscrowAccountURL;
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    getToken() {
      return localStorage.getItem("token");
    },
    gotoOpenEscrowAccountURL() {
      OpenEscrowAccount()
        .then(response => {
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              this.$router.replace({
                name: "huifuInput",
                query: {
                  PayUrl: response.Data.PayUrl + "?"+this.setQueryConfig(response.Data.PostData),
                  PostData: response.Data.PostData
                }
              });
            } else {
              Toast(response.ResultMsg);
            }
          }
        })
        .catch(response => {
          console.log(response);
        });
    },
    setQueryConfig(PostData) {
      var str = "";
      for (var data in PostData) {
        if (PostData[data] != -1) {
          str += data + "=" + PostData[data] + "&";
        }
      }
      var _str = str.substring(0, str.length - 1);
      return _str;
    }
  }
};
</script>

<template>
  <div class="main newBg5d9ce3">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <!--<header>体验标</header>-->
    <div class="banner paddingTop50">
      <img src="../../assets/account/banner4.png">
    </div>
    <div class="btn4" @click="gotoOpenEscrowAccountURL">我要开通托管账户</div>
    <div class="title4">
      在开通第三方托管账户后，托管机构还将为您开通自动投标及自动承接债权转让。
      <br>
      <br>＊自动投标及自动承接债权转让：用户购买理财产品后，其账户中相应的资金将被锁定，平台将自动把资金匹配相应债权。匹配成功后，该资金将被自动转给债权转让人，用户获得其转让的债权。用户可在我的投资——购买记录详情中查询最终匹配的债权信息
    </div>
    <div class="height60"></div>
  </div>
</template>
<script>
import { OpenEscrowAccount } from "@/api/account.js";
import { Toast } from "vant";
export default {
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
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
                  PayUrl: response.Data.PayUrl,
                  PostData: response.Data.PostData
                }
              });
            } else {
              Toast(response.ResultMsg);
            }
          }
        })
    }
  }
};
</script>

<style lang="less" scoped>
.main {
  max-width: 750px;
  min-width: 320px;
  margin: 0 auto;
  width: 100%;
}
.newBg5d9ce3 {
  background: #5d9ce3;
}
.banner {
  width: 100%;
}
.banner img {
  width: 100%;
}
.paddingTop50 {
  padding-top: 50px;
}
.btn4 {
  width: 80%;
  height: 70px;
  line-height: 70px;
  background: #f7775f;
  color: white;
  font-size: 20px;
  text-align: center;
  margin: 0 auto;
  margin-top: 50px;
  border-radius: 5px;
  font-family: "宋体";
  cursor: pointer;
}
.title4 {
  width: 90%;
  margin: 0px auto;
  margin-top: 50px;
  color: white;
  text-align: justify;
  font-size: 15px;
  line-height: initial;
}
.height60 {
  width: 100%;
  height: 60px;
}
</style>


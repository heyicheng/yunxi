<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <div class="body">
      <p class="p-title">{{title}}</p>
      <p class="p-time">{{time}}</p>
      <p v-html="text" style="white-space:pre-line" class="p-content"></p>
      <p v-if="url!= undefined &&url.length>1" class="p-detail" @click="gotodetail()">查看详情</p>
    </div>
  </div>
</template>
<script>
import CommonUtils from "@/utils/public.js";
export default {
  data() {
    return {
      title: this.$route.query.title,
      text: this.$route.query.text,
      id: this.$route.query.id,
      time: this.$route.query.time,
      url: this.$route.query.url
    };
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
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    gotodetail() {
      if (CommonUtils.isEmpty(this.url)) {
        return;
      }
      if (this.url.search("/Plan/PlanList")) {
        //理财首页
        this.$router.push("moneymanage");
      } else if (this.url.search("/MyAccount/MyAccountDetails")) {
        //个人账户页
        this.$router.push("myaccount");
      } else if (this.url.search("/Activity/Activity")) {
        //抽奖页面
        this.$router.push("drawprize");
      } else if (
        this.url.search("longjulicai.com") ||
        this.url.search("longjulc.com")
      ) {
        //首页
        this.$router.push("/");
      } else {
        this.$router.push({
          name: "activityDetail",
          query: {
            path: this.url,
            title: "活动详情"
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.body {
  margin: 15px;
  height: calc(100% - 60px);
  background: none;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.body::-webkit-scrollbar {
  width: 0px;
  display: none; /*隐藏滚轮*/
}
.page {
  background: white;
  position: fixed;
  width: 100%;
  height: 100%;
}
.p-title {
  font-size: 20px;
  color: rgba(51, 51, 51, 1);
  line-height: 30px;
  text-align: left;
  margin-top: 10px;
}
.p-time {
  font-size: 12px;
  color: rgba(153, 153, 153, 1);
  line-height: 30px;
  text-align: left;
  margin-top: 5px;
}
.p-content {
  font-size: 14px;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  text-align: left;
  margin-top: 20px;
  margin-bottom: 20px;
}
.p-detail {
  color: rgba(74, 144, 224, 1);
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  margin-top: 20px;
}
</style>


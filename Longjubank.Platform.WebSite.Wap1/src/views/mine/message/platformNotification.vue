<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <v-sys style="margin-top:10px" name="sys" :islogin="alreadyLogin()" :refresh="0"></v-sys>
  </div>
</template>
<script>
import sysNotification from "@/views/mine/message/sysNotification";
export default {
  components: {
     "v-sys": sysNotification,
  },
   methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    alreadyLogin() {
      var token = localStorage.getItem("token");
      return token != null && token != "undefined" && token.length > 0;
    },
  }
};
</script>
<style scoped>
.page {
  background: rgba(250, 250, 250, 1);
}
</style>



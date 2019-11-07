<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"  style="position:fixed"/>
    <van-cell-group v-if="issetpay">
      <van-cell title="设置授权密码" is-link :to="{name:'modifyAuthPassword',query:{type:0}}"></van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell title="修改授权密码" is-link :to="{name:'modifyAuthPassword',query:{type:1}}"></van-cell>
      <van-cell title="忘记授权密码" is-link :to="{name:'forgetAuthPassword'}"></van-cell>
    </van-cell-group>
  </div>
</template>
<script>
import { Cell, CellGroup, Toast } from "vant";
export default {
  components: {
    "van-cell-group": CellGroup,
    "van-cell": Cell
  },
  computed: {
    issetpay() {
      let issetpay = JSON.parse(localStorage.getItem("account")).issetpay;
      // 是否设置了授权密码,0未设置，1已设置
      return issetpay == 1 ? false : true;
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    }
  }
};
</script>
<style scoped>
.page {
  height: 100%;
  width: 100%;
  position: absolute;
  background: rgba(250, 250, 250, 1);
}
.van-cell-group {
  margin-top: 10px;
}
.van-cell__title {
  text-align: left;
}
</style>



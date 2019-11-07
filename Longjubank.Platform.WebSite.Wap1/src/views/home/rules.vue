<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK()"></van-nav-bar>

    <img :src="src" alt class="rules">
  </div>
</template>

<script>
export default {
  data() {
    return {
      src:`${process.env.VUE_APP_H5SERVER}/p2ph5/images/lottery_rule.png`
    };
  }
};
</script>
<style lang="scss" scoped>
.rules{
  width: 100%;
}
  
</style>

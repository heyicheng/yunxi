<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"></van-nav-bar>
  </div>
</template>
<script>
import { GETBALANCE, SUBMITORDER } from "@/api/moneyManage";

export default {
  name: "noviceExclusive",
  components: {
    // "van-swipe": Swipe,
    // "van-swipe-item": SwipeItem
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  },
  mounted(){
    SUBMITORDER({

      
    }).then(res=>{
      alert('11')
    }).catch(res=>{
      alert('232')
    })
  }
};
</script>
<style lang="scss" scoped>
.swiper{
  height: 100px ;
}
</style>

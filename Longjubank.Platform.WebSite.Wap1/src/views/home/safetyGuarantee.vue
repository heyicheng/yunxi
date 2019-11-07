<template>
  <div>
    <van-nav-bar :title="$route.meta.title" left-arrow   @click-left="goBack"></van-nav-bar>
  </div>
</template>

<script>
export default {
  methods:{
    goBack(){
      this.$router.go(-1)
    }
  }
}
</script>

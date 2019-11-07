<template>
  <div class="div-service" v-show="isOriginHei">
    <img
      style="width:12px;height:12px;margin-bottom:-1px"
      src="../../assets/login/foot_ic_customer.png"
    >
    <a :href="'tel:'+tel" style="font-size:12px;margin-left:7px;color:rgba(51,61,83,1)">{{tel}}</a>
  </div>
</template>
<script>
import { Toast } from "vant";
export default {
  data() {
    return {
      tel: "4000-119-888",
      isOriginHei: true,
      screenHeight: document.documentElement.clientHeight,
      originHeight: document.documentElement.clientHeight
    };
  },
  mounted() {
    let self = this;
    window.onresize = function() {
      if(self.originHeight <= document.documentElement.clientHeight){
        self.originHeight = document.documentElement.clientHeight;
      }
      return (self.screenHeight = document.documentElement.clientHeight);
    };
    // Toast(self.originHeight+'   '+ self.screenHeight);
  },
  watch: {
    screenHeight(val) {
      if (this.originHeight > val) {
        //加100为了兼容华为的返回键
        this.isOriginHei = false;
      } else {
        this.isOriginHei = true;
      }
      // Toast(this.originHeight+'   '+ val);
    }
  }
};
</script>

<style scoped>
.div-service {
  position: absolute;
  left: 0px;
  bottom: 40px;
  width: 100%;
  height: 50px;
}
</style>

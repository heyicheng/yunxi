
<template>
  <div>
    <div  class="toast">{{message}}</div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      required: true
    },
    duration: {
      type: Number,
      default: 3
    }
  },
  mounted(){
    setTimeout(() => {
      this.$emit('closeToast')
    }, this.duration*1000);
  },

};
</script>
<style lang="scss" scoped>
.toast {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba($color: #000000, $alpha: 0.4);
  text-align: center;
  color: white;
}
@media screen and (max-width: 800px) {
  .toast {
    padding: 0 0.4rem;
    line-height: 0.6rem;
    font-size: 0.35rem;
    border-radius: 0.04rem;
  }
}
@media screen and (min-width: 800px) {
  .toast {
    padding: 0 40px;
    line-height: 50px;
    font-size: 28px;
    border-radius: 4px;
  }
}
</style>
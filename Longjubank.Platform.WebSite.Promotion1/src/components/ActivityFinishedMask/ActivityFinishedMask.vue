<template>
  <div class="mask" @scroll.stop @touchmove.stop.prevent @mousewheel.stop.prevent v-if="showMask">
    <div class="maskcontain">
      <img class="closemask" src="./assets/close-icon.png" alt @click="closeActivityOverMask">
      <img class="maskcontent" :src="imgSrc" alt>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imgSrc: {
      type: String
    },
    showMask: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeActivityOverMask(e) {
      this.$emit("closeClick", e);
    }
  },
  watch:{
    showMask(newVal) {
      if (newVal) {
        document.getElementsByTagName('html')[0].style.setProperty('position', 'relative');
        document.getElementsByTagName('html')[0].style.setProperty('width', '100%');
        document.getElementsByTagName('html')[0].style.setProperty('height', '100%');

        document.getElementsByTagName('body')[0].style.setProperty('position', 'fixed');
        document.getElementsByTagName('body')[0].style.setProperty('width', '100%');
        document.getElementsByTagName('body')[0].style.setProperty('height', '100%');
        document.getElementsByTagName('body')[0].style.setProperty('top', '0');
        document.getElementsByTagName('body')[0].style.setProperty('left', '0');
      } else {
        document.getElementsByTagName('html')[0].style.removeProperty('position');
        document.getElementsByTagName('html')[0].style.removeProperty('width');
        document.getElementsByTagName('html')[0].style.removeProperty('height');

        document.getElementsByTagName('body')[0].style.removeProperty('position');
        document.getElementsByTagName('body')[0].style.removeProperty('width');
        document.getElementsByTagName('body')[0].style.removeProperty('height');
        document.getElementsByTagName('body')[0].style.removeProperty('top');
        document.getElementsByTagName('body')[0].style.removeProperty('left');
      }
    }
  }
};
</script>

<style scoped>
.mask .maskcontain .maskcontent {
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 800px) {
  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(27, 25, 25, 0.4);
  }
  .mask .maskcontain {
     position: absolute;
     left: 50%; top: 50%;
    transform: translate(-50%, -50%);    /* 50%为自身尺寸的一半 */
    width: 440px;
    height: 440px;
  }
  .mask .maskcontain .closemask {
    width: 44px;
    height: 64px;
    position: absolute;
    right: 0;
    top: -64px;
  }
}
@media screen and (max-width: 800px) {
  .mask {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.4);
  }
  .mask .maskcontain {
    position: relative;
    margin: auto;
    width: 4.4rem;
    height: 4.4rem;
  }
  .mask .maskcontain .closemask {
    width: 0.44rem;
    height: 0.64rem;
    position: absolute;
    right: 0;
    top: -0.64rem;
  }
}
</style>

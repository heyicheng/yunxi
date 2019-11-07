<template>
  <div class="mask" @scroll.stop @touchmove.stop.prevent @mousewheel.stop.prevent v-if="showMask">
    <div class="maskcontain">
      <div class="div_border">
        <b>您本次选择奖励：</b>
        <div class="div-content">
          <div class="div-item">
            <div v-if="num[0]>0">
              188元高温津贴
              <p>x{{num[0]}}</p>
            </div>
            <div v-if="num[1]>0">
              788元高温津贴
              <p>x{{num[1]}}</p>
            </div>
            <div v-if="num[2]>0">
              1788元高温津贴
              <p>x{{num[2]}}</p>
            </div>
            <div v-if="num[3]>0">
              3288元高温津贴
              <p>x{{num[3]}}</p>
            </div>
          </div>
        </div>
        <button @click="closeActivityOverMask">我再想想</button>
        <button @click="chooseSure">确认选择</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Array
    },
    showMask: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    closeActivityOverMask(e) {
      this.$emit("closeClick", e);
    },
    chooseSure() {
      this.$emit("sureClick");
    }
  }
};
</script>

<style scoped lang="scss">
.mask .maskcontain .maskcontent {
  width: 100%;
  height: 100%;
}

@media screen and (min-width: 800px) {
  .mask {
    position: fixed;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(27, 25, 25, 0.4);
  }
  .mask .maskcontain {
    position: relative;
    margin: auto;
    width: 538px;
    height: 467px;
    background: white;
    border-radius: 12px;
  }
  .div_border {
    position: relative;
    width: 512px;
    height: 441px;
    top: 10px;
    left: 10px;
    border: 1px dashed #66c7e6;
    border-radius: 12px;
  }
  button {
    width: 186px;
    height: 64px;
    background: #66c7e6;
    border-radius: 4px;
    border: none;
    color: white;
    text-align: center;
    font-size: 28px;
    margin-left: 34px;
    margin-right: 34px;
    margin-top: 40px;
  }
  .div-content {
    position: relative;
    margin: auto;
    width: 298px;
    height: 176px;
    text-align: center;
    margin-top: 60px;
    display: table;
  }
  .div-item {
    display: table-cell;
    vertical-align: middle;
    div {
      display: flex;
      font-size: 28px;
      color: #6e8ed2;
      line-height: 50px;
      p {
        flex: 1;
        text-align: right;
      }
    }
  }
  b {
    font-size: 28px;
    color: #6e8ed2;
    position: relative;
    top: 40px;
    left: 33px;
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
    width: 5.38rem;
    height: 4.66rem;
    background: white;
    border-radius: 0.12rem;
  }
  .div_border {
    position: relative;
    width: 5.12rem;
    height: 4.4rem;
    top: 0.1rem;
    left: 0.1rem;
    border: 1px dashed #66c7e6;
    border-radius: 0.12rem;
  }
  button {
    width: 1.86rem;
    height: 0.64rem;
    background: #66c7e6;
    border-radius: 0.04rem;
    border: none;
    color: white;
    text-align: center;
    font-size: 0.28rem;
    margin-left: 0.34rem;
    margin-right: 0.34rem;
    margin-top: 0.4rem;
  }
  .div-content {
    position: relative;
    margin: auto;
    width: 2.98rem;
    height: 1.76rem;
    text-align: center;
    margin-top: 0.6rem;
    display: table;
  }
  .div-item {
    display: table-cell;
    vertical-align: middle;
    div {
      display: flex;
      font-size: 0.28rem;
      color: #6e8ed2;
      line-height: 0.5rem;
      p {
        flex: 1;
        text-align: right;
      }
    }
  }
  b {
    font-size: 0.28rem;
    color: #6e8ed2;
    position: relative;
    top: 0.4rem;
    left: 0.33rem;
  }
}
</style>

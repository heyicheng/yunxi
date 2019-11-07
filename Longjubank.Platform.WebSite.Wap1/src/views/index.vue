<template>
  <div>
    <router-view/>
    <div id="footer" class="flex-row-around">
      <div class="tab-unit" @click="choiceTab('home')">
        <div class="foot-icon">
          <img v-if="routerName=='home'" src="@/assets/tab/tab_home_selected.png" alt>
          <img v-else src="@/assets/tab/tab_home_normal.png" alt>
        </div>
        <div class="tab_text" :class="{active:routerName=='home'}">首页</div>
      </div>
      <div class="tab-unit" @click="choiceTab('moneyManage')">
        <div class="foot-icon">
          <img v-if="routerName=='moneyManage'||routerName=='objectList'" src="@/assets/tab/-e-tab_financial_selected.png" alt>
          <img v-else src="@/assets/tab/-e-tab_financial_normal.png" alt>
        </div>
        <div class="tab_text" :class="{active:routerName=='moneyManage'||routerName=='objectList'}">理财</div>
      </div>
      <div class="tab-unit" @click="choiceTab('discover')">
        <div class="foot-icon">
          <img v-if="routerName=='discover'" src="@/assets/tab/-e-tab_find_selected.png" alt>
          <img v-else src="@/assets/tab/-e-tab_find_normal.png" alt>
        </div>
        <div class="tab_text" :class="{active:routerName=='discover'}">发现</div>
      </div>
      <div class="tab-unit" @click="choiceTab('myAccount')">
        <div class="foot-icon">
          <img v-if="routerName=='myAccount'" src="@/assets/tab/-e-tab_account_selected.png" alt>
          <img v-else src="@/assets/tab/-e-tab_account_normal.png" alt>
        </div>
        <div class="tab_text" :class="{active:routerName=='myAccount'}">账户</div>
      </div>
    </div>
    <div style="height:60px;background:rgba(250, 250, 250, 1) "></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerName: 'home',//这里是否根据路由来判断  还有待考察，因为可能有些页面，不属于这个4个页面但也需要点亮
    };
  },
  methods: {
    choiceTab( route) {
      this.routerName = route;
      this.$router.push({
        name: route
      });
    }
  },
  created(){
    this.routerName=this.$route.name
    console.log(this.$route.name)
  },
  watch:{
    $route(val,lodval){
      this.routerName=val.name
    }
  }
};
</script>
<style lang="scss" scoped>
#footer {
  width: 100%;
  bottom: 0;
  position: fixed;
  height: 49px;
  background: white;
  z-index: 10
}
.tab-unit {
  width: 70px;
}
.tab_text {
  // position: absolute;
  font-size: 10px;
  line-height: 12px;
  margin-top: 8px;
  color: rgb(137, 147, 158);
}
.active {
  color: rgba(74, 144, 226, 1);
}
.tab-unti {
  // position: relative;
}
img {
  width: 100%;
  height: 100%;
}
.foot-icon {
  // position: absolute;
  width: 19px;
  height: 19px;
  // vertical-align: baseline;
  display: flex;
  margin: 0 auto;
}
</style>

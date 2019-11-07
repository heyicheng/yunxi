<template>
  <div id="app">
    <div ref="digui">aosdjf</div>
    <!-- <router-view v-if="routershow"/> -->
  </div>
</template>
<script>
import AppEventHandler from "@/utils/AppEventHandler.js";
export default {
  name: "app",
  data() {
    return {
      choiced: 0,
      routershow: true,
      list: {
        name: "总数据",
        children: [
          {
            name: "数据1",
            children: [
              {
                name: "数据11",
                children: [
                  {
                    name: "数据111"
                  },
                  {
                    name: "数据112"
                  }
                ]
              },
              {
                name: "数据12",
                children: [
                  {
                    name: "数据121"
                  },
                  {
                    name: "数据122"
                  }
                ]
              },
              {
                name: "数据13",
                children: [
                  {
                    name: "数据131"
                  },
                  {
                    name: "数据132"
                  }
                ]
              },
              {
                name: "数据14"
              }
            ]
          }
        ]
      }
    };
  },
  provide() {
    return {
      reload: this.reload
    };
  },
  methods: {
    reload() {
      this.routershow = false;
      this.$nextTick(function() {
        this.routershow = true;
      });
    },
    choiceTab(val, route) {
      this.choiced = val;
      this.$router.push({
        name: route
      });
    }
  },
  components: {},
  created() {
    var data = [
      {
        title: "11111",
        childs: [
          { title: "aaaaa", childs: [{ title: "xg" }] },
          { title: "bbbbb" }
        ]
      },
      { title: "22222", childs: [{ title: "aaaaa" }, { title: "bbbbb" }] }
    ];
    function menu(data) {
      var ul = "<ul>";
      for (var i = 0; i < data.length; i++) {
        ul += "<li><a>" + data[i].title + "</a>";
        if (data[i].childs) {
          ul += menu(data[i].childs);
        } 
        ul += "</li>";
      }
      ul += "</ul>";
      return ul;
    }
    setTimeout(() => {
      this.$refs.digui.innerHTML += menu(data);
    }, 100);
    // document.write(menu(data))
    // console.log(menu(data))
  },
  mounted() {
    AppEventHandler.addDefaultEventListener(
      AppEventHandler.token_expired_event_name,
      event => {
        this.$router.push("/login");
      }
    );
  },
  destroyed() {
    AppEventHandler.removeDefaultEventListener(
      AppEventHandler.token_expired_event_name
    );
  }
};
</script>
<style lang="scss" scoped>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: white;
}
</style>

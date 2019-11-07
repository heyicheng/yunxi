import './styles/common.scss'
import './styles/user-defined.scss'
import Vue from 'vue'
import App from './App.vue'
import Global from  './utils/public'
import './utils/rem'
import router from './router/index.js'
import store from './store/index.js'
import './utils/plugins/vant'

// import './mock/index'

import './styles/coverUi.scss'
Vue.config.productionTip = false
Vue.prototype.GOBACK=function(){

    this.$router.go(-1)
}
Vue.prototype.Global=Global
export const vueInstance = new Vue({
  router,
  store,
  render: h => h(App)
})

vueInstance.$mount('#app')

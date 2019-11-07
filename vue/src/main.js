// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'


axios.create({
  baseURL: '"/api/"',
  timeout: 2000, // request timeout

});
axios({
  method:'post',
  // url:'https://app.feelmao.com/app/community/getBaseData',
  url:'/api',
  data:{
    // isadf:'fadff'
  }
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

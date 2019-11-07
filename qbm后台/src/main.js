import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import iView from 'iview';
import './css/common.scss';
import * as Util from './util/util';
import url from './util/url';
import VueQuillEditor from 'vue-quill-editor';
import $http from './util/http';
// require styles
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

Vue.config.productionTip = false;
Vue.prototype.$util = Util;
Vue.prototype.$url = url;
Vue.prototype.$http = $http;
Vue.use(iView);
Vue.use(VueQuillEditor);
// Vue.filter('currency', Util.currency);
/* eslint-disable no-new */
const app = new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});

/**
 *
 * 　　　　　　　   ┏┓　　　┏┓
 * 　　　　　　　┏┛┻━━━┛┻━┓
 * 　　　　　　　┃　　　　　　   ┃
 * 　　　　　　　┃　　　━　　   ┃
 * 　　　　　　　┃　┳┛　┗┳　 ┃
 * 　　　　　　　┃　　　　　　   ┃
 * 　　　　　　　┃　　┻　　  　 ┃
 * 　　　　　　　┃　　　　　　   ┃
 * 　　　　　　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
 * 　　　　　　　　　┃　　　┃    神兽保佑,代码无bug
 * 　　　　　　　　　┃　　　┃
 * 　　　　　　　　　┃　　　┗━━━┓
 * 　　　　　　　　　┃　　　　　   ┣┓
 * 　　　　　　　   ┃　　　　 	   ┏┛
 * 　　　　　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　　　　　┃┫┫　 ┃┫┫
 * 　　　　　　　　  ┗┻┛　 ┗┻┛
 *
 */

/**
 * 　　　　　　　    ┏┓　　　┏┓
 * 　　　　　　　 ┏┛┻━━━┛┻━┓
 * 　　　　　　　 ┃　　　　　　   ┃ 　
 * 　　　　　　　 ┃　　　━　　　 ┃
 * 　　　　　　　 ┃　＞　　　＜   ┃
 * 　　　　　　　 ┃　　　　　　   ┃
 * 　　　　　　　 ┃...　⌒　...   ┃
 * 　　　　　　　 ┃　　　　　　   ┃
 * 　　　　　　　 ┗━┓　　　┏━┛
 * 　　　　　　　　　┃　　　┃　Code is far away from bug with the animal protecting　　　　　　　　　　
 * 　　　　　　　　　┃　　　┃   神兽保佑,代码无bug
 * 　　　　　　　　　┃　　　┃　　　　　　　　　　　
 * 　　　　　　　　　┃　　　┃  　　　　　　
 * 　　　　　　　　　┃　　　┃
 * 　　　　　　　　　┃　　　┃　　　　　　　　　　　
 * 　　　　　　　　　┃　　　┗━━━━┓
 * 　　　　　　　　　┃　　　　　　    ┣┓
 * 　　　　　　　　　┃　　　　　　   ┏┛
 * 　　　　　　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　　　　　 ┃┫┫  ┃┫┫
 * 　　　　　　　　　 ┗┻┛  ┗┻┛
 */
/**
 *　　　　　　　   ┏┓　　┏┓+ +
 *　　　　　　　┏┛┻━━┛┻━┓ + +
 *　　　　　　　┃　　　　　　  ┃ 　
 *　　　　　　　┃　　　━　　　┃ ++ + + +
 *　　　　　　  ┃	████━████  ┃+
 *　　　　　　　┃　　　　　　　┃ +
 *　　　　　　　┃　　　┻　　　┃
 *　　　　　　　┃　　　　　　  ┃ + +
 *　　　　　　　┗━┓　　　┏━┛
 *　　　　　　　　　┃　　　┃　　　　　　　　　　　
 *　　　　　　　　　┃　　　┃ + + + +
 *　　　　　　　　　┃　　　┃　　　　Code is far away from bug with the animal protecting　　　　　　　
 *　　　　　　　　　┃　　　┃ + 　　　　神兽保佑,代码无bug　　
 *　　　　　　　　　┃　　　┃
 *　　　　　　　　　┃　　　┃　　+　　　　　　　　　
 *　　　　　　　　　┃　 　　┗━━━┓ + +
 *　　　　　　　　　┃ 　　　　　　  ┣┓
 *　　　　　　　　　┃ 　　　　　　  ┏┛
 *　　　　　　　　　┗┓┓┏━┳┓┏┛ + + + +
 *　　　　　　　　　　┃┫┫　┃┫┫
 *　　　　　　　　　  ┗┻┛　┗┻┛+ + + +
 */

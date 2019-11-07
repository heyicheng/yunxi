import Vue from 'vue';
import Vuex from 'vuex';
import Home from './Home';
import SelectOptions from './SelectOptions';
import createLogger from '@plugins/logger';
import upload from './upload/reset';
// Vue.use(Vuex); 

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
	// actions,
	// getters,
	modules: {
		SelectOptions,
		Home,
		upload
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
});

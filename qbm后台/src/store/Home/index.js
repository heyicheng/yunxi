import * as types from './types';
import { setItem, getItem } from '@util/util';
import url from '@util/url';
import axios from '@util/http';

const state = {
	openName: '',
	activeName: '',
	menuList: {}
};

// getters
const getters = {
	names: state => {
		let activeName = state.activeName;
		if (activeName == 'index') {
			activeName = state.openName + 'Index';
		}
		return {
			openName: state.openName,
			activeName: activeName,
		};
	}
};

// actions
const actions = {
	getCurrentName({ commit, state }, name){
		commit(types.GET_ACTIVENAME, {
			name: name
		});
	},
	getNames({ commit, state },path) {
		commit(types.GET_NAMES, {
			path: path
		});
	},
	setMenuList({commit, state}, name) {
		setItem('currentMenu', name);
		if (JSON.stringify(state.menuList) == "{}") {
			let data = require('@util/menu/' + name);
			// axios.get(`/${name}`).then((res) => {
				setItem('menuList', data);
				commit(types.SET_MENULIST, {
					name: name,
					currentMenuList: data
				});
			// }).catch((err) => {

			// });
		}else{
			if (state.menuList.hasOwnProperty(name)) {
				setItem('menuList', state.menuList[name]);
			} else {
				let data = require('@util/menu/' + name);				
				// axios.get(`/${name}`).then((res) => {
					setItem('menuList', data);
					commit(types.SET_MENULIST, {
						name: name,
						currentMenuList: data
					});
				// }).catch((err) => {

				// });
			}
		}
		
	}
};

// mutations
const mutations = {
	[types.GET_NAMES](state, {
		path
	}) {
		let openName = '';
		let activeName = '';
		openName = path.split('/')[1];
		activeName = path.split('/')[2];

		state.openName = openName;
		state.activeName = activeName;
	},
	[types.GET_ACTIVENAME](state, {name}){
		state.activeName = name;
	},
	[types.SET_MENULIST](state, { name, currentMenuList}){
		console.log(name, currentMenuList);
		state.menuList = {
			...state.menuList,
			[name]: currentMenuList
		};
	}
};

export default {
	state,
	getters,
	actions,
	mutations
};

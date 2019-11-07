import * as types from './types';
import axios from '@util/http';

const state = {
	categoryList: [],
	channelList: [],
	orderStatusList: [],
	borrowStatus: [],
	onShelfStatus: [],
	linkAgeList: []
};

// getters
const getters = {
	categoryList: state => state.categoryList,
	channelList: state => state.channelList,
	orderStatusList: state => state.orderStatusList,
	borrowStatus: state => state.borrowStatus,
	onShelfStatus: state => state.onShelfStatus,
	linkAgeList: state => state.linkAgeList
};

// actions
const actions = {
	getSelectOptions({commit, state}) {
		axios.get(`/goods/queryChannelAndSortList.html`).then((res) => {
			commit(types.GETSELECTOPTIONS, {
				allList: res
			});
		}).catch((err) => {

		});
	},
	getLinkAgeList({commit, state}){
		axios.get(`regSetting/LinkAgeList.html`).then((res) => {
			commit(types.GETLINKAGELIST, {
				list: res.dataList
			});
		}).catch((err) => {

		});
	}
};

// mutations
const mutations = {
	[types.GETSELECTOPTIONS](state, {
		allList
	}) {
		state.categoryList= [...allList.varietiesList];
		state.channelList= [...allList.channelList];
		state.orderStatusList= [...allList.orderStatusList];
		state.borrowStatus= [...allList.borrowStatus];
		state.onShelfStatus= [...allList.onShelfStatus];
	},
	[types.GETLINKAGELIST](state, {
		list
	}) {
		state.linkAgeList = [...list];
	},
};

export default {
	state,
	getters,
	actions,
	mutations
};

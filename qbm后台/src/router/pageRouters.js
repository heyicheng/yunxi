import Home from '@pages/Home';

//功能
import jiaRiBaoManage from '@pages/functional/jiaRiBaoManage';
import regPageConfig from '@pages/functional/regPageConfig/list';

import bidDetails from '@pages/functional/financialManage/bidDetails';
import commissions from '@pages/functional/financialManage/commissions';

import columnManage from '@pages/functional/articleManage/columnManage';
import articleList from '@pages/functional/articleManage/articleList';

//系统管理
import adminManage from '@pages/system/authorization/adminList';
import roleManage from '@pages/system/authorization/roleList';

import operationLog from '@pages/system/systemMaintenance/operationLog';
import systemConfig from '@pages/system/systemMaintenance/systemConfig';

//乐享生活圈
import unSoldList from '@pages/finLife/goodsManage/unSoldList';
import onSoldList from '@pages/finLife/goodsManage/onSoldList';
import goodsCategory from '@pages/finLife/goodsManage/category';
import goodsChannelList from '@pages/finLife/goodsManage/channelList';

import tagManage from '@pages/finLife/marketingManage/tagManage/list';
import dailySpecials from '@pages/finLife/marketingManage/dailySpecials/list';

import activityManageIndex from '@pages/finLife/activityManage';

import orderManageIndex from '@pages/finLife/orderManage';
import Upload from '../components/common/uploadPic/eg';

// import transactionAnalysis from '@pages/finLife/transactionAnalysis';

// import financialManage from '@pages/functional/financialManage';


import Cart from '@pages/Cart';

const pageRouters = [
	{path:'/upload',name:'upload',component:Upload},
	//功能
	{
		path: '/promotionManagement',
		name: 'promotionManagement',
		title: '推广管理',
		component: Home,
		children: [
			{
				path: 'jiaRiBaoManage',
				name: 'jiaRiBaoManage',
				meta: {
					title: '假日宝活动管理'
				},
				component: jiaRiBaoManage
			},
			{
				path: 'regPageConfig',
				icon: 'arrow-move',
				name: 'regPageConfig',
				meta: {
					title: '落地页配置'
				},
				component: regPageConfig
			}
		]
	},{
		path: '/financialManage',
		name: 'financialManage',
		title: '财务管理',
		component: Home,
		children: [
			{
				path: 'bidDetails',
				name: 'bidDetails',
				meta: {
					title: '购标明细'
				},
				component: bidDetails
			},
			{
				path: 'commissions',
				name: 'commissions',
				meta: {
					title: '佣金管理'
				},
				component: commissions
			}
		]
	},{
		path: '/articleManage',
		name: 'articleManage',
		title: '文章管理',
		component: Home,
		children: [
			{
				path: 'columnManage',
				name: 'columnManage',
				meta: {
					title: '栏目管理'
				},
				component: columnManage
			},
			{
				path: 'articleList',
				name: 'articleList',
				meta: {
					title: '文章列表'
				},
				component: articleList
			}
		]
	},

	//系统管理
	{
		path: '/authorization',
		name: 'authorization',
		title: '权限管理',
		component: Home,
		children: [
			{
				path: 'adminManage',
				name: 'adminManage',
				meta: {
					title: '管理员管理'
				},
				component: adminManage
			},
			{
				path: 'roleManage',
				icon: 'arrow-move',
				name: 'roleManage',
				meta: {
					title: '角色管理'
				},
				component: roleManage
			}
		]
	},{
		path: '/systemMaintenance',
		name: 'systemMaintenance',
		title: '系统维护',
		component: Home,
		children: [
			{
				path: 'operationLog',
				name: 'operationLog',
				meta: {
					title: '操作日志'
				},
				component: operationLog
			},
			{
				path: 'systemConfig',
				icon: 'arrow-move',
				name: 'systemConfig',
				meta: {
					title: '系统配置'
				},
				component: systemConfig
			}
		]
	},

	//乐享生活圈
	{
		path: '/goodsManage',
		name: 'goodsManage',
		title: '商品管理',
		component: Home,
		children: [
			{
				path: 'unSoldList',
				name: 'unSoldList',
				meta: {
					title: '未上架商品'
				},
				component: unSoldList
			},
			{
				path: 'onSoldList',
				icon: 'arrow-move',
				name: 'onSoldList',
				meta: {
					title: '已上架商品'
				},
				component: onSoldList
			},
			{
				path: 'goodsCategory',
				icon: 'arrow-move',
				name: 'goodsCategory',
				meta: {
					title: '商品分类'
				},
				component: goodsCategory
			},
			{
				path: 'goodsChannelList',
				icon: 'arrow-move',
				name: 'goodsChannelList',
				meta: {
					title: '渠道管理'
				},
				component: goodsChannelList
			}
		]
	},{
		path: '/marketingManage',
		name: 'marketingManage',
		title: '商品管理',
		component: Home,
		children: [
			{
				path: 'tagManage',
				name: 'tagManage',
				meta: {
					title: '栏目标签管理'
				},
				component: tagManage
			},
			{
				path: 'dailySpecials',
				name: 'dailySpecials',
				meta: {
					title: '限时特卖'
				},
				component: dailySpecials
			}
		]
	},{
		path: '/activityManage',
		name: 'activityManage',
		title: '活动管理',
		component: Home,
		children: [
			{
				path: 'index',
				name: 'activityManageIndex',
				meta: {
					title: '活动管理'
				},
				component: activityManageIndex
			}
		]
	},{
		path: '/orderManage',
		name: 'orderManage',
		title: '订单管理',
		component: Home,
		children: [
			{
				path: 'index',
				name: 'orderManageIndex',
				meta: {
					title: '活动管理'
				},
				component: orderManageIndex
			}
		]
	}

	// {
	// 	path: '/cart',
	// 	icon: 'android-sad',
	// 	name: 'cart',
	// 	title: '购物车',
	// 	component: Home,
	// 	children: [
	// 		{
	// 			path: 'index',
	// 			icon: 'pound',
	// 			name: 'index',
	// 			meta: {
	// 				title: '购物车'
	// 			},
	// 			component: Cart
	// 		}
	// 	]
	// },
	// {
	// 	path: '/error-page',
	// 	icon: 'android-sad',
	// 	title: '错误页面',
	// 	name: 'errorpage',
	// 	component: Home,
	// 	children: [
	// 		{ path: 'index', title: '错误页面', name: 'errorpage_index', component: resolve => { require(['@/views/error-page/error-page.vue'], resolve); } }
	// 	]
	// }
];


export default pageRouters;

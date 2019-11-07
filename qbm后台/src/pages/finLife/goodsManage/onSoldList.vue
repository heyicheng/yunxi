<template>
	<div>
		<TablePage
		:columns="columns"
		:tableData="tableData"
		:page="page"
		:pageSize="pageSize"
		@pageChange="handleCurrentChange"
		>
			<Row type="flex" justify="space-between" slot="header" style="height: 30px;">
				<Col span="12">
					<Button type="primary" icon="android-search" @click="toggleSearch">搜索</Button>
					<Button type="primary" icon="android-sync" :loading="refresh"  @click="toRefresh">
						<span v-if="!refresh">刷新</span>
						<span v-else>加载中...</span>
					</Button>
				</Col>
			</Row>
		</TablePage>

		<search-bar
		:searchShow="searchShow"
		:formItem.sync="searchFormItem"
		@toggleSearch="toggleSearch"
		@searchSubmit="handleSubmit"
		>
			<FormItem label="商品名称">
				<Input type="text" placeholder="" v-model="searchFormItem.searchName" class="w300"></Input>
			</FormItem>
			<FormItem label="市场价">
				<Input type="text" placeholder="￥" v-model="searchFormItem.priceMin" class="w100"></Input>
				-
				<Input type="text" placeholder="￥" v-model="searchFormItem.priceMax" class="w100"></Input>
			</FormItem>
			<FormItem label="总销量">
				<Input type="text" placeholder="" v-model="searchFormItem.salesMin" class="w100"></Input>
				-
				<Input type="text" placeholder="" v-model="searchFormItem.salesMax" class="w100"></Input>
			</FormItem>
			<FormItem label="渠道来源">
				<Select v-model="searchFormItem.channelId" clearable class="w300">
					<Option v-for="item in channelIdList" :value="item.id" :key="item.id">{{ item.channelName }}</Option>
				</Select>
			</FormItem>

			<CategorySelect
			:levelOne.sync="searchFormItem.level_one"
			:levelTwo.sync="searchFormItem.level_two"
			:levelThree.sync="searchFormItem.level_three"
			></CategorySelect>
		</search-bar>


		<goodsForm
			:isShow.sync="goodsFormShow"
			:goodsId.sync="goodsId"
			:pageType.sync="pageType"
			@refresh="toRefresh"

		></goodsForm>

		<!--门槛查看-->
		<thresholdSetting
			:isShow.sync="thresholdSettingPop"
			:goodsId.sync="goodsId"
			:pageType.sync="pageType"
			:shoppingPrice="curMarketPrice"
			></thresholdSetting>
		<!--商品规格-->
		<specificationList
			:isShow.sync="specificationListPop"
			:goodsId.sync="goodsId"
			:pageType.sync="pageType"
			></specificationList>

	</div>
</template>


<script>
import CategorySelect from '@components/common/CategorySelect';
import TablePage from '@components/common/TablePage';
import searchBar from '@components/common/SearchBar';
import goodsForm from './components/goodsForm';
import thresholdSetting from './components/thresholdSetting';
import specificationList from './components/specificationList';

import { mapGetters } from "vuex";
import * as $util from '@util/util';

let Component = {
	name: 'onSoldList',
	components: {
		CategorySelect,
		TablePage,
		searchBar,
		goodsForm,
		thresholdSetting,
		specificationList,
	},
	data () {
		return {
			searchShow: false, //搜索块是否显示
			goodsFormShow: false,
			thresholdSettingPop: false,
			specificationListPop: false,
			refresh: false,
			searchFormItem: {
				searchName: '',
				priceMin: '',
				priceMax: '',
				salesMin: '',
				salesMax: '',
				channelId: '',
				level_one: '',
				level_two: '',
				level_three: '',
			},
			page: {},
			pageSize: 10,
			goodsId: 0,
			pageType: 'view',
			columns: [
				{
					title: '序号',
					width: 80,
					align: 'center',
					key: 'id',
					fixed: 'left',
				},
				{
					title: '名称',
					width: 200,
					key: 'goodsName',
					ellipsis: true,
				},
				{
					title: '市场价(元)',
					width: 100,
					key: 'marketPrice',
				},
				{
					title: '渠道来源',
					width: 100,
					key: 'channelName',
				},
				{
					title: '品类',
					width: 200,
					key: 'varietiesName',
				},{
					title: '总库存',
					align: 'center',
					width: 100,
					key: 'sumStocks'
				},{
					title: '当前库存',
					align: 'center',
					width: 90,
					key: 'remainStock'
				},{
					title: '总销量',
					align: 'center',
					width: 80,
					key: 'sumSales'
				},{
					title: '上架时间',
					render: (h, params) =>{
						if(params.row.addTime){
							return h('span', {}, $util.formatTimestamp(params.row.onShelfTime));
						}else{
							return '';
						}
					},
					width: 150,
				},{
					title:'类目内推荐',
					width: 100,
					render: (h,params) => {
						return h('span',{},[
							h('i-switch',{
								props: {
									'true-value': 1,
									'false-value': 0,
									value: params.row.isRecommend
								},
								on: {
									'on-change': (status)=>{
										this.changeSwicthStatus(params.row.id,status,1);
									}
								}
							}, [
								h('span', {
									slot: 'open'
								}, '开'),
								h('span', {
									slot: 'close'
								}, '关')
							])
						]);
					}
				},{
					title:'人气优选',
					width: 100,
					render: (h,params) => {
						return h('span',{},[
							h('i-switch',{
								props: {
									'true-value': 1,
									'false-value': 0,
									value: params.row.popularity
								},
								on: {
									'on-change': (status)=>{
										this.changeSwicthStatus(params.row.id,status,2);
									}
								}
							}, [
								h('span', {
									slot: 'open'
								}, '开'),
								h('span', {
									slot: 'close'
								}, '关')
							])
						]);
					}
				},{
					title:'状态',
					align: 'center',
					render: (h, params) => {
						let statusVal = params.row.status;
						if (statusVal == '1'){
							return h('span', {style:{color:'#19be6b'}}, '在售');
						}else if (statusVal == '2'){
							return h('span', {style:{color:'#ed3f14'}}, '售罄');
						}
					},
					width: 90,
				},{
					title:'商品门槛',
					align: 'center',
					width: 90,
					fixed: 'right',
					render: (h, params) =>{
						return h('Button',{
							props: {
								type: 'success',
								size: 'small'
							},
							on: {
								click: () => {
									this.curMarketPrice=params.row.marketPrice;
									this.openThresholdSettingPop(params.row.id,'view');
								}
							},
						},'查看');
					},
				},{
					title: '操作',
					key: 'action',
					width: 266,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									icon: 'android-open',
									size: 'small'
								},
								on: {
									click: () => {
										this.openGoodsFormPop(params.row.id,'view');
									}
								}
							},'查看商品'),
							h('Button', {
								style: {
									margin: '0 5px'
								},
								props: {
									type: 'info',
									icon: 'android-list',
									size: 'small'
								},
								on: {
									click: () => {
										this.openSpecificationListPop(params.row.id,'view');
									}
								}
							},'商品规格'),
							h('Button', {
								props: {
									type: 'success',
									icon: 'ios-download',
									size: 'small'
								},
								on: {
									click: () => {
										console.log(params.row.id);
										this.goodsUpdates(params.row.id,params.row.goodsName);
									}
								}
							},'下架')
						]);
					}
				},
			],
			tableData: [],
		};
	},
	created: function () {
		//默认加载列表数据
		this.dataList(0,1);
	},
	computed: {
		...mapGetters({
			channelIdList: 'channelList'
		})
	},
	methods: {
		//刷新
		toRefresh () {
			this.refresh = true;
			//重装加载列表
			this.dataList(0,1);
		},
		//数据列表
		dataList(currentPage=1,params={}) {
			this.$http({
				method: 'get',
				url: '/goods/goodsUpperList.html',
				params: {
					'pageSize': this.pageSize,
					'page': currentPage,
					...params
				},
			}).then((response) => {
				console.log(response);
				this.$Loading.finish();
				if(response.result){
					this.tableData = response.dataList;//数据列表
					this.page = response.pages;//分页信息
				}else{
					this.$Loading.error();
					this.$Message.error({
						content: '数据获取失败，请重试'
					});
				}
				this.refresh = false;
			}).catch((err) => {
				this.$Loading.error();
				this.$Message.error(err);
			});
		},
		//搜索提交
		handleSubmit () {
			console.log(this.status);
			console.log(this.searchFormItem);
			this.dataList(1,this.searchFormItem);
		},
		//分页切换
		handleCurrentChange (curr) {
			console.log(curr);
			this.dataList(curr);
		},
		//显示隐藏搜索
		toggleSearch () {
			this.searchShow = !this.searchShow;
		},
		//商品信息弹出窗
		toggleGoodsForm (type) {
			this.goodsFormShow = !this.goodsFormShow;
		},
		//打开商品表单
		openGoodsFormPop(goodsId,pageType){
			this.goodsId = goodsId;
			this.pageType = pageType;
			this.toggleGoodsForm();
		},
		//商品门槛弹出窗
		toggleThresholdSettingPop () {
			this.thresholdSettingPop = !this.thresholdSettingPop;
		},
		//打开门槛设置表单
		openThresholdSettingPop(goodsId,pageType){
			this.goodsId = goodsId;
			this.pageType = pageType;
			this.toggleThresholdSettingPop();
		},
		//商品规格弹出窗
		toggleSpecificationListPop () {
			this.specificationListPop = !this.specificationListPop;
		},
		//打开商品规格表单
		openSpecificationListPop(goodsId,pageType){
			this.goodsId = goodsId;
			this.pageType = pageType;
			this.toggleSpecificationListPop();
		},
		//类目内推荐、人气优选状态处理
		changeSwicthStatus (goodsId,status,type){
			console.log('type='+type);
			console.log('status='+status);
			let datas = {};
			if(type == 1){
				datas = {
					'goodsId': goodsId,
					'isRecommend': status
				};
			}else{
				datas = {
					'goodsId': goodsId,
					'popularity': status
				};
			}

			this.$http({
				method: 'get',
				url: '/goods/recommendOrOff',
				params: datas,
			}).then((response) => {
				if (response.result) {
					this.$Message.success({
						content: response.msg,
						onClose: () =>{
							this.toRefresh();
						}
					});
				}else {
					this.$Message.error({
						content: response.msg,
						onClose: () =>{
							this.toRefresh();
						}
					});
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		//下架操作
		goodsUpdates (goodsId,goodsName) {
			this.$Modal.confirm({
                    title: '提示',
					content: '你将下架商品【'+goodsName+'】，将无法查看和购买。商品下架后可在<未上架商品>列表中查看。',
					loading: true,
                    onOk: () => {
						this.$http({
							method: 'get',
							url: '/goods/recommendOrOff.html',
							params: {
								'goodsId': goodsId,
								'isOff': 0
							},
						}).then((response) => {
							console.log(response);
							if(response.result){
								this.$Modal.remove();
								this.$Message.success({
									content: response.msg,
									onClose: () =>{
										this.toRefresh();
									}
								});
							}else{
								this.$Message.error({
									content: response.msg,
									onClose: () =>{
										this.toRefresh();
									}
								});
							}
						}).catch((err) => {
							this.$Loading.error();
							this.$Message.error(err);
						});
                    }
                });
		}
	},
    watch:{
        thresholdSettingPop(val){
            if(!val){
                this.dataList(0,1);
            }
        },
        specificationListPop(val){
            !val&&this.dataList();
        }
    }
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	.w100{
		width: 100px;
	}
	.w200{
		width: 200px;
	}
	.w280{
		width: 280px;
	}
	.w300{
		width: 300px;
	}
</style>

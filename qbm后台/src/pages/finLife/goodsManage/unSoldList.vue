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
					<Button type="primary" icon="android-add" @click="openGoodsFormPop(0,'add')">新增</Button>
					<Button type="primary" icon="android-search" @click="toggleSearch">搜索</Button>
					<Button type="primary" icon="android-sync" :loading="refresh"  @click="toRefresh">
						<span v-if="!refresh">刷新</span>
						<span v-else>加载中...</span>
					</Button>
				</Col>
				<Col span="12">
					<Form style="float:right;">
						<FormItem>
							<RadioGroup v-model="status" type="button" @on-change="listStatusChange">
								<Radio label="0" value="0">全部</Radio>
								<Radio label="1" value="1">售完下架</Radio>
								<Radio label="2" value="2">人工下架</Radio>
								<Radio label="3" value="3">从未上架</Radio>
							</RadioGroup>
						</FormItem>
					</Form>
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
			<FormItem label="商品ID">
				<Input type="text" placeholder="" v-model="searchFormItem.goodsId" class="w100"></Input>
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
		<!--新增修改商品-->
		<goodsForm
			:isShow.sync="goodsFormShow"
			:goodsId.sync="goodsId"
			:pageType.sync="pageType"
			@refresh="toRefresh"
		></goodsForm>
		<!--设置-->
		<thresholdSetting
			:isShow.sync="thresholdSettingPop"
			:goodsId.sync="goodsId"
			:goodsWorth.sync="goodsWorth"
			:pageType.sync="pageType"
			:shoppingPrice="shoppingPrice"
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
	name: 'unSoldList',
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
		    aa:'',
            shoppingPrice:'',
		    level_one:'',
			level_two:'',
			level_three:'',
			goodsFormShow: false,
			searchShow: false, //搜索块是否显示
			thresholdSettingPop: false,
			specificationListPop: false,
			refresh: false,
			single: false,
			status: '0',
			searchFormItem: {
				searchName: '',
				goodsId: '',
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
			pageType: 'add',
			goodsWorth: '',
			columns: [
				{
					title: '序号',
					width: 80,
					align: 'center',
					key: 'id',
					fixed: 'left',
				},
				{
					title: '商品ID',
					width: 80,
					key: 'id',
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
					width: 100,
					key: 'varietiesName',
				},{
					title: '总库存',
					width: 100,
					key: 'sumStocks'
				},{
					title: '当前库存',
					width: 100,
					key: 'remainStock'
				},{
					title: '总销量',
					width: 100,
					key: 'sumSales'
				},{
					title: '创建时间',
					render: (h, params) =>{
						if(params.row.addTime){
							return h('span', {}, $util.formatTimestamp(params.row.addTime));
						}else{
							return '';
						}
					},
					width: 150,
				},{
					title:'下架时间',
					render: (h, params) =>{
						if(params.row.offShelfTime){
							return h('span', {}, $util.formatTimestamp(params.row.offShelfTime));
						}else{
							return '';
						}
					},
					width: 150,
				},{
					title:'状态',
					render: (h, params) =>{
						let statusVal = params.row.status;
						//console.log(params.row.status);
						if (statusVal == '0'){
							return h('span', {}, '');
						}else if (statusVal == '1'){
							return h('span', {}, '售完下架');
						}else if (statusVal == '2'){
							return h('span', {}, '人工下架');
						}else if (statusVal == '3'){
							return h('span', {}, '从未上架');
						}
					},
					width: 90,
				},{
					title:'商品门槛',
					align: 'center',
					width: 110,
					fixed: 'right',
					render: (h, params) =>{
						if(params.row.num == 1){
							return h('Button',{
								props: {
									type: 'success',
									size: 'small'
								},
								on: {
									click: () => {
										this.openThresholdSettingPop(params.row.id,params.row.goodsWorth,'edit',params.row.num,params.row.marketPrice);
									}
								},
							},'已设置');
						}else{
							return h('Button',{
								props: {
									type: 'error',
									size: 'small'
								},
								on: {
									click: () => {
										this.openThresholdSettingPop(params.row.id,params.row.goodsWorth,'add',params.row.num,params.row.marketPrice);
									}
								},
							},'未设置');
						}

					},
				},{
					title: '操作',
					key: 'action',
					width: 250,
					align: 'center',
					fixed: 'right',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'primary',
									icon: 'compose',
									size: 'small'
								},
								on: {
									click: () => {
										this.openGoodsFormPop(params.row.id,'edit');
									}
								}
							},'编辑'),
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
										this.openSpecificationListPop(params.row.id,'edit');
										//this.formModal(params.index);
									}
								}

							},'商品规格'),
							h('Button', {
								props: {
									type: 'success',
									icon: 'ios-upload-outline',
									size: 'small'
								},
								on: {
									click: () => {
										this.goodsUpdates(params.row.id,params.row.goodsName,params.row.remainStock,params.row.num);
									}
								}
							},'上架')
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
        change(){
            log('ss');
            this.level_one=121;
			this.level_two=131;
            this.level_three=220;
		},
        clear(){
            this.level_one='';
            this.level_two='';
            this.level_three='';
		},
		//刷新
		toRefresh () {
            log('有没有刷新');
			this.refresh = true;
			//重装加载列表
			this.dataList(0,1);
			//重置状态
			this.status = '0';
		},
		//状态
		listStatusChange (status) {
			this.dataList(this.status,1);
		},
		changeInviter(status) {
			console.log('开关状态：'+status);
		},
		//数据列表
		dataList(status,currentPage=1,params={}) {
			this.$http({
				method: 'get',
				url: '/goods/queryGoodsByStatus.html',
				params: {
					'status': status,
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
		handleSubmit() {
			console.log(this.status);
			console.log(this.searchFormItem);
			this.dataList(this.status,1,this.searchFormItem);
		},
		//分页切换
		handleCurrentChange(curr) {
			console.log(this.status);
			console.log(curr);
			console.log(this.searchFormItem);
			this.dataList(this.status,curr);
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
		openThresholdSettingPop(goodsId,goodsWorth,pageType,status,price){
            this.shoppingPrice=price;
            this.is_setting=status;
			this.goodsId = goodsId;
			this.goodsWorth = goodsWorth;
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
		//商品表单提交
		popFormSubmit (name) {
			this.$refs[name].validate((valid) => {
				if (valid) {
					console.log("验证通过");
					console.log(this.popForm);
					this.$Message.success('Success!');
				} else {
					console.log("验证不通过");
					this.$Message.error('Fail!');
				}
			});
		},
		popFormReset (name) {
			//重置表单
			this.$refs[name].resetFields();
		},
		//上架操作
		goodsUpdates (goodsId,goodsName,remainStock,num) {
			if(remainStock == 0 || remainStock == "" || remainStock == undefined){
				this.$Modal.warning({
					title: '提示',
					width: 300,
					content: '当前商品库存为0不可上架！'
				});
			}else if(num == 0){
				this.$Modal.warning({
					title: '提示',
					content: '上架商品前，请先配置商品门槛',
					/*okText:'前往配置',
					cancelText: '取消',
					onOk: () => {
						this.openThresholdSettingPop(goodsId,'add');//打开商品门槛配置
					}*/
				});
			}else{
				this.$Modal.confirm({
                    title: '提示',
					content: '你将上架商品【'+goodsName+'】，点击确定，完成上架。商品上架后可前往已上架商品列表中查看。',
					loading: true,
                    onOk: () => {
						this.$http({
							method: 'get',
							url: '/goods/recommendOrOff.html',
							params: {
								'goodsId': goodsId,
								'isOff': 1
							},
						}).then((response) => {
							console.log(response);
							if(response.result){
								this.$Modal.remove();
								this.$Message.success({
									content: response.msg,
									onClose: () =>{
										this.toRefresh();//重新加载列表
									}
								});
							}else{
								this.$Message.error(response.msg);
							}
						}).catch((err) => {
							this.$Loading.error();
							this.$Message.error(err);
						});
                    }
                });
			}
		},
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
<style lang='scss'>
	//弹出框垂直居中
	.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
    }
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

	// .customHeight .ivu-modal-body {
	// 	height: 600px;
	// 	overflow: auto;
	// }

</style>

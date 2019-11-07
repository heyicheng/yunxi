<template>
	<div>
		<TablePage
		:columns="columns"
		:tableData="dataList"
		:page="page"
		@pageChange="getTableData"
		>
			<Button type="primary" slot="header" style="margin-right: 5px;" @click="handleExport">导出结果</Button>
			<Button type="primary" slot="header" style="margin-right: 5px;" icon="ios-cloud-upload-outline">批量结算进货价</Button>
			<input class="uploadBtn" @change="handleUploadFile" type="file" slot="header" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
			<Button type="primary" icon="android-search" slot="header" @click="toggleSearch">搜索</Button>
		</TablePage>

		<search-bar
		:searchShow="searchShow"
		@toggleSearch="toggleSearch"
		@searchSubmit="handleSubmit"
		>
			<FormItem label="下单时间">
				<DatePicker format="yyyy-MM-dd HH:mm:ss" placement="bottom-end" type="datetimerange" @on-change="handleDateChange" style="width: 300px"></DatePicker>
			</FormItem>
			<FormItem label="订单状态">
				<Select v-model="formItem.orderStatus" placeholder="请选择" style="width:100px">
					<Option v-for="item in orderStatusList" :value="item.value" :key="item.value">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem label="">
				<Input type="text" placeholder="订单编号/商品名/用户名/商品ID/商品编号" v-model="formItem.searchName">
				</Input>
			</FormItem>
		</search-bar>

		<detailPopup
		:isShow="detailShow"
		:orderId="orderId"
		:modelData="orderDetail"
		:isChange.sync="isChange"
		@togglePopup="toggleDetailPopup"
		></detailPopup>

		<logisticsPopup
		:isShow="logisticsShow"
		:modelData="logisticsData"
		:orderId="orderId"
		@togglePopup="toggleLogisticsPopup"
		@updateTable="getTableData"
		></logisticsPopup>
	</div>
</template>

<script>
import detailPopup from '@components/orderManage/detailPopup';
import logisticsPopup from '@components/orderManage/logisticsPopup';
import TablePage from '@components/common/TablePage';
import searchBar from '@components/common/SearchBar';
import net from '@util/net';
import CategorySelect from '@components/common/CategorySelect';
const ajax = net();

import { mapGetters } from "vuex";


let Component = {
	name: 'orderManageIndex',
	components: {
		detailPopup,
		logisticsPopup,
		TablePage,
		searchBar,
		CategorySelect
	},
	data () {
		return {
			detailShow: false, //弹窗是否显示
			logisticsShow: false, //弹窗是否显示
			searchShow: false, //搜索块是否显示
			logisticsData: {},
			orderId: '',
			currentPage: 1,
			formItem: {
				searchName: '',
				date: [],
				orderStatus: 0
			},
			page: {
				total: 150
			},
			orderDetail: {},
			columns: [
			//表格key值、title等设置
				{
					title: '序号',
					key: 'id',
					width: 80,
				},
				{
					title: '订单编号',
					key: 'orderNo',
					width: 200,
				},
				{
					title: '订单时间',
					render: (h, params) =>{
						return h('span', {}, this.$util.formatTimestamp(params.row.orderTime));
					},
					width: 162
				},
				{
					title: '商品',
					key: 'goodsName',
					width: 250
				},
				{
					title: '商品ID',
					key: 'goodsId',
					width: 100
				},
				{
					title: '商品编号',
					key: 'goodsNumber',
					width: 120,
				},
				{
					title: '市场价(元)',
					key: 'marketPrice',
					width: 100,
				},
				{
					title: '购买用户',
					key: 'phone',
					width: 120,
				},
				{
					title: '购买金额(元)',
					key: 'account',
					width: 110,
				},
				{
					title: '生活券金额',
					key: 'money',
					width: 110,
				},
				{
					title: '期限',
					width: 80,
					render: (h, params) =>{
						return h('span', {}, params.row.timeLimit + '个月');
					}
				},
				{
					title: '订单状态',
					width: 90,
					render: (h, params) =>{
						let status = params.row.status;
						let text = '';
						if (status == 1) {
							text = '待发货';
						}else if (status == 2) {
							text = '已发货';
						}else if (status == 3) {
							text = '已完成';
						}
						return h('span', {}, text);
					}
				},
				{
					title: '操作',
					key: 'action',
					align: 'center',
					width: 260,
					fixed: "right",
					render: (h, params) => {
						let {
							status,
							delay
						} = params.row;
						let childrenBtn = [
							h('Button', {
								props: {
									type: 'info',
									size: 'small',

								},
								style: {
									marginRight: '5px'
								},
								on: {
									click: () => {
										this.getOrderDetail(params.row.id, 1);
									}
								}
							},'详情'),
							h('Button', {
								props: {
									type: 'info',
									size: 'small'
								},
								on: {
									click: () => {
										this.getOrderDetail(params.row.id, 2);
									}
								}
							},'修改进货价'),
						];
						if (status==1) {
							childrenBtn =[
								h('Button', {
									props: {
										type: 'success',
										size: 'small',

									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.getLogisticsInfo(params.row.id);
										}
									}
								},'发货'),
								...childrenBtn
							];
						} else if (status == 2) {
							childrenBtn =[
								h('Button', {
									props: {
										type: 'error',
										size: 'small',

									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.getLogisticsInfo(params.row.id);
										}
									}
								},'收货'),
								delay==0 && h('Button', {
									props: {
										type: 'warning',
										size: 'small',

									},
									style: {
										marginRight: '5px'
									},
									on: {
										click: () => {
											this.$Modal.confirm({
												title: '延长收货',
												content: '<p>点击确定当前订单自动收货时间将延长7天。</p>',
												onOk: () => {
													this.$http({
														method: 'get',
														url: '/goodsOrder/updateDelay.html',
														params: {
															id: params.row.id
														},
													}).then((response) => {
														if (response.result) {
															this.$Message.info('延长收货成功');
															this.getTableData();
														}else {
															 this.$Message.error(response.msg);
														}
													}).catch((err) => {
														this.$Message.error(err.msg);
													});
													
												},
												onCancel: () => {
													
												}
											});
										}
									}
								},'延长收货'),
								...childrenBtn
							];
						}
						return h('div', [
							...childrenBtn
						]);
					}
				}
			],
			dataList: [],
			isChange: false
		};
	},
	computed: {
		...mapGetters({
			orderStatusList: 'orderStatusList'
		})
	},
	created() {
		this.getTableData(1);
	},
	methods: {
		//搜索提交
		handleSubmit() {
			this.getTableData(1);
		},
		//显示隐藏弹窗
		toggleDetailPopup () {
			this.detailShow = !this.detailShow;
		},
		toggleLogisticsPopup () {
			this.logisticsShow = !this.logisticsShow;
		},
		//日期选择数据绑定
		handleDateChange(value) {
			this.formItem.date = value;
		},
		//显示隐藏搜索
		toggleSearch () {
			this.searchShow = !this.searchShow;
		},
		// 获取表格信息
		getTableData(currentPage) {
			let param = {...this.formItem};
			if (currentPage) {
				this.currentPage = currentPage;
			}
			if (param.date.length>0) {
				param = {
					...param,
					startTime: param.date[0],
					endTime: param.date[1]
				};
			}
			this.$http({
				method: 'get',
				url: '/goodsOrder/goodsOrderList.html',
				params: {
					...param,
					page: this.currentPage
				},
			}).then((response) => {
				if (response.result) {
					this.dataList = response.dataList;
					this.page = response.pages;
				}else {
					 this.$Message.error(response.msg);
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		getOrderDetail(id, module) {
			this.$http({
				method: 'get',
				url: '/goodsOrder/queryGoodsOrderDetail.html',
				params: {
					id
				},
			}).then((response) => {
				if (response.result) {
					console.log(response);
					if (module == 2) {
						console.log('change');
						this.isChange = true;
					}
					this.orderDetail = response;
					this.orderId = id;
					setTimeout(()=>{
						this.toggleDetailPopup();
					},10);
					
				}else {
					 this.$Message.error(response.msg);
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		getLogisticsInfo(id){
			this.$http({
				method: 'get',
				url: '/goodsOrder/queryLogisticsInfo.html',
				params: {
					id
				},
			}).then((response) => {
				if (response.result) {
					this.logisticsData = response;
					this.orderId = id;
					this.toggleLogisticsPopup();
				}else {
					 this.$Message.error(response.msg);
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		handleUploadFile(event) {
			const file = event.target.files[0];
			ajax({
				type: "form",
				url: `${this.$url.webUrl}/goodsOrder/batchModifySettlementPrice.html`,
				dataType: "JSON",
				param: {
					file: file
				},
				success: function(data) {
					consle.log(data);
				}
			});
		},
		handleExport() {
			let paramArray = [],
				data = {...this.formItem};
			for (let key in data) {
				if (data[key] || data[key] === false || data[key] === 0) {
					paramArray.push(key + '=' + encodeURIComponent(data[key]));
				}
			}
			window.open(`${this.$url.webUrl}/goodsOrder/exportGoodsOrderDetail.html${paramArray[0]?'?':''}${paramArray[0]?paramArray.join('&'):''}`);
		}
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.uploadBtn {
	position: absolute;
	left: 105px;
	width: 130px;
	opacity: 0;
}
</style>

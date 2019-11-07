<template>
	<div class="">
		<TablePage
		:columns="columns"
		:tableData="dataList"
		:page="page"
		@pageChange="getTableData"
		>
			<Button type="primary" slot="header" style="margin-right: 5px;" @click="togglePopup">新建</Button>
			<Button type="primary" icon="android-search" slot="header" @click="toggleSearch">搜索</Button>
		</TablePage>
		<search-bar
		:searchShow="searchShow"
		@toggleSearch="toggleSearch"
		@searchSubmit="handleSubmit"
		>
			<FormItem label="渠道名">
				<Input type="text" placeholder="请输入渠道名" v-model="searchName">
				</Input>
			</FormItem>
		</search-bar>
		<FormPopup
		:isShow.sync="modalShow"
		:channelId.sync="channelId"
		></FormPopup>
	</div>
</template>

<script>

import TablePage from '@components/common/TablePage';
import searchBar from '@components/common/SearchBar';
import FormPopup from '@components/goodsManage/ChannelFormPopup';

let Component = {
	name: 'goodsChannelList',
	components: {
		TablePage,
		searchBar,
		FormPopup
	},
	data () {
		return {
			columns: [
				{
					title: '编号',
					key: 'id',
					width: 80
				},
				{
					title: '渠道名',
					key: 'channelName',
				},
				{
					title: '状态',
					width: 100,
					render: (h,params) => {
						return h('span',{},[
							h('i-switch',{
								props: {
									'true-value': 0,
									'false-value': 1,
									size: 'large',
									value: params.row.status
								},
								on: {
									'on-change': (status)=>{
										this.$http({
											method: 'get',
											url: '/channelConfig/setChannelStatus.html',
											params: {
												id: params.row.id,
											},
										}).then((response) => {
											if (response.result) {
												this.$Message.success(response.msg);
											}else {
												this.$Message.error(response.msg);
												this.getTableData();
											}
										}).catch((err) => {
											this.$Message.error(err.msg);
										});
									}
								}
							}, [
								h('span', {
									slot: 'open'
								}, '启用'),
								h('span', {
									slot: 'close'
								}, '禁用')
							])
						]);
					}
				},
				{
					title: '操作',
					width: 100,
					render: (h,params) => {
						return h('Button',{
							props: {
								size: 'small',
								type: 'success'
							},
							on: {
								click: () => {
									this.loadData(params.row.id);
								}
							}
						},'编辑');
					}
				},
			],
			searchShow: false,
			searchName: '',
			dataList: [],
			page: {},
			channelId: 0,
			modalShow: false,
		};
	},
	methods: {
		handleCreateChannel() {

		},
		handleSubmit() {
			this.getTableData(1);
		},
		getTableData(currentPage) {
			if (currentPage) {
				this.currentPage = currentPage;
			}
			this.$http({
				method: 'get',
				url: '/channelConfig/channelList.html',
				params: {
					searchName: this.searchName,
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
		//显示隐藏搜索
		toggleSearch () {
			this.searchShow = !this.searchShow;
		},
		togglePopup (data) {
			this.modalShow = !this.modalShow;
		},
		loadData(id) {
			this.channelId = id;
			this.togglePopup();
			
        },
	},
	created() {
		this.getTableData(1);
	},
	mounted() {
		
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>

</style>

<template>
	<div>
		<TablePage
		:columns="columns"
		:tableData="tableDataList"
		:page="page"
		:pageSize="pageSize"
		@pageChange="handleCurrentChange"
		>
			<Row type="flex" justify="space-between" slot="header" style="height: 30px;">
				<Col span="12">
					<Button type="primary" icon="android-add" @click="openModal('add')">新增</Button>
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
		:formItem.sync="formItem"
		@toggleSearch="toggleSearch"
		@searchSubmit="handleSubmit"
		>
			<FormItem label="落地页名称">
				<Input type="text" placeholder="" v-model="formItem.pageName" class="w300"></Input>
			</FormItem>
			<FormItem label="渠道名称">
				<Input type="text" placeholder="" v-model="formItem.channelName" class="w300"></Input>
			</FormItem>
			<FormItem label="类别">
				<Select v-model="formItem.searchType" clearable placeholder="请选择" class="w300">
					<Option value="">全部</Option>
					<Option v-for="item in searchTypeList" :value="item.value" :key="item.value">{{ item.name }}</Option>
				</Select>
			</FormItem>
		</search-bar>

		<Modal
			title="落地页H5配置"
			v-model="formModal"
			width="600"
			class-name="vertical-center-modal customHeight"
			@on-cancel="popFormClose"
			>
			<Form
				ref="popForm"
				:model="popForm"
				:rules="popFormRules"
				:label-width="120"
				>
				<FormItem label="类别" prop="typeId">
					<Select v-model="popForm.typeId" clearable class="w300">
						<Option v-for="item in typeIdList" :value="item.value" :key="item.value">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="名称" prop="name">
					<Input type="text" placeholder="" v-model="popForm.name" class="w300"></Input>
				</FormItem>
				<FormItem label="头图" prop="headPic">
					<upload :is_multiple="headPicList.is_multiple" :is_reset="headPicList.is_reset" :maxNum="headPicList.maxNum" :sPics="headPicList.sPics" @sPicList="getHeadPicList($event)"></upload>
					<Input v-show="false" v-model="popForm.headPic" ></Input>
				</FormItem>
				<FormItem label="底图" prop="bottomPic">
					<upload :is_multiple="bottomPicList.is_multiple" :is_reset="bottomPicList.is_reset" :maxNum="bottomPicList.maxNum" :sPics="bottomPicList.sPics" @sPicList="getBottomPicList($event)"></upload>
					<Input v-show="false" v-model="popForm.bottomPic" ></Input>
				</FormItem>
				<FormItem label="显示邀请人" prop="showInviter">
					<RadioGroup v-model="popForm.showInviter">
						<Radio label="1" value="1">是</Radio>
						<Radio label="0" value="0">否</Radio>
					</RadioGroup>					
				</FormItem>
				<FormItem label="渠道名称" prop="sourceName">
					<Input type="text" placeholder="" v-model="popForm.sourceName" class="w300"></Input>
				</FormItem>
				<FormItem label="渠道标识" prop="sourceType">
					<Input type="text" placeholder="" v-model="popForm.sourceType" class="w300"></Input>
				</FormItem>
				<FormItem label="红包金额" prop="money">
					<Input v-model="popForm.money" placeholder="" class="w100">
						<span slot="append">元</span>
					</Input>
				</FormItem>
				<FormItem label="页面背景" prop="backgroundColor">
					<Input type="text" placeholder="（例：#FFF000）" v-model="popForm.backgroundColor" class="w300"></Input>
				</FormItem>
				<FormItem label="验证码字体颜色" prop="verifyColor">
					<Input type="text" placeholder="（例：#FFF000）" v-model="popForm.verifyColor" class="w300"></Input>
				</FormItem>
				<FormItem label="验证码底图颜色" prop="bottomColor">
					<Input type="text" placeholder="（例：#FFF000）" v-model="popForm.bottomColor" class="w300"></Input>
				</FormItem>
				<FormItem label="立即注册按钮颜色" prop="buttonColor">
					<Input type="text" placeholder="（例：#FFF000）" v-model="popForm.buttonColor" class="w300"></Input>
				</FormItem>
				<FormItem label="立即注册字体颜色" prop="fontColor">
					<Input type="text" placeholder="（例：#FFF000）" v-model="popForm.fontColor" class="w300"></Input>
				</FormItem>
				<FormItem label="立即注册字体颜色" prop="agreementColor">
					<Input type="text" placeholder="（例：#FFF000）" v-model="popForm.agreementColor" class="w300"></Input>
				</FormItem>
				<FormItem label="备注" prop="remark">
					<Input type="textarea" placeholder="" v-model="popForm.remark" :rows="4" class="w300"></Input>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="text" @click="popFormClose" style="margin-right: 8px">取消</Button>
				<Button type="primary" :loading="loading" @click="popFormSubmit('popForm')">
					<span v-if="!loading">确定</span>
					<span v-else>提交中...</span>
				</Button>
			</div>
		</Modal>

	</div>
</template>

<script>

import Upload from '@/components/common/uploadPic/upload';
import TablePage from '@components/common/TablePage';
import searchBar from '@components/common/SearchBar';
import { mapGetters } from "vuex";
import Clipboard from 'clipboard';

let Component = {
	name: 'regPageConfig',
	components: {
		Upload,
		TablePage,
		searchBar,
	},
	data () {
		return {
			headPicList:{
				is_multiple: true,
				maxNum: 3,
				sPics: '',
				is_reset: 1,
			},
			bottomPicList:{
				is_multiple: true,
				maxNum: 3,
				sPics: '',
				is_reset: 1,
			},
			loading: false,
			formModal: false,
			searchShow: false, //搜索块是否显示
			refresh: false,
			formItem: {
				pageName: '',
				channelName: '',
				searchType: '',
			},
			popForm: {
				typeId: '',
				name: '',
				headPic: '',
				bottomPic: '',
				showInviter: '0',
				sourceName: '',
				sourceType: '',
				money: '',
				backgroundColor: '',
				verifyColor: '',
				bottomColor: '',
				buttonColor: '',
				fontColor: '',
				agreementColor: '',
				remark: '',
			},
			page: {},
			pageSize: 10,
			columns: [
				{
					title: '序号',
					width: 90,
					align: 'center',
					key: 'id',
				},
				{
					title: '名称',
					key: 'name',
				},
				{
					title: '类别',
					key: 'typeName',
				},
				{
					title: '渠道名称',
					key: 'sourceName',
				},
				{
					title: '渠道标识',
					key: 'sourceType',
				},{
					title: '操作',
					key: 'action',
					width: 280,
					align: 'center',
					render: (h, params) => {
						return h('div', [
							h('Button', {
								props: {
									type: 'info',
									icon: 'clipboard',
									size: 'small'
								},
								on: {
									click: () => {
										let clipboard = new Clipboard('.ivu-btn',{
											text: function() {
												return params.row.link;//复制的内容
											}
										});
										clipboard.on('success',e => {
											this.$Message.success('复制成功');
											clipboard.destroy();
										});

									}
								}
							},'复制链接'),
							h('Button', {
								style: {
									margin: '0 5px'
								},
								props: {
									type: 'primary',
									icon: 'compose',
									size: 'small'
								},
								on: {
									click: () => {
										console.log(params.row.id);
										this.popFormData(params.row.id);
									}
								}
							},'编辑'),
							h('Poptip', {
								props: {
									confirm: true,
									title: '您确定要删除这条数据吗?',
									transfer: true
								},
								on: {
									'on-ok': () => {
										console.log(params);
										this.openModal('edit');
										this.delFun(params.row.id);
									}
								}
							}, [
								h('Button', {

									props: {
										type: 'error',
										placement: 'top',
										size: 'small',
										icon: 'trash-a'
									}
								}, '删除')
							])
						]);
					}
				},
			],
			tableDataList: [],
			popFormRules: {
				typeId: [
					{ required: true, message: '请选择类别', trigger: 'blur' }
				],
				name: [
					{ required: true, message: '请填写名称', trigger: 'blur' }
				],
				headPic: [
					{ required: true, message: '请上传头图', trigger: 'blur' }
				],
				bottomPic: [
					{ required: true, message: '请上传底图', trigger: 'blur' }
				],
				sourceName: [
					{ required: true, message: '请填写渠道名称', trigger: 'blur' }
				],
				sourceType: [
					{ required: true, message: '请填写渠道标识', trigger: 'blur' }
				],
				money: [
					{ required: true,message: '请设置注册红包金额', trigger: 'blur' }
				],
				backgroundColor: [
					{ required: true, message: '请设置页面背景颜色', trigger: 'blur' }
				],
				verifyColor: [
					{ required: true, message: '请设置验证码字体颜色', trigger: 'blur' }
				],
				bottomColor: [
					{ required: true, message: '请设置验证码底图颜色', trigger: 'blur' }
				],
				buttonColor: [
					{ required: true, message: '请设置立即注册按钮颜色', trigger: 'blur' }
				],
				fontColor: [
					{ required: true, message: '请设置立即注册字体颜色', trigger: 'blur' }
				],
				agreementColor: [
					{ required: true, message: '请设置注册协议字体颜色', trigger: 'blur' }
				],
			},
		};
	},
	computed: {
		...mapGetters({
			searchTypeList: 'linkAgeList',
			typeIdList: 'linkAgeList',
		})
	},
	created: function () {
		//默认加载列表数据
		this.dataList();
	},
	methods: {
		//搜索提交
		handleSubmit () {
			console.log(this.formItem);
			this.dataList(1,this.formItem);
		},
		toRefresh () {
			this.refresh = true;
			this.dataList(1,this.formItem);
		},
		//数据列表
		dataList(currentPage=1,params={}) {
			//数据请求
			this.$http({
				method: 'get',
				url: '/regSetting/queryRegpageConfig.html',
				params: {
					'pageSize': this.pageSize,
					'page': currentPage,
					...params
				},
			}).then((response) => {
				console.log(response);
				this.$Loading.finish();
				if(response.result){
					console.log('数据加载成功！');
					this.tableDataList = response.dataList;//数据列表
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
		openModal(type){
			this.formModal = true;
			this.popForm.type=type;
		},
		//弹出窗数据
		popFormData (id) {
			console.log("this.popForm");
			console.log(this.popForm);
			this.$http({
				method: 'get',
				url: '/regSetting/RegpageConfigById.html',
				params: {
					'id': id
				},
			}).then((response) => {
				console.log(response);
				this.$Loading.finish();
				if(response.result){
					this.formModal = true;
					console.log('数据加载成功！');

					this.headPicList.sPics = response.headList;
					this.bottomPicList.sPics = response.bottomList;

					this.popForm = {
						...response.regpageConfig,
						typeId: JSON.stringify(response.regpageConfig.typeId),
						showInviter: JSON.stringify(response.regpageConfig.showInviter),
						money: JSON.stringify(response.regpageConfig.money),
						type: 'edit',
					};

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
		getHeadPicList(value){
			console.log('getHeadPicList');
			console.log(value);
			this.popForm.headPic = value;
		},
		getBottomPicList(value){
			console.log('getBottomPicList');
			console.log(value);
			this.popForm.bottomPic = value;
		},
		//删除操作
		delFun (id) {
			this.$http({
				method: 'post',
				url: '/regSetting/deleteRegpageConfig.html',
				params: {
					'id': id
				},
			}).then((response) => {
				console.log(response);
				if(response.result){
					this.$Message.success({
						content: '删除成功!',
						onClose:()=>{
							this.dataList(1,this.formItem);
						}
					});
				}else{
					this.$Message.error('删除失败！');
				}
			}).catch((err) => {
				this.$Message.error(err);
			});
		},
		//分页切换
		handleCurrentChange (curr) {
			console.log(curr);
			this.dataList(curr,this.formItem);
		},
		//显示隐藏搜索
		toggleSearch () {
			this.searchShow = !this.searchShow;
		},
		//表单提交
		popFormSubmit (name) {
			console.log(this.popForm);

			this.$refs[name].validate((valid) => {
				if (valid) {
					console.log("验证通过");
					// this.$Message.success('Success!');
					this.loading = true;
					this.$Loading.start();
					this.$http({
						method: 'post',
						url: '/regSetting/addRegpageConfig.html',
						params: {
							//'showInviter': showInviter,
							...this.popForm
						},
					}).then((response) => {
						console.log(response);
						if(response.result){

							console.log('数据加载成功！');
							this.$Loading.finish();
							this.$Message.success({
								content: response.msg,
								onClose:()=>{
									this.popFormClose();//清空对象
									this.loading = false;
									this.formModal = false;
									this.dataList();
								}
							});
						}else{
							this.loading = false;
							this.$Loading.error();
							this.$Message.error({
								content: response.msg
							});
						}
					}).catch((err) => {
						this.$Loading.error();
						this.$Message.error(err);
					});
				} else {
					console.log("验证不通过");
					this.$Message.error('请填写相关内容!');
				}
			});
		},
		//关闭表单
		popFormClose () {
			this.$refs['popForm'].resetFields();
			this.headPicList.sPics='';
			this.bottomPicList.sPics='';
			let obj={};
			Object.keys(this.popForm).forEach(val=>{
				obj[val]='';
			});
			this.popForm=obj;
			this.formModal = false;			
		},
	},
    watch:{
		//监听popform变化，来清除upload中的图片，取消的时候需要清除图片
		'popForm.headPic':function (val,oldval) {
			if(val==''){
				this.headPicList.is_reset++;
			}
		},
		'popForm.bottomPic':function (val,oldval) {
			if(val==''){
				this.bottomPicList.is_reset++;
			}
		}
    },
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

	.customHeight .ivu-modal-body {
		height: 400px;
		overflow: auto;
	}

	.spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }


</style>

	<template>
		<div>
			<TablePage
					:columns="columns"
					:tableData="tableDataList"
					:page="page"
					:pageSize="pageSize"
					@pageChange="handleCurrentChange"
			>
				<Button type="primary" icon="plus" slot="header" style="margin-right: 5px;" @click="openModal('add')">新增栏目</Button>
				<Button type="primary" icon="android-search" slot="header" @click="toggleSearch">搜索</Button>
				<Button type="primary" icon="android-sync" style="margin-left: 5px" slot="header" :loading="refresh"  @click="toRefresh">
					<span v-if="!refresh">刷新</span>
					<span v-else>加载中...</span>
				</Button>
			</TablePage>
			<!--搜索框-->
			<search-bar
					:searchShow="searchShow"
					:formItem.sync="formItem"
					@toggleSearch="toggleSearch"
					@searchSubmit="handleSubmit"
			>
				<FormItem label="栏目状态">
					<Select v-model="formItem.status" clearable placeholder="请选择" class="w300">
						<Option value="">全部</Option>
						<Option value="0">开启</Option>
						<Option value="1">关闭</Option>
						<!--<Option v-for="item in searchTypeList" :value="item.value" :key="item.value">关闭</Option>-->
					</Select>
				</FormItem>
				<FormItem label="栏目名称">
					<Input type="text" placeholder="" v-model="formItem.name" class="w300"></Input>
				</FormItem>
			</search-bar>

			<!--弹出框-->
			<Modal
					title="创建栏目标签"
					v-model="formModal"
					width="700"
					class-name="vertical-center-modal customHeight dier"
					@on-cancel="cancelFormSubmit"
			>
				<Form ref="popForm" :model="popForm" :rules="popFormRules" :label-width="120">
					<FormItem label="栏目名称" prop="labelName">
						<Input v-model="popForm.labelName" placeholder="栏目名称"></Input>
					</FormItem>
					<FormItem label="排序" prop="labelName">
						<Input v-model="popForm.labelOrder" placeholder="排序"></Input>
					</FormItem>
					<!--<FormItem label="排序" prop="labelOrder">
						<Input v-model="popForm.labelOrder" placeholder="排序" ></Input>
					</FormItem>-->
					<FormItem label="栏目icon" prop="labelIcon">
						<upload :is_reset="picData.is_reset" :maxNum="picData.maxNum"  :sPics="picData.sPics" @sPicList="getPicList($event)"></upload>
						<Input v-show="false" v-model="popForm.labelIcon" ></Input>
					</FormItem>
					<FormItem label="备注">
						<Input v-model="popForm.remark" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入内容"></Input>
					</FormItem>
				</Form>
				<div slot="footer">
					<Button type="primary" @click="popFormSubmit('popForm')" >提交</Button>
					<Button type="ghost" @click="cancelFormSubmit" style="margin-left: 8px">取消</Button>
				</div>
			</Modal>
	<!--		&lt;!&ndash;弹出商品管理&ndash;&gt;
			<Modal
					v-model="shoppingModal"
					title="商品管理"
					width="900"
			>
				<div style="height:68px;background: #f2f2f2;line-height: 68px;margin-bottom: 15px">
					<Button type="primary" icon="plus" style="margin-right: 5px;" @click="openModal('add')">新增栏目</Button>
				</div>
				<Card>
					<p slot="title">商品筛选</p>
					<Form ref="shoppingSearch" :model="shoppingSearch" :rules="shoppingRules" :label-width="70" inline>
						<Row>
							<Col span="10">
							<FormItem label="渠道">
								<Select v-model="formItem.select" style="width: 200px">
									<Option value="beijing">New York</Option>
									<Option value="shanghai">London</Option>
									<Option value="shenzhen">Sydney</Option>
								</Select>
							</FormItem>
							</Col>
							<Col span="14">
							<FormItem label="分类">
								<Select  style="width:100px">
									<Option >item.label }}</Option>
								</Select>
								<Select  style="width:100px">
									<Option >item.label }}</Option>
								</Select>
							</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span="10">
							<FormItem label="商品状态">
								<Select v-model="formItem.select" style="width: 200px">
									<Option value="beijing">New York</Option>
									<Option value="shanghai">London</Option>
									<Option value="shenzhen">Sydney</Option>
								</Select>
							</FormItem>
							</Col>
							<Col span="14">
							<FormItem label="商品名称">
								<Input v-model="value1"  placeholder="large size" style="width: 150px"></Input>
								<Button type="primary" icon="ios-search" style="margin-left: 20px">搜索</Button>
							</FormItem>
							</Col>
						</Row>
					</Form>
				</Card>
				<div slot="footer">
					<Button type="primary">返回</Button>
				</div>
			</Modal>-->
		</div>
	</template>
	<script>
        import Upload from '@/components/common/uploadPic/upload';
        import {formatTimestamp} from '@/util/util';
		// import orderPopup from '@components/orderManage/orderPopup';
		import TablePage from '@components/common/TablePage';
		import searchBar from '@components/common/SearchBar';
		import { mapGetters} from "vuex";
		let Component = {
			name: 'tagManage',
			components: {
				TablePage,
				searchBar,
				Upload,
			},
			data () {
				return {
                    refresh: false,
                    picData:{
                        maxNum:1,
                        sPics:'',
                        is_reset:1,
                    },
				    currentPage:1,
					formModal: false,
					searchShow: false, //搜索块是否显示
					// 搜索,
					formItem: {
                        status: '',
                        name: '',
					},
					popForm: {
                        labelName:'',
                        labelOrder:'',
                        labelIcon:'',
                        remark:'',
						type:'',
				        //
					},
                    popFormRules: {
                        labelName: [
                            { required: true, message: '不能为空', trigger: 'blur' }
                        ],
                        labelOrder: [
                            { required: true, message: '排序不能为空', trigger: 'blur' }
                		],
                        labelIcon: [
                            { required: true, message: '栏目icon不能为空', trigger: 'blur' }
                        ],
                    },
					page: {},
					pageSize: 10,
					columns: [
						{
							title: '序号',
							align: 'center',
							key: 'id',
							width:150
						},
						{
							title: '栏目名称',
							key: 'labelName',
						},
						{
							title: '添加时间',
							key: 'addtime',
							width:300,
							render:(h,params)=>{
							     return h('span',{},[formatTimestamp(params.row.addtime)]);
							}
						},
						{
							title:'状态',
							key:'switchStatus',
                            align: 'center',
							width:150,
							render: (h,params) =>{
									return h('i-switch',{
										props:{
											value:params.row.switchStatus==1 ? false : true
										},
                                        on: {
                                            'on-change': (value) => {//触发事件是on-change,用双引号括起来，
                                                //参数value是回调值，并没有使用到
												let index=params.index;
												if(this.tableDataList[index].switchStatus==1){
                                                    this.changeStatus(params.row.id,0,params.index);
                                                    // this.tableDataList[index].switchStatus=0;
												}else{
                                                    this.changeStatus(params.row.id,1,params.index);
                                                    // this.tableDataList[index].switchStatus=1;
												}
                                            },
                                        }
										},
										[
											h('span',{
												slot:'open'
											},'on'),
											h('span',{
												slot:'close'
											},'off')
										]
									);
							}
						},
						{
							title: '操作',
							key: 'action',
							width: 280,
							align: 'center',
							render: (h, params) => {
								return h('div', [
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
												this.openModal('edit');
												this.picData.is_reset++;
                                                this.getDetail(params.row.id);
                                            }
										}
									},'编辑'),
                                    h('Button', {
                                        style: {
                                            margin: '0 5px'
                                        },
                                        props: {
                                            type: 'primary',
                                            size: 'small'
                                        },
                                        on: {
                                            click: () => {
                                                this.shoppingModal=true;
                                            }
                                        }
                                    },'商品管理'),
								]);
							}
						},
					],
					tableDataList: [],
					currentId:'',
					//商品管理
                    shoppingModal:false,
                    shoppingSearch:{
				        aaa:''
					},
                    shoppingRules:{},
                    actualSearch:{},
				};
			},
			computed: {
		        searchItem(){
		            let obj={};
					for(let key in this.formItem){
					    if(!this.formItem[key]==''){
					        obj[key]=this.formItem[key];
						}
					}
					return obj;
				},
				...mapGetters({
					searchTypeList: 'linkAgeList',
					typeIdList: 'linkAgeList',
				})
			},
            methods: {
                toRefresh(){
                    this.refresh=true;
                    this.dataList(this.currentPage,this.searchItem);
				},
			    getDetail(id){
			        this.currentId=id;
			        this.$http({
                        method: 'get',
                        url: '/zeroManage/getLabelInfo.html',
                        params: {labelId:id},
					}).then(res=>{
					    this.formModal=true;
					    if(res.result){
                            this.picData.sPics=res.data.labelIcon;
                            this.popForm= {
                                labelName:res.data.labelName,
								labelOrder:res.data.labelOrder,
								labelIcon:res.data.labelIcon,
								remark:res.data.remark,
								type:'edit',
                            };
						}else{
                            this.$Loading.error();
                            this.$Message.error({
                                content: '数据获取失败，请重试'
                            });
						}
					});
				},
			    openModal(type){
                    this.formModal = true;
                    this.popForm.type=type;
				},
                cancelFormSubmit(){//清空对象
                    this.picData.sPics='';//清空传给upload的数据
                    this.$refs['popForm'].resetFields();
                    let obj={};
                    Object.keys(this.popForm).forEach(val=>{
                        obj[val]='';
                    });
                    this.popForm=obj;
                    this.formModal=false;
				},
			    dayin(){
			        console.log(this.popForm);
				},
                getPicList(value){
                    this.popForm.labelIcon=value;
                },
                //改变状态
                changeStatus(id,status,index){
                    this.$http({
                        method:'get',
                        url:'/zeroManage/updateLabelInfo.html',
                        // url:'/updateLabelInfo.html',
                        params:{
                            labelId:id,
                            switchStatus:status
                        }
                    }).then(res=>{
                        if(res.result){
                            this.$Message.success('操作成功');
                            this.dataList(this.currentPage,this.searchItem);
                        }else{
                            this.$Message.error('操作失败');
                            this.dataList(this.currentPage,this.searchItem);
                        }
                    });
                },
                changeInviter(status) {
                    console.log('开关状态：'+status);
                },
                //数据列表
                dataList(page=1) {
                    this.$http({
                        method: 'get',
                        url: '/zeroManage/getLabelList.html',
                        params: {
                            'pageSize': this.pageSize,
                            'page': page,
							...this.actualSearch
                        },
                    }).then((response) => {
                        console.log(response);
                        this.$Loading.finish();
                        if(response.result){
                            this.tableDataList = response.dataList;//数据列表
                            this.page = response.pages;//分页信息
                        }else{
                            this.$Loading.error();
                            this.$Message.error({
                                content: '数据获取失败，请重试'
                            });
                        }
                        this.refresh=false;
                    }).catch((err) => {
                        this.$Loading.error();
                        this.$Message.error(err);
                    });
                },
                addFormHandle (){},
                //搜索提交
                handleSubmit() {
                    this.currentPage=1;
                    this.actualSearch=Object.assign({},this.searchItem);
                    this.dataList(this.currentPage);
                },
                //分页切换
                handleCurrentChange(curr) {
                    this.currentPage=curr;
                    this.dataList(curr,this.searchItem);
                },
                //显示隐藏搜索
                toggleSearch () {
                    this.searchShow = !this.searchShow;
                },
                //删除
                remove (index) {
                    console.log(index);
                    this.tableData.splice(index, 1);
                },
                cancel () {
                    this.$refs["popForm"].resetFields();
                    console.log("取消");
                    //this.$Message.info('取消');
                },
				addData(id){
			        let params=this.popForm;
					if(params.type=='edit'){
					    params.id=this.currentId;
					}
					this.$http({
						method:'get',
                        url:'/zeroManage/manageLabel.html',
						params:params,
                    }).then(res=>{
                        if(res.result){
                            this.$Message.success('提交成功!');
                            this.cancelFormSubmit();//清空对象
                            this.formModal=false;
                            this.dataList();
                        }else{
                            this.$Message.error('提交失败!');
                        }
					});
				},

                popFormSubmit (name) {
                    this.$refs[name].validate((valid) => {
                        if (valid) {
							this.addData();
                        } else {
                            console.log("验证不通过");
                            //this.$Message.error('Fail!');
                        }
                    });
                },
            },
			watch:{
           		'popForm.labelIcon':function (val,oldval) {
					if(val==''){
                        this.picData.is_reset++;
                    }
                }
			},
            created: function () {
				this.dataList();
			},
		};
		export default Component;
	</script>

	<!-- Add "scoped" attribute to limit CSS to this component only -->
	<style lang='scss' scoped>
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
			z-index: 999!important;
			overflow: auto;
		}
		.dier{
			z-index: 1000;
		}

	</style>

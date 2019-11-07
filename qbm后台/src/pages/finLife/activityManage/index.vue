<template>
	<div>
		<TablePage
				:columns="columns"
				:tableData="dataList"
				:page="page"
				:pageSize="pageSize"
				@pageChange="handleCurrentChange"
		>
			<Row type="flex" justify="space-between" slot="header" style="height: 30px;">
				<Col span="12">
				<Button type="primary" icon="android-add" @click="openModal('add')">新增</Button>
				<Button type="primary" icon="android-search" @click="openSearch">搜索</Button>
				<Button type="primary" icon="android-sync" :loading="refresh"  @click="toRefresh">
					<span v-if="!refresh">刷新</span>
					<span v-else>加载中...</span>
				</Button>
				</Col>
			</Row>
		</TablePage>

		<search-bar
				:searchShow="searchShow"
				:formItem.sync="searchFilter"
				@toggleSearch="toggleSearch"
				@searchSubmit="handleSubmit"
		>
			<FormItem label="专区名称">
				<Input type="text" placeholder="输入活动时间进行搜索" v-model="searchFilter.searchName" class="w300"></Input>
			</FormItem>
			<FormItem label="专区状态">
				<Select v-model="searchFilter.status" clearable placeholder="请选择" class="w300">
					<Option value="">全部</Option>
					<Option value="0" >未上架</Option>
					<Option value="2" >进行中</Option>
					<Option value="3" >已结束</Option>
				</Select>
			</FormItem>
			<FormItem label="时间">
				<Row style="text-align: center">
					<Col span="11">
					<DatePicker type="date" @on-change="changeSearchTime($event,'startTime')" placeholder="开始时间" ></DatePicker>
					</Col>
					<Col span="2" >-</Col>
					<Col span="11">
					<DatePicker type="date" @on-change="changeSearchTime($event,'endTime')" placeholder="结束时间" ></DatePicker>
					</Col>
				</Row>
			</FormItem>
		</search-bar>
		<!--活动查看/活动配置-->
		<Modal
				title="活动专区配置"
				v-model="formModal"
				width="700"
				class-name="activityManageHeight"
				@on-cancel="popFormClose($event)"
		>
			<Form
					ref="popForm"
					:model="popForm"
					:rules="popFormRules"
					:label-width="125"
			>
				<Card>
					<p slot="title">活动配置</p>
					<FormItem prop="zoneName" label="专区名称">
						<Row>
							<Col span="20">
								<Input :disabled="ableEdit" type="text" v-model="popForm.zoneName"  size="default" placeholder=""></Input>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="展示权重" prop="zoneWeight">
						<Row>
							<Col span="20">
								<InputNumber :disabled="ableEdit" :max="10" :min="1" v-model="popForm.zoneWeight"></InputNumber>
								<span>(输入数字越大则权重值越高，排序越靠前)</span>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="活动时间" prop="activityTime">
						<Row>
							<Col span="20">
								<DatePicker :disabled="ableEdit" type="datetimerange" v-model="popForm.activityTime" placement="bottom" @on-change="changeActivityTime" style="width: 100%" placeholder="选择时间"></DatePicker>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="专区类型" prop="zoneType">
						<Row>
							<Col span="20">
							<Select  :disabled="ableEdit" transfer v-model="popForm.zoneType"  class="w300">
								<Option  :value="1">多类目专区</Option>
								<Option  :value="0">单类目专区</Option>
							</Select>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="专区Banner" prop="homeBanner">
						<Upload :disabled="ableEdit" :maxNum="1" @sPicList="getBannerPic($event)" :is_reset="pic.bannerNum" :sPics="pic.banner"></Upload>
						<Input v-show="false" v-model="popForm.homeBanner" ></Input>
					</FormItem>
					<FormItem label="Banner链接" required>
						<Row>
							<Col span="5">
							<FormItem prop="bannerType">
								<Select  :disabled="ableEdit" placement="bottom" transfer v-model="popForm.bannerType"  class="w300">
									<Option  :value="0">默认</Option>
									<Option  :value="1">H5</Option>
								</Select>
							</FormItem>
							</Col>
							<Col v-if="popForm.bannerType==1" span="16" style="margin-left: 5px">
							<FormItem prop="bannerUrl">
								<Input  :disabled="ableEdit" v-model="popForm.bannerUrl" placeholder="" style="width: 300px"></Input>
							</FormItem>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="分享链接" required>
						<Row>
							<Col span="5">
							<FormItem prop="shareType">
								<Select :disabled="ableEdit" placement="bottom" transfer v-model="popForm.shareType"  class="w300">
									<Option  :value="0">默认</Option>
									<Option  :value="1">H5</Option>
								</Select>
							</FormItem>
							</Col>
							<Col v-if="popForm.shareType==1" span="16" style="margin-left: 5px">
							<FormItem prop="shareUrl">
								<Input :disabled="ableEdit" v-model="popForm.shareUrl" style="width: 300px"></Input>
							</FormItem>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="分享标题" prop="shareTitle">
						<Row>
							<Col span="20">
								<Input :disabled="ableEdit" type="text" v-model="popForm.shareTitle" size="default" ></Input>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="分享摘要" prop="shareSummary"	>
						<Row>
							<Col span="20">
								<Input :disabled="ableEdit" type="textarea" :rows="4" v-model="popForm.shareSummary" ></Input>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="分享图标" prop="shareIcon">
						<Upload :disabled="ableEdit" :maxNum="1" @sPicList="getSharePic($event)" :is_reset="pic.shareIconNum" :sPics="pic.shareIcon"></Upload>
						<Input v-show="false" v-model="popForm.shareIcon" ></Input>
					</FormItem>
					<FormItem label="备注" prop="remark">
						<Row>
							<Col span="20">
							<Input :disabled="ableEdit" type="textarea" :rows="4" v-model="popForm.remark" ></Input>
							</Col>
						</Row>
					</FormItem>
				</Card>
				<Card style="margin-top: 30px;">
					<p slot="title">详情配置</p>
					<FormItem label="专区页Banner" prop="pageBannerUrl">
						<Upload :disabled="ableEdit" :maxNum="1" @sPicList="getPageBannerPic($event)" :is_reset="pic.pageBannerNum" :sPics="pic.pageBanner"></Upload>
						<Input v-show="false" v-model="popForm.pageBannerUrl" ></Input>
					</FormItem>
					<FormItem label="专区页Banner显示" prop="pageBannerShow">
						<i-switch :disabled="ableEdit"  size="large" v-model="popForm.pageBannerShow">
							<span slot="open">ON</span>
							<span slot="close">OFF</span>
						</i-switch>
					</FormItem>
					<FormItem label="描述" prop="pageDesc">
						<Row>
							<Col span="20">
							<Input :disabled="ableEdit" type="textarea" :rows="4" v-model="popForm.pageDesc" ></Input>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="描述展示" prop="pageDescShow">
						<i-switch  :disabled="ableEdit" size="large" v-model="popForm.pageDescShow">
							<span slot="open">ON</span>
							<span slot="close">OFF</span>
						</i-switch>
					</FormItem>
					<FormItem label="推荐商品文案" prop="recommendText">
						<Row>
							<Col span="20">
								<Input  :disabled="ableEdit" type="textarea" :rows="4" v-model="popForm.recommendText" ></Input>
							</Col>
						</Row>
					</FormItem>
					<FormItem label="推荐商品文案显示" prop="recommendTextShow">
						<i-switch  :disabled="ableEdit" size="large" v-model="popForm.recommendTextShow">
							<span slot="open">ON</span>
							<span slot="close">OFF</span>
						</i-switch>
					</FormItem>
				</Card>
			</Form>
			<div slot="footer">
				<Button type="text" @click="popFormClose" style="margin-right: 8px">取消</Button>
				<Button v-if="!ableEdit" type="primary" :loading="loading" @click="popFormSubmit('popForm')">
					<span v-if="!loading">确定</span>
					<span v-else>提交中...</span>
				</Button>
			</div>
		</Modal>
		<!--商品品类管理-->
		<Modal
				title="品类管理"
				v-model="manageModal"
				@on-cancel="manageModalClose"
				width="600"
				class-name="manageHeight"
		>
			<Form >
				<FormItem label="类目排序是否显示" >
					<i-switch   size="large"  v-model="manageIs_show">
						<span slot="open">开</span>
						<span slot="close">关</span>
					</i-switch>
				</FormItem>
			</Form>
			<div style="border-top:1px solid #ccc;height: 10px"></div>
			<div style="margin-bottom: 5px;display: flex;justify-content: space-between" >
				<span>类目排序若显示，是按依次从上往下进行展示</span>
				<Button type="primary" v-if="addIsShow" @click="addCategory('add')">
					<Icon size="15" color="white"  type="plus"></Icon>
				</Button>
			</div>
			<Table border height="300" :columns="manageColumns" :data="manageData"></Table>
			<div slot="footer">
				<Button type="text" @click="manageModalClose" style="margin-right: 8px">取消</Button>
				<Button  type="primary" :loading="loading2" @click="manageModalOk('popForm')">
					<span v-if="!loading2">确定</span>
					<span v-else>提交中...</span>
				</Button>
			</div>
		</Modal>
		<!--addModal-->
		<Modal
				title="品类配置"
				v-model="addModal"
				width="500"
				class-name="addModalHeight"
				@on-cancel="addModalClose('addModal')"
		>

			<Form ref="addModal" :model="addCatalogue" :rules="ruleAddModal" :label-width="120">
				<FormItem label="一级品类" prop="first" required>
					<Select  v-model="addCatalogue.first" @on-change="changeFirstCatalogue($event)" :disabled="!catalogueIsEdit">
						<Option v-for="(item,index) in catalogueData.first" :value="item.id" :key="index">{{item.varietiesName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="二级品类" prop="second" required>
					<Select v-model="addCatalogue.second" @on-change="dayin" transfer :disabled="!catalogueData.second.length>0||!catalogueIsEdit">
						<Option :value="0">全部</Option>
						<Option v-for="(item,index) in catalogueData.second" :value="item.id" :key="index">{{item.varietiesName}}</Option>
					</Select>
				</FormItem>
				<FormItem label="显示所有商品" required>
					<i-switch   size="large"  v-model="addCatalogue.allShow"  :disabled="!catalogueIsEdit">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
			</Form>
			<div slot="footer">
				<Button type="text" @click="addModalClose('addModal')" style="margin-right: 8px">取消</Button>
				<Button  type="primary" :loading="loading3" @click="toAddCatalogue('addModal')" v-if="catalogueIsEdit">
					<span v-if="!loading3">确定</span>
					<span v-else>提交中...</span>
				</Button>
			</div>
		</Modal>
		<!--shoppingManageModal-->
		<shoppingManageModal :shoppingManageModal.sync="shoppingManageModal" :level_one="levelOneToModal" :level_two="levelTwoToModal" :id="curMange.id"></shoppingManageModal>
	</div>

</template>

<script>
	let timeLength=200;
    import Upload from '@/components/common/uploadPic/upload';
    import TablePage from '@components/common/TablePage';
    import searchBar from '@components/common/SearchBar';
    import {formatTimestamp} from '@/util/util';
 	import shoppingManageModal from './shoppingManage';
    let Component = {
        name: 'activityManageIndex',
		components:{
            Upload,
            TablePage,
            searchBar,
            shoppingManageModal
		},
        data () {
            return {
                pic:{
                    banner:[],
					shareIcon:[],
					pageBanner:[],
					bannerNum:1,
					shareIconNum:1,
					pageBannerNum:1
				},//'/manage/images/e187508eb76d9309e91e24e00c8049f1.JPG,/manage/images/5735e0c56edbb375d0d2099b36a126b2.JPG',
                //tabel
                page:{},
				dataList:[],
                columns:[
                    {
                        title: '编号',
                        key: 'id',
                        align:'center',
						width:80,
						fixed:'left'
                    },
                    {
                        title: '专区名称',
                        key: 'zoneName',
                        align:'center',
                        width:350,
                    },
                    {
                        title: '开始时间',
                        key: 'startTime',
						align:'center',
						width:timeLength,
                        render:(h,params)=>{
                            return h('span',{},[formatTimestamp(params.row.startTime)]);
                        }
                    },
                    {
                        title: '结束时间',
                        key: 'endTime',
                        align:'center',
                        width:timeLength,
                        render:(h,params)=>{
                            return h('span',{},[formatTimestamp(params.row.endTime)]);
                        }
                    },
                    {
                        title: '添加时间',
                        key: 'addTime',
                        align:'center',
                        width:timeLength,
                        render:(h,params)=>{
                            return h('span',{},[formatTimestamp(params.row.addTime)]);
                        }
                    },
                    {
                        title: '展示权重',
                        key: 'zoneWeight',
						width:100,
                        align:'center',
                    },
                    {
                        title: '专区状态',
                        key: 'status',
                        align:'center',
						width:120,
						render:(h,params)=>{
                            if(params.row.status==0){
                                return h('span',{},[
                                    '未上架'
                                ]);
                            }
                            if(params.row.status==1){
                                return h('span',{},[
                                    '上架未开始'
                                ]);
                            }
                            if(params.row.status==2){
                                return h('span',{},[
                                    '进行中'
                                ]);
                            }
                            if(params.row.status==3){
                                return h('span',{},[
                                    '已结束'
                                ]);
                            }
                            if(params.row.status==4){
                                return h('span',{},[
                                    '已删除'
                                ]);
                            }
                            if(params.row.status==5){
                                return h('span',{},[
                                    '已下架'
                                ]);
                            }
						}
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 350,
						fixed:'right',
                        render: (h, params) => {
                            if(params.row.status==0){
                                return h('div',{},[
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
										},
										on:{
                                            click:()=>{
                                                this.is_shelf('shelf',params.row.id,1);
											}
										}
									},['上架']),
									h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.ableEdit=false;
                                                this.goEdit(params.row.id,'edit');
                                            }
                                        },
										style:{
                                            marginLeft:'5px'
										},
									},['活动配置']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.catalogueIsEdit=true;
                                                this.curMange.zoneType=params.row.zoneType;
                                                this.curMange.is_add=true;
                                                this.curMange.id=params.row.id;
                                                this.getManageDetail(params.row.id);
                                            }
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                    },['商品/品类管理']),
                                    h('Button',{
                                        props:{
                                            type:'error',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.delActivity('delete',params.row.id,4);
                                            }
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                    },['删除活动']),
								]);
							}
                            if(params.row.status==1||params.row.status==2){
                                return h('div',{},[
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.is_shelf('unshelf',params.row.id,5);
                                            }
                                        }
                                    },['下架']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.ableEdit=true;
												this.goEdit(params.row.id,'edit');
                                            }
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                    },['查看活动']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.catalogueIsEdit=false;
                                                this.curMange.zoneType=params.row.zoneType;
                                                this.curMange.is_add=false;
                                                this.curMange.id=params.row.id;
                                                this.getManageDetail(params.row.id);
                                            }
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                    },['查看商品']),
                                ]);
                            }
                            if(params.row.status==3){
                                return h('div',{},[
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.ableEdit=true;
                                                this.goEdit(params.row.id,'edit');
                                            }
                                        }
                                    },['查看活动']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.catalogueIsEdit=false;
                                                this.curMange.zoneType=params.row.zoneType;
                                                this.curMange.is_add=false;
                                                this.curMange.id=params.row.id;
                                                this.getManageDetail(params.row.id);
                                            }
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                    },['查看商品']),
                                ]);
                            }
                            if(params.row.status==5){
                                return h('div',{},[
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.is_shelf('shelf',params.row.id,1);
                                            }
                                        }
                                    },['上架']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.ableEdit=false;
                                                this.goEdit(params.row.id,'edit');
                                            }
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                    },['活动配置']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.catalogueIsEdit=true;
                                                this.curMange.zoneType=params.row.zoneType;
                                                this.curMange.is_add=true;
                                                this.curMange.id=params.row.id;
                                                this.getManageDetail(params.row.id);
                                            }
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                    },['商品/品类管理']),
                                ]);
                            }
                        }
                    }
                ],
                pageSize:10,
                refresh:false,
				curPage:1,
				addType:'',
				itemId:null,
				//modal
                ableEdit:false,
                formModal:false,
                popFormRules:{
                    zoneName:[
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    activityTime:[
                        { required: true,type:'array', message: '不能为空', trigger: 'change' },
						{  validator(rule, value, callback){
                                if(!value[0]){
                                    callback(new Error('不能为空'));
                                }
                                callback();
                            },trigger:'change'
						}
                    ],
					zoneType:[
                        { required: true, type:'number', message: '不能为空', trigger: 'change' }
                    ],
                    homeBanner:[
                        { required: true, message: '不能为空', trigger: 'change' }
                    ],
                    bannerType:[
                        { required: true,  type:'number', message: '不能为空', trigger: 'change' }
                    ],
					shareType:{ required: true,  type:'number', message: '不能为空', trigger: 'change' },
                    bannerUrl:[
                        {  validator:(rule, value, callback)=>{
								if(this.popForm.bannerType==1&&value==''){
									callback(new Error('不能为空'));
								}
								callback();
                            },trigger:'blur'
                        },
						// {type:'url',message:'请输入正确网址',trigger:'blur'}
                    ],
                    shareUrl:[
                        {  validator:(rule, value, callback)=>{
                                if(this.popForm.shareType==1&&value==''){
                                    callback(new Error('不能为空'));
                                }
                                callback();
                            },trigger:'blur'
                        },
                        // {type:'url',message:'请输入正确网址',trigger:'blur'}
					],
                    shareTitle:{required: true, message: '不能为空', trigger: 'blur'},
                    shareSummary:{required: true, message: '不能为空', trigger: 'blur'},
                    shareIcon: [{ required: true, message: '不能为空', trigger: 'change' }],
                    pageBannerUrl:{ required: true, message: '不能为空', trigger: 'change' },
					remark:{required: false, message: '不能为空', trigger: 'blur'},
                    pageBannerShow:{type:'boolean'},
                    pageDescShow:{type:'boolean'},
                    recommendTextShow:{type:'boolean'},
                    pageDesc:{required:false,trigger:'blur'},
                    zoneWeight:{required:true,trigger:'change',type:'number'},
                    recommendText:{required:false,trigger:'blur'},
				},
                popForm:{
                    zoneName:'',
                    zoneWeight:1,
                    startTime:'',
					endTime:'',
                    zoneType:'',//单类目专区
                    homeBanner:'',//专区banner
                    shareIcon:'',//分享图标
                    pageBannerUrl:"",//专区页banner
                    recommendText:"",//recommendText
                    shareTitle:'',//shareTitle
                    shareSummary:'',//分享摘要
                    shareType:0,//0是默认
                    shareUrl:"",//当上为1的时候需要
                    bannerType:0,//0是默认
                    bannerUrl:'',//当上为1的时候需要
                    pageDesc:'',//描述
                    pageBannerShow:false,
                    pageDescShow:false,
                    recommendTextShow:false,
                    remark:'',
					//无用
                    activityTime:'',
                },
                loading:false,
				//search
                searchShow:false,
				searchFilter:{
                    status:'',
                    searchName:'',
					startTime:'',
					endTime:''
				},
				//manageModal
				manageModal:false,
                manageColumns: [
                    {
                        title: '品类',
                        key: 'name',
						render:(h,params)=>{
                            return h('span',{},[`${params.row.categoryLevel1Name}-${params.row.categoryLevel2Name}`]);
						}
                    },
                    {
                        title: '操作',
                        key: 'age',
						width:250,
						render:(h,params)=>{
                            if(this.catalogueIsEdit){
                                return h('div',{},[
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.getCatalogueDetail(params.row.categoryLevel1,params.row.categoryLevel2,'edit');
                                            }
                                        }
                                    },['编辑']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                        on:{
                                            click:()=>{
                                                this.levelOneToModal=params.row.categoryLevel1;
                                                this.levelTwoToModal=params.row.categoryLevel2;
                                                this.shoppingManageModal=true;
                                                // this.getShoppingManageData(params.row.categoryLevel1,params.row.categoryLevel2);
                                            }
                                        }
                                    },['商品管理']),
                                    h('Button',{
                                        props:{
                                            type:'error',
                                            size:'small'
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                        on:{
                                            click:()=>{
                                                this.delCatalogue(params.row.categoryLevel1,params.row.categoryLevel2);
                                            }
                                        }

                                    },['删除'])
                                ]);
							}else{
                                return h('div',{},[
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        on:{
                                            click:()=>{
                                                this.getCatalogueDetail(params.row.categoryLevel1,params.row.categoryLevel2,'edit');
                                            }
                                        }
                                    },['查看']),
                                    h('Button',{
                                        props:{
                                            type:'primary',
                                            size:'small'
                                        },
                                        style:{
                                            marginLeft:'5px'
                                        },
                                        on:{
                                            click:()=>{
                                                this.levelOneToModal=params.row.categoryLevel1;
                                                this.levelTwoToModal=params.row.categoryLevel2;
                                                this.shoppingManageModal=true;
                                            }
                                        }
                                    },['商品管理']),
								]);
							}


						}

                    },
                ],
                manageData: [],
				manageIs_show:false,
				curMange:{
                    id:null,//用于manageModal的确定 时需要传id,打开商品/品类管理就赋值新的id
					zoneType:null,//用于manageModal的加号是否显示
					is_add:null,//用于判断加号
				},
                loading2:false,
				//addModal
				addModal:false,
				catalogueData:{
                    first:[],
					second:[]
				},
				addCatalogue:{
                    first:'',
					second:'',
                    allShow:false,
				},
                ruleAddModal:{
					first:[
						{required:true,message:'不能为空'}
					],
					second:[
						{required:true,message:'不能为空'}
                    ],
                },
                loading3:false,
				addManageType:'',//增加品类配置的type
				EditLevelTwo:'',//编辑时候用的levelTwo，addCatalogue.second被赋予新值的时候必须是在catalogueData.second的数组获取到之后，因为Option,用新的数组循环之后，v-model绑定的值会变成''，我们在getCatalogueDetail中把EditLevelTwo赋值levelTwo，在changeFirstCatalogue事件中利用addManageType来判断是否需要把addCatalogue.second被赋值于levelTwo,
                EditLevelOne:'',
                catalogueIsEdit:true,
                shoppingManageModal:false,
                levelOneToModal:'',
                levelTwoToModal:'',

			};
        },
		computed:{
            addIsShow(){
                if(this.curMange.is_add){
                    if(this.curMange.zoneType==0&&this.manageData.length>0){
                        return false;
					}else{
                        return true;
					}
				}else{
                    return false;
				}
			}
		},
		methods:{
            dayin(value){
                console.log(this.value);
			},
            //table
            getData(params={}){
                this.$Loading.start();
				this.$http({
					method:'get',
					url:'/zoneGoods/queryActivityZoneList.html',
					params:{
					    pageSize:this.pageSize,
						page:this.curPage,
						...params
					},
				}).then(res=>{
				    console.log(res,'获取数据');
				 	if(res.result){
                        this.$Loading.finish();
						this.dataList=res.dataList;
						this.page=res.pages;
                    }else{
                        this.$Loading.error();
                        this.$Message.error({
                            content: '数据获取失败，请重试'
                        });
					}
                    this.refresh=false;
                });
			},
            handleCurrentChange(cur){
                this.curPage=cur;
                this.getData(this.searchFilter);
			},
			addData(){
                this.loading=true;
				let params={
				    type:this.addType,
					...this.popForm
				};
				if(this.addType=='edit'){
				    params.id=this.itemId;
				}
				params.pageBannerShow=Number(params.pageBannerShow);
				params.pageDescShow=Number(params.pageDescShow);
				params.recommendTextShow=Number(params.recommendTextShow);
				console.log(this.popForm);
				console.log(params,'变化前');
				if(params.homeBanner){
				    if(params.homeBanner.slice(0,5)=='https'){
                        params.homeBanner=params.homeBanner.slice(61,);
                    }else{
                        params.homeBanner=params.homeBanner.slice(60,);
					}
				}
				if(params.pageBannerUrl){
				    if(params.pageBannerUrl.slice(0,5)=='https'){
                        params.pageBannerUrl=params.pageBannerUrl.slice(61,);
                    }else {
                        params.pageBannerUrl = params.pageBannerUrl.slice(60,);
                    }
				}
				if(params.shareIcon){
				    if(params.shareIcon.slice(0,5)=='https'){
                        params.shareIcon=params.shareIcon.slice(61,);
                    }else{
                        params.shareIcon=params.shareIcon.slice(60,);
					}
				}
				// console.log(,'传给后台的');
				console.log(params);
                this.$http({
                    method:'get',
                    url:'/zoneGoods/activityZoneOperate.html',
                    params:params,
                }).then(res=>{
                    console.log(res,'tijiao');
                    if(res.result){
                        this.$Message.success(res.msg);
                        this.curPage=1;
                        this.getData();
                        this.popFormClose();//关闭
                    }else{
                        this.$Message.error(res.msg);
                    }
                    this.loading=false;
                });
			},
            openModal(type){
                this.addType=type;
                this.formModal=true;
            },
            openSearch(){
				this.searchShow=true;
			},
            toRefresh(){
                this.refresh=true;
                this.getData(this.searchFilter);
			},
			is_shelf(type,id,status){
                let params={
                    type,
					id,
                    status,
				};
                this.$http({
                    method:'get',
                    url:'/zoneGoods/activityZoneOperate.html',
                    params:params,
                }).then(res=>{
                    console.log(res);
                    if(res.result){
                        this.$Message.success('提交成功!');
                        this.getData(this.searchFilter);
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
			},
			delActivity(type,id,status){
                let params={
                    type,
                    id,
                    status,
                };
                console.log(params);
                this.$http({
                    method:'get',
                    url	:'/zoneGoods/activityZoneOperate.html',
                    params:params,
                }).then(res=>{
                    console.log(res);
                    if(res.result){
                        this.$Message.success(res.msg);
                        this.getData(this.searchFilter);

                    }else{
                        this.$Message.error(res.msg);
                    }
                });
			},
			goEdit(id,type){
                this.formModal=true;
                this.addType=type;
                this.itemId=id;
                this.getDetail(id,type).then(res=>{
                    if(res.result){
                        let detail=res.activityZone;
						this.popForm={
                            zoneName:detail.zoneName,
                            zoneWeight:detail.zoneWeight,
                            startTime:detail.startTime,
                            endTime:detail.endTime,
                            zoneType:detail.zoneType,//单类目专区
                            homeBanner:'',//专区banner
                            shareIcon:'',//分享图标
                            pageBannerUrl:"",//专区页banner
                            recommendText:detail.recommendText,//recommendText
                            shareTitle:detail.shareTitle,//shareTitle
                            shareSummary:detail.shareSummary,//分享摘要
                            shareType:detail.shareType,//0是默认
                            shareUrl:detail.shareUrl,//当上为1的时候需要
                            bannerType:detail.bannerType,//0是默认
                            bannerUrl:detail.bannerUrl,//当上为1的时候需要
                            pageDesc:detail.pageDesc,//描述
                            pageBannerShow:detail.pageBannerShow==0 ? false :true,
                            pageDescShow:detail.pageDescShow==0 ? false :true,
                            recommendTextShow:detail.recommendTextShow==0 ? false :true,
                            remark:'',
                            //无用
                            activityTime:`${detail.startTime} - ${detail.endTime}`,
						};
						this.pic.banner= res.homeBannerList;
                        this.pic.shareIcon=res.shareIconList;
                        this.pic.pageBanner=res.pagebannerUrlList;
					}else{
                        this.$Message.error({
                            content: res.msg
                        });
					}
				});
			},
			getDetail(id,type){
				return this.$http({
                    method:'get',
                    url:'/zoneGoods/activityZonePage.html',
                    params:{id,type},
                }).then(res=>{
                    return res;
                });
			},
			//modal
            popFormClose(e){
                console.log(e,'关闭modal,看点击遮罩层的时候是否会触发');
                //滚轮变0
				document.getElementsByClassName('activityManageHeight')[0].getElementsByClassName('ivu-modal-body')[0].scrollTop=0;
                this.formModal=false;
                //清除组件图片
                this.pic.bannerNum++;
                this.pic.shareIconNum++;
                this.pic.pageBannerNum++;
                // 以下三行清空popForm
                this.$refs.popForm.resetFields();
                this.popForm.startTime='';
                this.popForm.endTime='';
                //把disable改为false,即关闭不能编辑
				this.ableEdit=false;
            },
            changeActivityTime(value){
                this.popForm.startTime=value[0];
                this.popForm.endTime=value[1];
                console.log(this.popForm);
			},
            popFormSubmit(name){
                this.$refs[name].validate((valid) => {
                    console.log('zhixing');
                    if (valid) {
                        console.log('yhanzheng tongguo ');
                        this.addData();
                        // this.$Message.success('Success!');
                    } else {
                        console.log('yhanzheng butongguo  ');
                        this.$Message.error('请完善信息!');
                    }
                });
			},
			//search
            handleSubmit(){
               /* let params={};
					Object.keys(this.searchFilter).forEach(val=>{
                    if(!this.searchFilter[val]==''){
                        params[val]=this.searchFilter[val]
					}
				});
                console.log(this.searchFilter,params);*/
               this.curPage=1;
               this.getData(this.searchFilter);
			},
            toggleSearch(){
                this.searchShow=false;
			},
            changeSearchTime(value,type){
                this.searchFilter[type]=value;
			},
			//pictrue
            getPageBannerPic(value){
                this.popForm.pageBannerUrl=value;
			},
            getSharePic(value){
                this.popForm.shareIcon=value;
			},
            getBannerPic(value){
                this.popForm.homeBanner=value;
			},
			//manageModal
            getManageDetail(id){
                this.manageModal=true;
                this.$http({
                    method:'get',
                    url:'/zoneGoods/queryZoneCategoryList.html',
                    params:{
						id,
                    },
                }).then(res=>{
                    console.log(res);
                    if(res.result){
                        this.manageData=res.dataList;
                        this.manageIs_show= res.isShow== 0 ? false : true;
                    }else{
                        this.$Loading.error();
                        this.$Message.error({
                            content: res.msg,
                            onClose:()=>{//数据如果获取失败 关闭窗口不让操作
                                this.manageModal=false;
							}
                        });
                    }
                });
			},
			manageModalOk(){
                this.loading2=true;
                let params={
                    id:this.curMange.id,
                    type:'showset'
                };
                if(this.manageIs_show){
                    params.isShow=1;
				}
				this.$http({
					method:'get',
					url:'zoneGoods/activityZoneOperate.html',
					params:params
				}).then(res=>{
				    if(res.result){
                        this.$Message.success({
                            content: res.msg,
                            onClose:()=>{
                                this.manageModal=false;
                            }
                        });
					}else{
                        this.$Message.error({
                            content: res.msg,
                            onClose:()=>{}
                        });
					}
				});
                this.loading2=false;
            },
			manageModalClose(){
                this.manageModal=false;
                this.shoppingManageModal=false;
			},
            addCategory(type){
                this.addModal=true;
                this.addManageType=type;
                this.$http({//这里请求一级类目
                    method:'get',
                    url:'/goods/queryChannelAndSortList.html',
                    params:{}
                }).then(res=>{
                    if(res.result){
                        this.catalogueData.first=res.varietiesList;
                    }else{
                        this.$Message.error({
                            content: `${res.msg},请重试`,
                            onClose:()=>{
                                this.addModal=false;
							}
                        });
                    }
                });
			},
			//addModal
            addModalClose(name){
                this.addModal=false;
                this.$refs[name].resetFields();
                this.catalogueData.second=[];
                this.catalogueData.allShow=false;
            },
            changeFirstCatalogue(id){
                if(id){
                    this.$http({
                        method:'get',
                        url:'/goodsClassification/loadGoodsClassificationList.html',
                        params:{parentId:id}
                    }).then(res=>{
                        if(res.result){
                            this.catalogueData.second=res.dataList;
                            if(this.addManageType=='edit'){
                                this.addCatalogue.second=Number(this.EditLevelTwo);
							}
                        }else{
                            this.$Message.error({
                                content: res.msg,
                                onClose:()=>{
                                    if(this.addManageType=='edit'){
                                        this.addModalClose('addModal');
                                    }
								}
                            });
                        }
                    }).then(()=>{
                        console.log(2);

                    });
				}
			},
            toAddCatalogue(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.loading3=true;
                        let params={
                            level_one:this.addCatalogue.first,
                            level_two:this.addCatalogue.second,
                            type:this.addManageType,
                            id:this.curMange.id
                        };
                        if(this.addCatalogue.allShow){
                            params.allShow=1;
						}
						if(this.addManageType=='edit'){
                            params.old_level_one=this.EditLevelOne;
                            params.old_level_two=this.EditLevelTwo;
                        }
                        this.$http({
                            method:'get',
                            url:'/zoneGoods/zoneCategoryOperate.html',
                            params:params
                        }).then(res=>{
                            if(res.result){
                                this.getManageDetail(this.curMange.id);
                                this.$Message.success({
                                    content: res.msg,
                                    onClose:()=>{this.addModalClose('addModal');}
                                });
                            }else{
                                this.$Message.error({
                                    content: `${res.msg}`,
                                    onClose:()=>{}
                                });
                            }
                            this.loading3=false;
                        });
                    } else {
                        this.$Message.error('请完善信息!');
                    }
                });
			},
            getCatalogueDetail(levelOne,levelTwo,type){
                this.EditLevelTwo=levelTwo;
                this.EditLevelOne=levelOne;
                //以上两个数据用于编辑时的oldlevel，EditLevelTwo还用于赋值
                this.addModal=true;
                this.addManageType=type;
                this.$http({//这里请求一级类目
                    method:'get',
                    url:'/goods/queryChannelAndSortList.html',
                    params:{}
                }).then(res=>{
                    if(res.result){
                        this.catalogueData.first=res.varietiesList;
                        this.addCatalogue.first=Number(levelOne);//这里会触发change事件,这里不需要担心是否this.addCatalogue.first两个都一样导致不会触发change事件，因为每当this.catalogueData.first被赋予新的数组，this.addCatalogue.first就清空了
                    }else{
                        this.$Message.error({
                            content: `${res.msg},请重试`,
                            onClose:()=>{
                                this.addModalClose('addModal');
                            }
                        });
                    }
                });
            },
            delCatalogue(levelOne,levelTwo){
                let params={
                    type:'delete',
					id:this.curMange.id,
                    level_one:levelOne,
                    level_two:levelTwo,
				};
				this.$http({
					method:'get',
					url:'/zoneGoods/zoneCategoryOperate.html',
					params:params
				}).then(res=>{
				    if(res.result){
                        this.$Message.success(res.msg);
                        this.getManageDetail(this.curMange.id);
					}else {
                        this.$Message.error({
                            content: res.msg,
                            onClose:()=>{}
                        });
					}
				});
			},
            //shoppingMangeModal
            getShoppingManageData(level1,level2){}

		},
		created(){
            this.getData();
		},
        mounted() {

        }
    };
    export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' >
	.activityManageHeight{
		.ivu-modal-body{
			height: 480px!important;
			overflow: auto!important;
		}
	}
	.addModalClose{
	/*	.ivu-modal-body{
			height: 480px!important;
			overflow: auto!important;
		}*/
	}
	/*.manageHeight{
		.ivu-modal-body{
			height: 480px!important;
			overflow: auto!important;
		}
	}*/
</style>

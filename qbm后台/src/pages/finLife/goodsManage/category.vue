<template>
	<div class="categoryContainer">
		<div class="header">
			<Button type="success" @click="handleOpenIndexModal">首页类目配置</Button>
		</div>
		<Row class-name="treeHeader">
			<Col span="10">品类名称</Col>
			<Col span="3">状态</Col>
			<Col span="3">操作</Col>	
		</Row>
		<Tree :data="treeData" :load-data="loadData" :render="renderContent"></Tree>

		<Modal
		v-model="modalShow"
		title="添加三级分类"
		class-name="vertical-center-modal">
			<Row :gutter="5">
				<Col span="8" style="text-align: right">父级品类：</Col>
				<Col span="16">{{currentObj.title}}</Col>
			</Row>
			<Row :gutter="5" style="margin-top: 10px;">
				<Col span="8" style="text-align: right"	>品类名称：</Col>
				<Col span="16"><Input size="small" v-model="value" style="width: 160px;"></Input></Col>
			</Row>
			<div slot="footer">
				<Button type="success" size="large" @click="appendCategory">确定</Button>
				<Button size="large" @click="cancel">取消</Button>				
			</div>
		</Modal>
		<Modal
		v-model="indexModalShow"
		title="首页类目显示"
		@on-cancel="handleCancel"
		:mask-closable="false"
		class-name="vertical-center-modal categoryModal">
			<div v-if="indexModalData.configList">
				<CategoryItem
				v-for="(item,index) in indexModalData.configList"
				:key="item.id"
				:levelOne.sync="formIndex.configList[index].levelOne"
				:levelTwo.sync="formIndex.configList[index].levelTwo"
				:levelOneName="item.levelOneName"
				:levelTwoName="item.levelTwoName"
				:showIcon.sync="formIndex.configList[index].showIcon"
				:index="index + 1"
				></CategoryItem>
				<Row :gutter="10">
					<Col span="4" style="text-align: right;">生效时间</Col>
					<Col span="12">
						<DatePicker
						:value="[indexModalData.startTime, indexModalData.endTime]"
						format="yyyy-MM-dd HH:mm:ss" 
						style="width:100%;" type="datetimerange" 
						@on-change="handleDateChange"></DatePicker>
					</Col>
				</Row>
				<Row :gutter="10">
					<Col span="4" style="text-align: right;">自动生效</Col>
					<Col span="8">
						<Select :value="indexModalData.autoValid" @on-change="handleChangeAutoValid" style="width:100px">
							<Option :value="1">是</Option>
							<Option :value="0">否</Option>
						</Select>
					</Col>
				</Row>
			</div>
			
			<div slot="footer">
				<Button size="large" @click="handleCancel">取消</Button>				
				<Button type="success" size="large" @click="handleSubmit">提交</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import CategoryItem from '@components/goodsManage/CategoryItem';

let initalTreeData = [
	{
		title: '商品分类',
		loading: false,
		id: -1,
		nodeNum: 0,
		children: []
	},
];
let Component = {
	name: 'goodsCategory',
	components:{
		CategoryItem,
	},
	data () {
		return {
			treeData: [
				{
					title: '商品分类',
					loading: false,
					expand: true,
					id: -1,
					nodeNum: 0,
					children: []
				},
			],
			value: '',
			currentObj: {},
			modalShow: false,
			indexModalShow: false,
			indexModalData: {},
			formIndex: {
				configList: [],
				startTime: 0,
				endTime: 0,
				autoValid: 0,
				type: 'edit'
			}
		};
	},
	
	methods: {
		//加载子类目函数
		loadData (item, callback) {
			this.setChildren(item, 2, callback);
		},
		// 渲染内容函数
		renderContent (h, { root, node, data }) {
			return h('Row', {
				style: {
					display: 'inline-block',
					width: '100%',
				}
			}, [
				h('Col',{
					props: {
						span: '10'
					},
					style: {
						display: 'inline-block',
						zIndex: '-1',
						height: '36px',
						verticalAlign: 'middle',
						lineHeight: '36px',
						borderBottom: '1px solid #ddd',
						paddingLeft: '10px',
					}
				}, data.title),
				h('Col', {
					props: {
						span: '3'
					},
					style: {
						display: 'inline-block',
						height: '36px',
						verticalAlign: 'middle',
						lineHeight: '36px',
						textAlign: 'left',
						borderBottom: '1px solid #ddd',
						paddingLeft: '10px',
						marginLeft: `-${10 * data.nodeNum}px`
					}
				}, [
					data.nodeNum!=0 && h('i-switch', {
						props:{
							'true-value': 0,
							'false-value': 1,
							value: data.status,
							size: 'large'
						},
						style: {
						},
						on: {
							'on-change': (status)=>{
								
								this.$http({
									method: 'get',
									url: '/goodsClassification/setGoodsClassificationStatus.html',
									params: {
										id: data.id,
									},
								}).then((response) => {
									if (response.result) {
										this.$Message.success(response.msg);
									}else {
										this.$Message.error(response.msg);
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
				]),
				h('Col', {
					props: {
						span: '3'
					},
					style: {
						display: 'inline-block',
						height: '36px',
						verticalAlign: 'middle',
						lineHeight: '36px',
						textAlign: 'left',
						borderBottom: '1px solid #ddd',
						paddingLeft: '10px',
					}
				}, [
					data.nodeNum==2 && h('Button', {
						props:{
							size: 'small',
							type: 'success'
						},
						style: {
						},
						on: {
							click: () => {
								this.currentObj = {...data};
								this.modalShow = true;
							}
						}
					},'添加三级分类')
				])
			]);
		},
		// 选择时间
		handleDateChange(value) {
			console.log(value);
			this.formIndex.startTime = new Date(value[0]).getTime() / 1000;
			this.formIndex.endTime = new Date(value[1]).getTime() / 1000;
		},
		// 打开首页品类配置弹窗
		handleOpenIndexModal(){
			this.$http({
				method: 'get',
				url: '/homeLmConfig/homeLmConfigPage.html',
				params: {},
			}).then((response) => {
				if (response.result) {
					this.$Message.success(response.msg);
					this.indexModalData = response;
					this.indexModalData = {
						...this.indexModalData,
						startTime: this.$util.formatTimestamp(this.indexModalData.configList[0].startTime),
						endTime: this.$util.formatTimestamp(this.indexModalData.configList[0].endTime),
						autoValid: this.indexModalData.configList[0].autoValid
					};
					this.formIndex.configList = response.configList.map(item=>{
						return {
							levelOne: item.levelOne,
							levelTwo: item.levelTwo,
							showIcon: [{uri: item.showIcon}],
							id: item.id
						};
					});
					this.formIndex.startTime = this.indexModalData.configList[0].startTime;
					this.formIndex.endTime = this.indexModalData.configList[0].endTime;
					this.formIndex.autoValid = this.indexModalData.configList[0].autoValid;
					setTimeout( () => {
						console.log(this.formIndex);
						this.indexModalShow = true;	
					}, 100);
				}else {
					this.$Message.error(response.msg);
					return false;
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		// 提交首页品类
		handleSubmit() {
			console.log(this.formIndex);
		},
		// 关闭品类弹窗
		handleCancel() {
			this.indexModalShow = false;
			setTimeout( () => {
				this.indexModalData = {};
			}, 500);			
		},
		// 添加品类
		appendCategory (data){
			if (this.value == '') {
				this.$Message.error('请填写类目名称');
				return false;
			}
			this.$http({
				method: 'get',
				url: '/goodsClassification/goodsClassificationOperate.html',
				params: {
					parentId: this.currentObj.id,
					varietiesName: this.value,
					type: 'add'
				},
			}).then((response) => {
				if (response.result) {
					this.$Message.success(response.msg);
					this.value = '';
					this.modalShow = false;
					this.setChildren(this.currentObj);
				}else {
					this.$Message.error(response.msg);
					return false;
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		// 选择是否自动
		handleChangeAutoValid(value){
			this.formIndex.autoValid = value;
		},
		// 设置添加的二级类目的子类
		setChildren (data, model = 1, callback) {
			this.$http({
				method: 'get',
				url: '/goodsClassification/loadGoodsClassificationList.html',
				params: {
					parentId: data.id,
					flag: 0
				},
			}).then((response) => {
				if (response.result) {
					let treeData = response.dataList;
					if (treeData.length==0) {
						this.$Message.error('无子类目');
						this.$set(data, 'loading', false);
						return false;
					}
					treeData = treeData.map(arri =>{
						if (data.nodeNum < 2) {
							return arri = {
								...arri,
								nodeNum: data.nodeNum + 1,
								title: arri.varietiesName,
								loading: false,
								children: []
							};
						}else {
							return arri = {
								...arri,
								nodeNum: data.nodeNum + 1,
								title: arri.varietiesName,
								children: []
							};
						}
					});
					if (model == 1) {
						this.$set(data, 'children', treeData);
					} else {
						callback(treeData);
					}
				}else {
					 this.$Message.error(response.msg);
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		// 关闭添加弹窗
		cancel() {
			this.value = '';
			this.modalShow = false;
		}
	},
	mounted() {
		this.$nextTick( () => {
			this.setChildren(this.treeData[0]);
		});
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
.categoryContainer {
	.ivu-col {
		font-size: 16px;
	}
	.header {
		padding: 10px 0;
	}
	.treeHeader {
		.ivu-col {
			background: #ddd;
			padding: 10px 0;
			padding-left: 30px;
		}
	}
	.ivu-tree-arrow {
		height: 24px;
		vertical-align: middle;
		margin-top: -20px;
	}
}
.categoryModal {
	.ivu-modal {
		width: 660px!important;
	}
	.ivu-col {
		height: 50px;
		line-height: 50px;
	}
}
</style>

<template>
    <div>
        <Modal
            title="商品规格"
            :value="isShow"
            width="860"
            :mask-closable = 'false'
            @on-cancel="cancel()"
            class-name="vertical-center-modal customHeight"
            >
            <Row>
                <Col span="6">
                    <Form :model="formItem" :label-width="90">
                        <FormItem label="当前库存">
                            <Input v-model="formItem.sumStock" style="width: 100px;" :readonly= 'true'></Input>
                        </FormItem>
                    </Form>
                </Col>
                <Col span="6" style="line-height: 32px;">
                    <span v-if="showAvailableStock">用户前台显示总库存：{{availableStock}}</span>&nbsp;
                </Col>
                <Col span="12">
                    <Button type="primary" icon="android-add" style="float:right;" v-if="addBtnShow" @click="addShoppingSize()">新增</Button>
                </Col>
            </Row>

            <Table border :columns="pageType=='view' ? columns2 :columns1" :data="tableData"></Table>

            <div slot="footer">
                <Button type="text" @click="cancel()" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submit()">确定</Button>
            </div>
        </Modal>

        <!--修改、编辑-->
        <Modal
            v-model="amendSizeModal"
            title="商品规格设置"
            width="560"
            :mask-closable='false'
            @on-cancel="closeAmendSizeModal()"
            class-name="vertical-center-modal"
        >
            <Form
                    ref="amendSizeModal"
                    :model="amendSizeModalData"
                    :label-width="120"
                    :rules="amendSizeModalRules"
            >
                <FormItem label="商品型号" prop="goodsModel">
                    <Input type="text" class="w200" v-model="amendSizeModalData.goodsModel"></Input>
                </FormItem>
                <FormItem label="商品颜色" prop="goodsColour">
                    <Input type="text" class="w200" v-model="amendSizeModalData.goodsColour"></Input>
                </FormItem>
                <FormItem label="商品编号" prop="goodsNumber">
                    <Input type="text" class="w200" v-model="amendSizeModalData.goodsNumber"></Input>
                </FormItem>
                <FormItem label="数量" prop="stock">
                    <Input type="text" class="w200" v-model="amendSizeModalData.stock"></Input>
                </FormItem>
            </Form>

            <div slot="footer">
                <Button type="text" @click="closeAmendSizeModal()" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submitAmendSizeModal()" >确定</Button>
            </div>
        </Modal>


        <!--<specification
            :isShow.sync="specificationPop"
            :dataId.sync="dataId"
            :goodsId.sync="goodsId"
			:pageType1.sync="pageType1"
            @getSumStock="getCurrentSumStock()"
            @getDataList="getDate()"
            ></specification>-->
    </div>
</template>
<script>
import specification from './specification';

let Component = {
    components: {
		specification,
	},
    props: {
		isShow: {
            type: Boolean,
            default: false
        },
        goodsId: {
			type: [Number, String],
			default: ''
        },
        pageType: {
			type: [Number, String],
			default: ''
        },
    },
    data () {
        return {
            specificationPop: false,
            dataId: 0,
            pageType1: '',
            formItem:{
                sumStock:'',
            },
            availableStock: '',
            addBtnShow: true,
            showAvailableStock: false,
            columns1: [
                {
                    title: '型号',
                    key: 'goodsModel'
                },
                {
                    title: '颜色',
                    key: 'goodsColour'
                },
                {
                    title: '数量',
                    key: 'stock'
                },
                {
                    title: '操作',
                    width: 156,
                    key: 'action',
                    render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    style: {
                                        margin: '0 5px 0 0'
                                    },
                                    props: {
                                        type: 'primary',
                                        icon: 'compose',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.editShoppingSize(params.row.id);
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
                                            this.delShoppingSize(params.row.id);
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
                }
            ],
            columns2: [
                {
                    title: '型号',
                    key: 'goodsModel'
                },
                {
                    title: '颜色',
                    key: 'goodsColour'
                },
                {
                    title: '数量',
                    key: 'stock'
                },
                {
                    title: '是否启用',
                    render: (h,params) => {
                        return h('span',{},[
                            h('i-switch',{
                                props: {
                                    'true-value': 0,
                                    'false-value': 1,
                                    value: params.row.isClose
                                },
                                on: {
                                    'on-change': (status)=>{
                                        this.changeStatus(status,params.row.id);
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
                },
                {
                    title: '操作',
                    width: 156,
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                style: {
                                    margin: '0 5px 0 0'
                                },
                                props: {
                                    type: 'primary',
                                    icon: 'compose',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.editShoppingSize(params.row.id);
                                    }
                                }
                            },'编辑'),
                        ]);
                    }
                }
            ],
            tableData: [],
            //amendSizeModal
            amendSizeModal:false,
            amendSizeModalData:{
                goodsModel: '',
                goodsColour: '',
                goodsNumber: '',
                stock: '',
            },
            amendSizeModalRules:{
                goodsModel:{required:true,message:'不能为空'},
                goodsColour:{required:true,message:'不能为空'},
                goodsNumber:{required:true,message:'不能为空'},
                stock:{required:true,message:'不能为空'},
            },
            amendSizeType:'',
            curAmendSizeId:'',//以上两个用于提交时候

        };
    },
    created: function () {

	},
    methods: {
        changeStatus(status,id){
            this.$http({
                url:'goodsSpecification/updateGoodsSpec.html',
                method:'get',
                params:{
                    id,
                    isClose:status
                }
            }).then(res=>{
                if(res.result){
                    this.$Message.success(res.msg);
                    this.getDate();
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        //表格数据
        getDate(){
            //数据请求
            return this.$http({
                method: 'get',
                url: '/goodsSpecification/queryGoodsSpecList.html',
                params: {
                    'goodsId': this.goodsId
                },
            }).then((response) => {
                console.log(response);
                if(response.result){
                    console.log('数据加载成功！');
                    this.tableData = response.dataList;//数据列表
                }else{
                    this.$Message.error({
                        content: '数据获取失败，请重试'
                    });
                }
            });
        },
        //获取当前库存及用户前台显示总库存
        getCurrentSumStock () {
            //数据请求
            return this.$http({
                method: 'get',
                url: '/goodsSpecification/getCurrentSumStock.html',
                params: {
                    'id': this.goodsId
                },
            }).then((response) => {
                if(response.result){
                    this.formItem.sumStock = response.sumStock;//当前库存
                    this.availableStock = response.availableStock;//用户前台显示总库存
                }else{
                    this.$Message.error({
                        content: '数据获取失败，请重试'
                    });
                }
            });
        },
        addSpecificationPop() {
            this.specificationPop = !this.specificationPop;
        },
        //商品规格设置
        specification(id,goodsId,pageType) {
            //console.log(id,pageType,goodsId);
            this.dataId = id;
            this.goodsId = goodsId;
            this.pageType1 = pageType;
            this.addSpecificationPop();
        },
        //增加商品规格

        delFun (id,goodsId,pageType) {
            console.log(id,pageType,goodsId);
        },
        //提交
        submit () {
            this.$http({
                url:'goodsSpecification/specCloseAllUnshelf.html',
                method:'get',
                params:{
                    goodsId:this.goodsId
                }
            }).then(res=>{
                if(res.result){
                    this.$Message.success({
                        content:res.msg,
                        onClose:()=>{
                            this.cancel();
                        }
                    });
                }else{
                    this.$Message.error(res.msg);
                }
            });
            console.log('确定');
        },
        //取消
        cancel () {
            //this.$refs["goodsForm"].resetFields();
            this.$emit('update:goodsId', 0);
            this.$emit('update:isShow',false);
            this.$emit('togglePopup');
            setTimeout(() => {
                this.$emit('update:pageType', '');
            }, 200);
        },
        //AmendSizeModal
        addShoppingSize () {
            this.amendSizeModal=true;
            this.amendSizeType='add';
        },
        closeAmendSizeModal(){
            this.amendSizeModal=false;
            this.$refs.amendSizeModal.resetFields();
        },
        submitAmendSizeModal(){
            this.$refs.amendSizeModal.validate((valid) => {
                if (valid) {
                    let params={
                        type:this.amendSizeType,
                        goodsId:this.goodsId,
                        ...this.amendSizeModalData,
                    };
                    if(this.amendSizeType=='edit'){
                        params.id=this.curAmendSizeId;
                    }
                    this.$http({
                        url:'goodsSpecification/goodsSpecificationOperate.html',
                        method:'get',
                        params
                    }).then(res=>{
                        log(res);
                        if(res.result){
                            this.$Message.success({
                                content:res.msg,
                                onClose:()=>{
                                    this.closeAmendSizeModal();
                                }
                            });
                            let that=this;
                            async function f() {
                                await that.getDate();
                                await that.getCurrentSumStock();
                                return ;
                            }
                            f();
                        }else{
                            this.$Message.error(res.msg);
                        }
                    });
                } else {
                    this.$Message.error('请填写完整信息!');
                }
            });
        },
        editShoppingSize(id){
            this.amendSizeType='edit';//提交的时候用
            this.curAmendSizeId=id;
            this.$http({
                url:'goodsSpecification/goodsSpecificationPage.html',
                method:'get',
                params:{
                    type:'edit',
                    id
                }
            }).then(res=>{
                if(res.result){
                    for(let key in this.amendSizeModalData){
                        if(res.goodsSpecification[key]){
                            this.amendSizeModalData[key]=res.goodsSpecification[key].toString();
                        }
                    }
                    this.amendSizeModal=true;
                }else {
                    this.$Mesage.error(res.msg);
                }
            });
        },
        delShoppingSize(id){
            this.$http({
                url:'goodsSpecification/goodsSpecificationOperate.html',
                method:'get',
                params:{
                    type:'delete',
                    id,
                    goodsId:this.goodsId
                }
            }).then(res=>{
                if(res.result){
                    let that=this;
                    async function f() {
                        await that.getDate();
                        await that.getCurrentSumStock();
                        return ;
                    }
                    f();
                    this.$Message.success({
                        content:res.msg,
                    });
                }else {
                    this.$Message.error(res.msg);
                }
            });
        }
    },
    watch: {
        isShow(val, oldv){
			if(this.goodsId != 0 && this.pageType !='' && val){
                console.log('goodsId=' + this.goodsId);
                console.log('pageType=' + this.pageType);

                if(this.pageType == 'view') {
                    this.addBtnShow = false; //查看时，隐藏添加按钮
                    this.showAvailableStock = true; //查看时，显示用户前台显示总库存
                    //this.submitBtn = false; //查看时，隐藏提交按钮
                }
                this.getDate();//重新加载数据
                setTimeout(() => {
                    this.getCurrentSumStock();
                }, 200);
            }
		},
    },
};
export default Component;
</script>
<style lang='scss' scoped>
	.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
    }
    .customHeight .ivu-modal-body {
		height: 400px;
		overflow: auto;
	}
    .w200{
        width: 200px;
    }
</style>



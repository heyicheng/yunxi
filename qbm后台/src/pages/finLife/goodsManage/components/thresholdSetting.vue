<template>
    <div>
        <Modal
            title="商品门槛"
            :value="isShow"
            width="960"
            :mask-closable='false'
            @on-cancel="cancel()"
            class-name="vertical-center-modal customHeight"
            >
            <Row>
                <Col span="12">
                    <Form :model="formItem" :label-width="90">
                        <FormItem label="商品收益率">
                            <Input v-model="formItem.goodsProfitRate" style="width: 80px;" :readonly="tableData.length>0 ? true :false">
                                <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Form>
                </Col>
                <Col span="12">
                    <Button type="primary" icon="android-add" style="float:right;" v-if="addBtn" @click="addThreshold()">新增</Button>
                </Col>
            </Row>

            <Table border :columns="columns" :data="tableData"></Table>

            <div slot="footer">
                <Button type="text" @click="cancel()" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submit()" v-if="submitBtn">确定</Button>
            </div>
        </Modal>
        <!--新增设置-->
        <Modal
                title="商品门槛设置"
                :value="thresholdPop"
                width="560"
                :mask-closable='false'
                @on-cancel="settingCancel"
                class-name="vertical-center-modal"
        >
            <Form
                    ref="thresholdForm"
                    :model="thresholdForm"
                    :label-width="120"
                    :rules="formRules"
            >
                <Row>
                    <Col span="12">
                        <FormItem label="投资期限" prop="tenderLimit" >
                            <Input type="text" class="w100" v-model="thresholdForm.tenderLimit" :readonly="pageType=='view' ? true : false">
                            <span slot="append">个月</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="项目年化" prop="baseApr" >
                            <Input type="text" class="w100" v-model="thresholdForm.baseApr" :readonly="pageType=='view' ? true : false">
                            <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品收益率" >
                            <Input type="text" class="w100" v-model="formItem.goodsProfitRate" :readonly="true">
                            <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="现金收益率" prop="moneyProfitRate">
                            <Input type="text" class="w100" v-model="moneyProfitRate" :readonly="true">
                            <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem label="投资本金" prop="tenderAccount">
                            <Input type="text" class="w100" v-model="thresholdForm.tenderAccount" :readonly="pageType=='view' ? true : false">
                            <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="13" style="line-height: 32px;">
                        (建议投资本金：<span id="suggestTenderAccount">{{tenderAccount}}</span>元)
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品收益" prop="shoppingProfitRate">
                            <Input type="text" class="w100" v-model="thresholdForm.shoppingProfitRate" :readonly="true">
                            <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="现金收益" prop="moneyProfit">
                            <Input type="text" class="w100" v-model="moneyProfit" :readonly="true">
                            <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品进货价" prop="platPurchasePrice">
                            <Input type="text" class="w100" v-model="thresholdForm.platPurchasePrice" :readonly="true">
                            <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="当前利润" prop="lirun">
                            <Input type="text" class="w100" v-model="thresholdForm.lirun" :readonly="true">
                            <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="settingCancel()" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submitSetting()" v-if="pageType=='view' ? false :true">确定</Button>
            </div>
        </Modal>
        <!-- <threshold
             :isShow.sync="thresholdPop"
             ></threshold>-->
    </div>
</template>

<script>
import threshold from './threshold';

let Component = {
    components: {
		threshold,
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
        goodsWorth: {
			type: [Number, String],
			default: ''
        },
        pageType: {
			type: [Number, String],
			default: ''
        },
        shoppingPrice:{

        }
    },
    computed:{
        //现金收益率 = 项目基础年化 - 商品收益率
        moneyProfitRate(){
            let [a,b]=[Number(this.thresholdForm.baseApr),Number(this.formItem.goodsProfitRate)];
            if(a<b){
                return '';
            }else{
                return a-b;
            }
        },
        //计算建议投资本金  投资本金 = 商品售价  / （商品收益率 * 投资期限/12）5*12/0.*1   1*12/(0.1*2)
        tenderAccount(){
            if(this.thresholdForm.tenderLimit){
                return  parseInt(Number(this.shoppingPrice)/(Number(this.formItem.goodsProfitRate)/100*Number(this.thresholdForm.tenderLimit)/12));
            }else{
                return '';
            }
        },
        //现金收益计算 现金收益 = 投资本金 * 现金收益率 * 投资期限/12
        moneyProfit(){
            if(this.thresholdForm.tenderAccount&&this.moneyProfitRate&&this.thresholdForm.tenderLimit) {
                return (Number(this.thresholdForm.tenderAccount) * Number(this.moneyProfitRate) /100 * Number(this.thresholdForm.tenderLimit) / 12).toFixed(2);
            }else{
                return '';
            }
        }

    },
    data () {
        return {
            currentSettingId:'',
            settingType:'',//增加门槛的类型
            formRules:{
                baseApr:[
                    {  validator:(rule, value, callback)=>{
                        log(this.moneyProfitRate);
                            if(this.moneyProfitRate==''){
                                callback(new Error('项目年化须大于商品收益率'));
                            }
                            callback();
                        },trigger:'blur'
                    }
                ],
                tenderAccount:[{validator(rule,value,callback){callback();}}],
                lirun:[{validator(rule,value,callback){callback();}}],
                platPurchasePrice:[{validator(rule,value,callback){callback();}}],
                moneyProfit:[{validator(rule,value,callback){callback();}}],
                moneyProfitRate:[{validator(rule,value,callback){callback();}}],
                shoppingProfitRate:[{validator(rule,value,callback){callback();}}]
            },
            formItem:{
                goodsProfitRate:'',
            },
            addBtn: true,
            submitBtn: true,
            thresholdPop: false,
            columns: [
                {
                    title: '投资期限',
                    key: 'tenderLimit',
                    render: (h, params) =>{
						return h('span', {}, params.row.tenderLimit+'个月');
					},
                },
                {
                    title: '项目基础年化',
                    key: 'baseApr',
                    render: (h, params) =>{
						return h('span', {}, params.row.baseApr+'%');
					},
                },
                {
                    title: '现金收益率',
                    key: 'moneyProfitRate',
                    render: (h, params) =>{
						return h('span', {}, params.row.moneyProfitRate+'%');
					},
                },
                {
                    title: '投资本金(元)',
                    key: 'tenderAccount'
                },
                {
                    title: '现金收益(元)',
                    key: 'moneyProfit'
                },
                {
                    title: '前台展示',
                    render: (h,params) => {
						return h('span',{},[
							h('i-switch',{
								props: {
									'true-value': 1,
									'false-value': 0,
									value: params.row.homeShow
								},
								on: {
									'on-change': (status)=>{
                                        this.thresShowSet(params.row.id,params.row.goodsId,'home',status);
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
                    title: '默认展示',
                    width: 100,
                    render: (h,params) => {
						return h('span',{},[
							h('i-switch',{
								props: {
									'true-value': 1,
									'false-value': 0,
									value: params.row.isShow
								},
								on: {
									'on-change': (status)=>{
										this.thresShowSet(params.row.id,params.row.goodsId,'default',status);
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
                        if(this.pageType == 'view'){
                            return h('div', [
                                h('Button', {
                                    style: {
                                        margin: '0 5px 0 0'
                                    },
                                    props: {
                                        type: 'success',
                                        icon: 'android-open',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.getSettingDetail(params.row.id);
                                        }
                                    }
                                },'查看')
                            ]);
                        }else{
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
                                            this.settingType='edit';
                                            this.currentSettingId=params.row.id;
                                            this.getSettingDetail(params.row.id);
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
                                        },
                                    }, '删除')
                                ])
                            ]);
                        }
					}
                }
            ],
            tableData: [],
            thresholdForm: {
                tenderLimit: '',
                baseApr: '',
                goodsProfitRate: '',
                shoppingProfitRate: '',
                lirun: '',
                platPurchasePrice:"",
                tenderAccount:''
            }
        };
    },
    methods: {
        submitSetting(){
            let params={
                tenderLimit:this.thresholdForm.tenderLimit,
                baseApr:this.thresholdForm.baseApr,
                goodsProfitRate:this.formItem.goodsProfitRate,
                moneyProfitRate:this.moneyProfitRate,
                tenderAccount:this.tenderAccount,
                moneyProfit:this.moneyProfit,
                goodsId:this.goodsId,
                type:this.settingType,
                isShow:0
            };
            if(this.settingType=='edit'){
                params.id=this.currentSettingId;
            }
            this.$http({
                method:'get',
                url:'goodsThreshold/goodsThresholdOperate.html',
                params:params
            }).then(res=>{
                log(res);
                if(res.result){
                    this.thresholdPop=false;
                    this.settingCancel();
                    this.getDate();
                }else {
                    this.$Message.error(res.msg);
                }
            });
        },
        getSettingList(type){
            let params={
                type,
                goodsId:this.goodsId
            };
            this.$http({
                url:'goodsThreshold/goodsThresholdPage.html',
                method:'get',
                params:params
            }).then(res=>{
                log(res,'获取门槛设置');
                if(res.result){
                    this.thresholdForm.lirun=res.currentProfit;
                    this.thresholdForm.platPurchasePrice=res.platPurchasePrice;
                    this.thresholdForm.shoppingProfitRate=res.goodsWorth;
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        getSettingDetail(id){
            this.thresholdPop=true;
            this.$http({
                method:'get',
                url:'goodsThreshold/goodsThresholdPage.html',
                params:{
                    id,
                    goodsId:this.goodsId,
                    type:'edit'
                }
            }).then(res=>{
                log(res);
                if(res.result){
                    this.thresholdForm.lirun=res.currentProfit;
                    this.thresholdForm.platPurchasePrice=res.platPurchasePrice;
                    this.thresholdForm.shoppingProfitRate=res.goodsWorth;
                    this.formItem.goodsProfitRate=res.goodsThreshold.goodsProfitRate;
                    this.thresholdForm.tenderAccount=res.goodsThreshold.tenderAccount;
                    this.thresholdForm.tenderLimit=res.goodsThreshold.tenderLimit;
                    this.thresholdForm.baseApr=res.goodsThreshold.baseApr;

                }else{
                    this.$Message.error(res.msg);
                }
            });
        },
        getDate(){
            this.$http({
                method: 'get',
                url: '/goodsThreshold/queryGoodsThreshold.html',
                params: {
                    'goodsId': this.goodsId,
                    'pageType': this.pageType
                },
            }).then((response) => {
                this.$Loading.finish();
                if(response.result){
                    this.tableData = response.dataList;//数据列表
                    this.formItem = response;
                    if(response.dataList.length > 0){
                    }
                }else{
                    this.$Loading.error();
                    this.$Message.error({
                        content: '数据获取失败，请重试'
                    });
                }
            });
        },
        thresShowSet(id,goodsId,type,status){
            this.$http({
                method: 'get',
                url: '/goodsThreshold/thresShowSet.html',
                params: {
                    'id': id,
                    'goodsId': goodsId,
                    'type': type,
                    'status': status
                },
            }).then((response) => {
                if (response.result) {
                    this.$Message.success(response.msg);
                }else {
                    this.$Message.error(response.msg);
                }
                this.getDate();//重新请求数据
            }).catch((err) => {
                this.$Message.error(err.msg);
            });
        },
        //添加商品门槛
        addThreshold() {
            if(this.formItem.goodsProfitRate == '' || this.formItem.goodsProfitRate == undefined){
                this.$Message.warning('请先设置商品收益率');
            }else if(this.formItem.goodsProfitRate == 0){
                this.$Message.warning('商品收益率不能为0');
            }else{
                this.settingType='add';
                this.thresholdPop = true;
                this.getSettingList('add');
            }
        },
        delFun(id){
            this.$http({
                url:'goodsThreshold/goodsThresholdOperate.html',
                method:'get',
                params:{
                    type:'delete',
                    id,
                    goodsId:this.goodsId
                }
            }).then(res=>{
                log(res);
                if(res.result){
                    this.$Message.success(res.msg);
                    this.getDate();
                }else{
                    this.$Message.error(res.msg);
                }
            });
            // log('lll')
        },
        //提交
        submit () {
            this.$http({
                url:'goodsThreshold/thresSubmit.html',
                method:'get',
                params:{
                    goodsProfitRate:this.formItem.goodsProfitRate,
                    goodsId:this.goodsId,
                }
            }).then(res=>{
                log(res);
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
            this.$emit('update:goodsId', 0);
            this.$emit('update:pageType', '');
            this.$emit('update:isShow',false);
            this.addBtn = true;
        },
        settingCancel(){
            this.thresholdPop=false;
            this.$refs['thresholdForm'].resetFields();
        }
    },
    watch: {
        isShow(val, oldv){
			if(this.goodsId != 0 && this.pageType !='' && val){
                console.log('goodsId=' + this.goodsId);
                console.log('pageType=' + this.pageType);
                if(this.pageType == 'view') {
                    this.addBtn = false; //查看时，隐藏添加按钮
                    this.submitBtn = false; //查看时，隐藏提交按钮
                }
                this.getDate();//重新加载数据
            }
		},
    },
};
export default Component;
</script>
<style lang='scss'>
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
</style>



<template>
	<Modal
        title="商品信息"
		:value="isShow"
		width="860"
        :mask-closable='false'
        @on-cancel="goodsFormClose()"
		class-name="vertical-center-modal goodsFormHeight"
		>
		<Form
            ref="goodsForm"
            :model="goodsForm"
            :label-width="120"
            :rules="goodsFormRules"
            >
            <Card :dis-hover="true" title="商品属性" icon="ios-keypad">
                <FormItem label="商品名称" prop="goodsName">
                    <Input type="text" placeholder="" v-model="goodsForm.goodsName" class="w300"></Input>
                </FormItem>
                <FormItem label="商品描述" prop="goodsDesc">
                    <Input type="textarea" placeholder="" v-model="goodsForm.goodsDesc" class="w300"></Input>
                </FormItem>
                <FormItem label="渠道来源" prop="channelId">
                    <Select v-model="goodsForm.channelId" clearable class="w300" @on-change="loadChannelConfigFun">
                        <Option v-for="item in channelIdList" :value="item.id" :key="item.id">{{ item.channelName }}</Option>
                    </Select>
                </FormItem>
                <CategorySelect :margin0="true"
                    :levelOne.sync="goodsForm.goodsLevelOneVarieties"
                    :levelTwo.sync="goodsForm.goodsLevelTwoVarieties"
                    :levelThree.sync="goodsForm.goodsLevelThreeVarieties"
                    ></CategorySelect>
                <FormItem prop="goodsLevelOneVarieties">
                    <Input  v-show="false" placeholder="" v-model="goodsForm.goodsLevelOneVarieties" class="w300"></Input>
                </FormItem>
                <FormItem label="产品图示(列表页)" prop="listPagePic">
					<upload :is_reset="listPagePicList.is_reset" :maxNum="listPagePicList.maxNum" :sPics="listPagePicList.sPics" @sPicList="getListPagePicList($event)"></upload>
					<Input v-show="false" v-model="goodsForm.listPagePic" ></Input>
				</FormItem>
                <FormItem label="产品图示(详情页)" prop="detailPagePic">
                    <upload :is_reset="detailPagePicList.is_reset" :maxNum="detailPagePicList.maxNum" :sPics="detailPagePicList.sPics" @sPicList="getdetailPagePicList($event)"></upload>
					<Input v-show="false" v-model="goodsForm.detailPagePic" ></Input>
				</FormItem>
                <FormItem label="市场价" prop="marketPrice">
                    <Input type="number" placeholder="" v-model="goodsForm.marketPrice" class="w100">
                        <span slot="append">元</span>
                    </Input>
                </FormItem>
                <FormItem label="商品售价" prop="goodsWorth">
                    <Input type="number" placeholder="" v-model="goodsForm.goodsWorth" class="w100">
                        <span slot="append">元</span>
                    </Input>
                </FormItem>
                <FormItem label="平台进货价" prop="platPurchasePrice">
                        <Input type="number" placeholder="" v-model="goodsForm.platPurchasePrice" class="w100">
                        <span slot="append">元</span>
                    </Input>
                </FormItem>
                <div @click="dayin">cetshi</div>
                <FormItem label="售罄自动下架" prop="isAutomatic" required>
                    <RadioGroup v-model="goodsForm.isAutomatic">
                        <Radio :label="1">
                            <span>是</span>
                        </Radio>
                        <Radio :label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
				</FormItem>
            </Card>

            <Card :dis-hover="true" title="商品参数" icon="ios-keypad" style="margin-top:10px;">
                <Row>
                    <Col span="12">
                        <FormItem label="品牌国籍" prop="brandCradle">
                            <Input type="text" placeholder="" v-model="goodsForm.brandCradle" class="w200"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="类别" prop="cateName">
                            <Input type="text" placeholder="" v-model="goodsForm.cateName" class="w200"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="英文名" prop="enName">
                            <Input type="text" placeholder="" v-model="goodsForm.enName" class="w200"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="归属" prop="parentCompany">
                            <Input type="text" placeholder="" v-model="goodsForm.parentCompany" class="w200"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="规格" prop="spec">
                            <Input type="text" placeholder="" v-model="goodsForm.spec" class="w200"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="适用人群" prop="useForCrowd">
                            <Input type="text" placeholder="" v-model="goodsForm.useForCrowd" class="w200"></Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="适用部位" prop="useForPlace">
                            <Input type="text" placeholder="" v-model="goodsForm.useForPlace" class="w200"></Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="适用肤质" prop="useForSkin">
                            <Input type="text" placeholder="" v-model="goodsForm.useForSkin" class="w200"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Card>

            <Card :dis-hover="true" title="商品介绍" icon="ios-keypad" style="margin-top:10px;">
                <FormItem :label-width="1"  prop="goodsDetail">
                    <quill-editor ref="QuillEditor1" v-model="goodsForm.goodsDetail" :options="editorOption1"></quill-editor>
                    <Input v-model="goodsForm.goodsDetail" v-show="false"></Input>
                </FormItem>
            </Card>
            <Card :dis-hover="true" title="商品图片" icon="ios-keypad" style="margin-top:10px;">
                <FormItem :label-width="1" prop="graphicDetailPic">
                    <upload  :is_multiple="graphicDetailPicList.is_multiple" :is_reset="graphicDetailPicList.is_reset" :maxNum="graphicDetailPicList.maxNum" :sPics="graphicDetailPicList.sPics" @sPicList="getGraphicDetailPicList($event)"></upload>
					<Input v-show="false" v-model="goodsForm.graphicDetailPic" ></Input>
                </FormItem>
            </Card>
        </Form>

        <Form
            ref="channelConfigDataForm"
			:model="channelConfigDataForm"
            :label-width="120"
            >
            <Card :dis-hover="true" title="物流及售后" icon="ios-keypad" style="margin-top:10px;" v-if="channelConfigData">
                <FormItem label="物流配送">
                    <Input type="text" placeholder="" class="w300" v-model="channelConfigDataForm.logisticsDelivery" readonly></Input>
                </FormItem>
                <FormItem label="平台保障">
                    <Tag v-for="item in platGuaranteeList" :key="item.id" color="green">{{item.name}}</Tag>
                </FormItem>
                <FormItem label="售后服务">
                    <!-- <Input type="textarea" :rows="4" v-model="channelConfigDataForm.remark" readonly></Input> -->
                    <quill-editor ref="QuillEditor2" v-model="channelConfigDataForm.remark" :options="editorOption2" ></quill-editor>
                </FormItem>
            </Card>
        </Form>

		<div slot="footer">
            <Button type="text" @click="goodsFormClose()" style="margin-right: 8px">取消</Button>
			<Button type="primary" @click="goodsFormSubmit()" v-if="pageType=='view' ? false :true">确定</Button>
		</div>
	</Modal>
</template>

<script>
import Upload from '@/components/common/uploadPic/upload';
import CategorySelect from '@/components/common/threeGrade';
import { mapGetters } from "vuex";

let Component = {
	components: {
        CategorySelect,
        Upload,
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
            listPagePicList: {
                maxNum: 1,
                sPics: '',
                is_reset: 1,
            },
            detailPagePicList: {
                maxNum: 5,
                sPics: '',
                is_reset: 1,
            },
            graphicDetailPicList: {
                maxNum: 20,
                sPics: '',
                is_reset: 1,
            },
            goodsForm: {
                goodsName: '',
                goodsDesc: '',
                channelId: '',
                goodsLevelOneVarieties: '',
                goodsLevelTwoVarieties: '',
                goodsLevelThreeVarieties: '',
                listPagePic: '',
                detailPagePic: '',
                marketPrice: '',
                goodsWorth: '',
                platPurchasePrice: '',
                isAutomatic: 1,
                brandCradle: '',
                cateName: '',
                enName: '',
                parentCompany: '',
                spec: '',
                useForCrowd: '',
                useForPlace: '',
                useForSkin: '',
                goodsDetail: '',
                graphicDetailPic: '',
            },
            goodsFormRules: {
                goodsName: [
                    {required: true, message: '请输入商品名称', trigger: 'blur'}
                ],
                channelId: [
                    {required: true,type:'number', message: '请选择渠道来源', trigger: 'change'}
                ],
                goodsLevelOneVarieties: [
                    {required: true,type:'number', message: '请选择商品品类', trigger: 'change'}
                ],
                listPagePic: [
                    {required: true, message: '请上传产品图示', trigger: 'change'}
                ],
                detailPagePic: [
                    {required: true, message: '请上传产品图示', trigger: 'change'}
                ],
                marketPrice: [
                    {  validator(rule, value, callback){
                            if(value==''){
                                callback(new Error('请输入平台进货价'));
                            }
                            callback();
                        },trigger:'blur'
                    }                ],
                goodsWorth: [
                    {  validator(rule, value, callback){
                            if(value==''){
                                callback(new Error('请输入平台进货价'));
                            }
                            callback();
                        },trigger:'blur'
                    }                ],
                platPurchasePrice: [
                    // {required: true,  message: '请输入平台进货价', trigger: 'blur'}
                    {  validator(rule, value, callback){
                            if(value==''){
                                callback(new Error('请输入平台进货价'));
                            }
                            callback();
                        },trigger:'blur'
                    }
                ],
                goodsDetail: [
                    {required: true, message: '请输入商品介绍', trigger: 'change'}
                ],
                graphicDetailPic: [
                    {required: true, message: '请上传商品图片', trigger: 'change'}
                ],
            },
            channelConfigData: false,
            editorOption1: {
                placeholder: '请输入商品介绍',
                readOnly:true,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                    ],
                    /* syntax: {
                         highlight: text => hljs.highlightAuto(text).value
                     }*/
                }
            },
            editorOption2: {
                placeholder: '请输入商品介绍',
                readOnly:true,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        ['blockquote', 'code-block'],
                        [{ 'header': 1 }, { 'header': 2 }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        [{ 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'align': [] }],
                        ['clean'],
                    ],
                    /* syntax: {
                         highlight: text => hljs.highlightAuto(text).value
                     }*/
                }
            },
            channelConfigDataForm:{},
        };
    },
    computed: {
        ...mapGetters({
            channelIdList: 'channelList'
        })
    },
    methods: {
	    dayin(){
	        log(this.goodsForm.platPurchasePrice);
            log(typeof this.goodsForm.platPurchasePrice);
        },
        getListPagePicList(value){
            this.goodsForm.listPagePic = value;
        },
        getdetailPagePicList(value){
            this.goodsForm.detailPagePic = value;
        },
        getGraphicDetailPicList(value){
            this.goodsForm.graphicDetailPic = value;
        },
        //物流及售后信息
        loadChannelConfigFun(val){
            this.$http({
                method: 'get',
                url: '/channelConfig/loadChannelConfigInfo.html',
                params: {
                    'id': val,
                },
            }).then((response) => {
                log(response,'执行到了获取的物流信息');
                this.channelConfigData = true;
                this.channelConfigDataForm = response;
                this.platGuaranteeList = response.platGuaranteeList;
            }).catch((err) => {
                this.$Message.error(err);
            });
        },
        //提交
        goodsFormSubmit(){
            this.$refs["goodsForm"].validate((valid) => {
                if (valid){
                    log(this.goodsForm);
                    this.loading = true;
                    let params={
                        ...this.goodsForm,
                    };
                    params.type=this.pageType;
                    if(this.pageType=='edit'){
                        params.id=this.goodsId;
                    }
                    function trans(val) {
                        if(val.indexOf('https')>-1){
                            log('执行编辑');
                            return val.split(',').map((val)=>{
                                return val.slice(61,);
                            }).join(',');
                        }else{
                            log('执行新增');
                            return val.split(',').map((val)=>{
                                return val.slice(60,);
                            }).join(',');
                        }

                    }
                    log(params.detailPagePic,'lll');
                    params.detailPagePic=trans(params.detailPagePic);
                    params.graphicDetailPic=trans(params.graphicDetailPic);
                    params.listPagePic=trans(params.listPagePic);
                    log(params.detailPagePic,'kkkk');
                    log(params,'传给后端的数据');
                      this.$http({
                          method:'get',
                          url:"goods/goodsOperate.html",
                          params:params,
                      }).then(res=>{
                          log(res);
                          if(res.result){
                              this.loading=false;
                              this.$Message.success({
                                  content: res.msg,
                                  duration: 1.5,
                                  onClose:()=>{
                                      this.goodsFormClose();
                                      this.$emit('refresh');
                                  }
                              });
                          }else{
                              this.$Message.error(res.msg);
                          }
                      });

                } else {
                    console.log("验证不通过");
                    this.$Message.error('请填写相关内容!');
                }
            });
        },
        //取消
        goodsFormClose () {
            this.$refs["goodsForm"].resetFields();
            this.$emit('update:goodsId', 0);
            this.$emit('update:pageType', '');
            this.$emit('update:isShow',false);
        },
        getDetail(){
            this.$http({
                method:'get',
                url:'/goods/goodsPage.html',
                params:{
                    type: this.pageType,
                    id: this.goodsId
                }
            }).then(res=>{
                log(res,'获取详情');
                if(res.result){
                    for(let key in res.goods){
                        if(this.goodsForm[key]!=undefined){
                            this.goodsForm[key]=res.goods[key];
                        }
                    }
                    for(let key in res.sjgoodsParams){
                        if(this.goodsForm[key]!=undefined){
                            this.goodsForm[key]=res.sjgoodsParams[key];
                        }
                    }
                    if(!this.goodsForm.goodsLevelOneVarieties){ this.goodsForm.goodsLevelOneVarieties='';}
                    if(!this.goodsForm.goodsLevelTwoVarieties){ this.goodsForm.goodsLevelTwoVarieties='';}
                    if(!this.goodsForm.goodsLevelThreeVarieties){this.goodsForm.goodsLevelThreeVarieties='';}
                    this.listPagePicList.sPics=res.purchasePagePicList;
                    this.detailPagePicList.sPics=res.detailPagePicList;
                    this.graphicDetailPicList.sPics =res.graphicDetailPicList;
                    log(this.listPagePicList.sPics);
                    log(this.detailPagePicList.sPics);
                    log( this.graphicDetailPicList.sPics);
                    log(this.goodsForm,'goodsForm');
                }else{
                    this.goodsFormClose();
                }
            });
        },
    },
    watch:{
        isShow(val, oldv){
            if(val){
                this.getDetail();
            }

        },
        //监听popform变化，来清除upload中的图片，取消的时候需要清除图片
        'goodsForm.listPagePic':function (val,oldval) {
            if(val==''){
                this.listPagePicList.is_reset++;
            }
        },
        'goodsForm.detailPagePic':function (val,oldval) {
            if(val==''){
                this.detailPagePicList.is_reset++;
            }
        },
        'goodsForm.graphicDetailPic':function (val,oldval) {
            if(val==''){
                this.graphicDetailPicList.is_reset++;
            }
        },
    },

};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
	.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
    }
    .goodsFormHeight .ivu-modal-body {
		height: 500px;
		overflow: auto;
	}
</style>

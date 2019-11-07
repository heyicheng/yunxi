<template>
    <div>
        <Modal
                title="商品管理"
                v-model="modal"
                width="1100"
                @on-cancel="modalClose"
        >
            <Card style="margin-bottom: 5px" >
                <p slot="title">商品筛选</p>
                <Form inline :label-width="80" style="height: 38px">
                    <FormItem label="商品名称">
                        <Input placeholder="输入商品名称查询" v-model="searchFilter.searchName"></Input>
                    </FormItem>
                    <FormItem label="商品ID">
                        <Input placeholder="输入商品名称查询" v-model="searchFilter.searchId"></Input>
                    </FormItem>
                    <FormItem label="渠道来源">
                        <Select style="width: 130px" v-model="searchFilter.channelId">
                            <Option value="">全部</Option>
                            <Option v-for="(item,index) in catalogue" :key="index" :value="item.id">{{item.channelName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="限时特卖">
                        <i-switch v-model="searchFilter.stauts">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="handleSearch">查询</Button>
                    </FormItem>
                </Form>
            </Card>
            <div>
                <Button @click="toAddShopping" type="primary" icon="plus">新增商品</Button>
            </div>
            <Table
                     height="300" border :columns="columns" :data="newDataList"
            >
            </Table>
            <div style="text-align: right;margin-top: 5px ;">
                <Page :current.sync="page.curpage" :total="page.total" @on-change="changePage" :page-size="page.pageSize" show-elevator show-total></Page>
            </div>
            <div slot="footer" >
                <Button type="text" @click="modalClose" style="margin-right: 8px">取消</Button>
                <Button  type="primary" :loading="loading" @click="toAddCatalogue('addModal')" >
                    <span v-if="!loading">确定</span>
                    <span v-else>提交中...</span>
                </Button>
            </div>
        </Modal>
        <Modal
                title="添加商品"
                v-model="addModal"
                width="900"
                @on-cancel="addModalClose"
                class-name="addShoppingModalHeight"
        >
            <Card  >
                <p slot="title">商品筛选</p>
                <Form inline :label-width="80" >
                    <FormItem label="商品名称">
                        <Input placeholder="输入商品名称查询" v-model="addFilter.searchName"></Input>
                    </FormItem>
                    <FormItem label="商品ID">
                        <Input placeholder="输入商品名称查询" v-model="addFilter.searchId"></Input>
                    </FormItem>
                    <FormItem label="渠道来源">
                        <Select style="width: 130px" v-model="addFilter.channelId">
                            <Option value="">全部</Option>
                            <Option v-for="(item,index) in catalogue" :key="index" :value="item.id">{{item.channelName}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="限时特卖">
                        <i-switch v-model="addFilter.stauts">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="addShoppingSearch">查询</Button>
                    </FormItem>
                </Form>
            </Card>
            <Table @on-selection-change="changeAddTtem" height="250" border :columns="addColumns" :data="newAddDataList" ></Table>
            <div style="text-align: right;margin-top: 5px ;">
                <Page :current.sync="pageTwo.curpage" :total="pageTwo.total" @on-change="changePageTwo" :page-size="pageTwo.pageSize" show-elevator show-total></Page>
            </div>
            <div slot="footer" >
                <Button type="text" @click="modalClose" style="margin-right: 8px">取消</Button>
                <Button  type="primary" :loading="loading2" @click="addShopping('addModal')" >
                    <span v-if="!loading2">确定</span>
                    <span v-else>提交中...</span>
                </Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    let tableW=80;
    import TablePage from '@components/common/TablePage';
    export default {
        name: "shopping-manage",
        components:{
            TablePage,
        },
        props:{
            shoppingManageModal:{type:Boolean, default:false},
            id:{},
            level_one:{},
            level_two:{},
        },
        data() {
            return {
                // shoppingManageModal:false
                loading:false,
                modal:false ,//用于绑定modal,本来直接用shoppingManageModal来做绑定是最舒服的，因为可以做到与父组件中的值双向绑定，但是父组件传过来的shoppingManageModal不允许直接修改，需要用this.$emit('update:shoppingManageModal', false);来做修改，而点击遮罩层源代码是直接修改shoppingManageModal，因此创建modal来做绑定并且和shoppingManageModal是同步的，就ok，，
                //tabel
                columns:[
                    {
                        title: '排序',
                        key: 'index',
                        align:'center',
                        width:tableW,
                        fixed:'left',
                        render:(h,params)=>{
                            return h('span',{},[
                                params.row.index+1
                            ]);
                        }
                    },
                    {
                        title: '商品ID',
                        key: 'id',
                        align:'center',
                        width:tableW,
                    },
                    {
                        title: '操作',
                        key: 'zoneName',
                        fixed:'left',
                        align:'center',
                        width:150,
                        render:(h,params)=>{
                            return h('div',{},[
                                h('Button',{
                                    props:{
                                        type:'primary',
                                        size:'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.goTop(params.row.zgId);
                                        }
                                    }
                                },['置顶']),
                                h('Button',{
                                    props:{
                                        type:'error',
                                        size:'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.delItem(params.row.zgId);
                                        }
                                    },
                                    style:{
                                        marginLeft:'5px'
                                    }
                                },['移出'])
                            ]);
                        }
                    },
                    {
                        title: '品类',
                        key: 'zoneName',
                        align:'center',
                        width:150,
                        render:(h,params)=>{
                            return h('div',{},[
                                `${params.row.var1}+${params.row.var2}+${params.row.var3}`
                            ]);
                        }
                    },
                    {
                        title: '商品名称',
                        key: 'goodsName',
                        align:'center',
                        width:150,
                    },
                    {
                        title: '市场价',
                        key: 'marketPrice',
                        align:'center',
                        width:tableW,
                    },
                    {
                        title: '库存',
                        key: 'remainStock',
                        align:'center',
                        width:tableW,
                    },
                    {
                        title: '渠道',
                        key: 'channelName',
                        align:'center',
                        width:100,
                    },
                    {
                        title: '限时特卖',
                        key: 'zoneName',
                        align:'center',
                        width:tableW+20,
                        render:(h,params)=>{
                            if(params.row.isSpecial==1){
                                return h('Icon',{
                                    props:{
                                        type:'checkmark'
                                    }
                                },[]);
                            }else{
                                return h('div',{},['-']);
                            }

                        }
                    },
                    {
                        title: '类目内推荐',
                        key: 'zoneName',
                        align:'center',
                        width:tableW+30,
                        render:(h,params)=>{
                            if(params.row.isRecommend==1){
                                return h('Icon',{
                                    props:{
                                        type:'checkmark'
                                    }
                                },[]);                            }else{
                                return h('div',{},['-']);
                            }

                        }
                    },
                    {
                        title: '首页推荐',
                        key: 'zoneName',
                        align:'center',
                        width:tableW+20,
                        fixed:'left',
                        render:(h,params)=>{
                            if(params.row.homeShow==0){
                                return h('Button',{
                                    props:{
                                        type:'primary',
                                        size:'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.recommend(params.row.zgId,1,1);
                                        }
                                    }
                                },[
                                    '推荐'
                                ]);
                            }else{
                                return h('Button',{
                                    props:{
                                        type:'success',
                                        size:'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.recommend(params.row.zgId,1,0);
                                        }
                                    }
                                },[
                                    '已推荐'
                                ]);
                            }

                        }
                    },
                    {
                        title: '专区内推荐',
                        // key: 'zoneName',
                        align:'center',
                        width:tableW+30,
                        fixed:'left',
                        render:(h,params)=>{
                            if(params.row.zoneRecommend==0){
                                return h('Button',{
                                    props:{
                                        type:'primary',
                                        size:'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.recommend(params.row.zgId,2,1);
                                        }
                                    }
                                },[
                                    '推荐'
                                ]);
                            }else{
                                return h('Button',{
                                    props:{
                                        type:'success',
                                        size:'small'
                                    },
                                    on:{
                                        click:()=>{
                                            this.recommend(params.row.zgId,2,0);
                                        }
                                    }
                                },[
                                    '已推荐'
                                ]);
                            }
                        }
                    },
                ],
                dataList:[],
                page:{
                    curpage:1,
                    total:0,
                    pageSize:10
                },
                catalogue:[],
                searchFilter:{
                    searchName:'',
                    searchId:'',
                    channelId:'',
                    stauts:false,
                },
                //addmodal
                addModal:false,
                addColumns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                    },
                    {
                        title: '排序',
                        key: 'index',
                        align:'center',
                        width:tableW,
                        render:(h,params)=>{
                            return h('span',{},[
                                params.row.index+1
                            ]);
                        }
                    },
                    {
                        title: '商品ID',
                        key: 'id',
                        align:'center',
                        width:tableW,
                    },
                    {
                        title: '品类',
                        key: 'zoneName',
                        align:'center',
                        render:(h,params)=>{
                            return h('div',{},[
                                `${params.row.var1}+${params.row.var2}+${params.row.var3}`
                            ]);
                        }
                    },
                    {
                        title: '商品名称',
                        key: 'goodsName',
                        align:'center',
                    },
                    {
                        title: '市场价',
                        key: 'marketPrice',
                        align:'center',
                    },

                    {
                        title: '限时特卖',
                        key: 'zoneName',
                        align:'center',
                        width:tableW+20,
                        render:(h,params)=>{
                            if(params.row.isSpecial==1){
                                return h('Icon',{
                                    props:{
                                        type:'checkmark'
                                    }
                                },[]);
                            }else{
                                return h('div',{},['-']);
                            }

                        }
                    },
                    {
                        title: '类目内推荐',
                        key: 'zoneName',
                        align:'center',
                        width:tableW+30,
                        render:(h,params)=>{
                            if(params.row.isRecommend==1){
                                return h('Icon',{
                                    props:{
                                        type:'checkmark'
                                    }
                                },[]);                            }else{
                                return h('div',{},['-']);
                            }

                        }
                    },
                ],
                addDataList:[],
                pageTwo:{
                    curpage:1,
                    total:0,
                    pageSize:10
                },
                addFilter:{
                    searchName:'',
                    searchId:'',
                    channelId:'',
                    stauts:false,
                },
                selectedData:[],
                loading2:false,
            };

        },
        computed:{
            newDataList(){
                return this.dataList.map((val,index)=>{
                    let obj=Object.assign({},val);
                    obj.index=index;
                    return obj;
                });
            },
            newAddDataList(){
                return this.addDataList.map((val,index)=>{
                    let obj=Object.assign({},val);
                    obj.index=index;
                    return obj;
                });
            }
        },
        methods: {
            dayin(){
                console.log(this.getData);
            },
            modalClose(){
                // this.addModal=false;
                this.$emit('update:shoppingManageModal', false);
            },
            handleSearch(){
                this.getData(1);
            },
            handleCurrentChange(cur){},
            getData(page=1){
                let argument={};
                Object.keys(this.searchFilter).forEach(val=>{
                    if(this.searchFilter[val]!==''){
                        argument[val]=this.searchFilter[val];
                    }
                });
                if(argument.stauts){
                    argument.stauts=1;
                }else{
                    delete argument.stauts;
                }
                let params={
                    pageSize:this.page.pageSize,
                    page,
                    zoneId:this.id,
                    level_one:this.level_one,
                    level_two:this.level_two,
                    ...argument
                };

                this.$http({
                    method:'get',
                    url:'/zoneGoods/queryZoneGoodsList.html',
                    params:params,
                }).then(res=>{
                    console.log(res);
                    if(res.result){
                        this.dataList=res.dataList;
                        let page=res.pages;
                        this.page.curpage=page.currentPage;
                        this.page.total=page.total;
                    }else{
                        this.$Message.success({
                            content:res.msg,
                            onClose:()=>{
                                // this.modalClose();
                            }
                        });
                    }
                });
            },
            getCatalogue(){
                this.$http({
                    method:'get',
                    url:'/goods/queryChannelAndSortList.html',
                    params:{}
                }).then(res=>{
                    if(res.result){
                        this.catalogue=res.channelList;
                    }else{
                        this.$Message.success({
                            content:res.msg,
                            onClose:()=>{
                                this.modalClose();
                            }
                        });
                    }
                });
            },
            changePage(cur){
                this.page.curpage=cur;
                this.getData(cur);
            },
            toAddShopping(){
                this.addModal=true;
                this.getAddModalData();
            },
            recommend(id,type,status){
                this.$http({
                    method:'get',
                    url:'/zoneGoods/zoneGoodsRecommendSet.html',
                    params:{
                        id,
                        flag:type,
                        status
                    }
                }).then(res=>{
                    if(res.result){
                        this.$Message.success(res.msg);
                        this.getData();
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            goTop(id){
                this.$http({
                    method:'get',
                    url:'/zoneGoods/updateSortTop.html',
                    params:{id}
                }).then(res=>{
                    if(res.result){
                        this.$Message.success(res.msg);
                        this.getData();
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            delItem(id){
                this.$http({
                    method:'get',
                    url:'/zoneGoods/moveFromZone.html',
                    params:{id}
                }).then(res=>{
                    if(res.result){
                        this.$Message.success(res.msg);
                        this.getData();
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
            },
            //addmodal
            addModalClose(){},
            getAddModalData(page=1){
                let argument={};
                Object.keys(this.addFilter).forEach(val=>{
                    if(this.addFilter[val]!==''){
                        argument[val]=this.addFilter[val];
                    }
                });
                if(argument.stauts){
                    argument.stauts=1;
                }else{
                    delete argument.stauts;
                }
                let params={
                    pageSize:this.pageTwo.pageSize,
                    page,
                    zoneId:this.id,
                    level_one:this.level_one,
                    level_two:this.level_two,
                    ...argument
                };
                this.$http({
                    method:'get',
                    url:'/zoneGoods/selectActivityZoneList.html',
                    params:params,
                }).then(res=>{
                    console.log(res);
                    if(res.result){
                        this.addDataList=res.dataList;
                        let page=res.pages;
                        this.pageTwo.curpage=page.currentPage;
                        this.pageTwo.total=page.total;
                    }else{
                        this.$Message.success({
                            content:res.msg,
                            onClose:()=>{
                                this.addModalClose();
                            }
                        });
                    }
                });
            },
            addShoppingSearch(){
                this.getAddModalData();
            },
            changeAddTtem(arr){
                this.selectedData=arr;
            },
            addShopping(){
                this.loading2=true;
                let sId='';
                this.selectedData.forEach(val=>{
                    sId+=val.id+',';
                });

                let params={
                    zoneId:this.id,
                    lvl1:this.level_one,
                    lvl2:this.level_two,
                };
                if(sId.length>0){
                    sId=sId.slice(0,sId.length-1);
                    params.goodsIds=sId;
                    this.$http({
                        method:'get',
                        url:"/zoneGoods/selectSubmit.html",
                        params:params
                    }).then(res=>{
                        this.loading2=false;
                        if(res.result){
                            this.$Message.success({
                                content:res.msg,
                                onClose:()=>{
                                    this.addModal=false;
                                }
                            });
                        }else{
                            this.$Message.error({
                                content:res.msg,
                                onClose:()=>{
                                }
                            });
                        }
                    });
                }

            },
            changePageTwo(cur){
                this.pageTwo.curpage=cur;
                this.getAddModalData(cur);
            },


        },
        watch:{
            modal(val,oval){
                this.$emit('update:shoppingManageModal', val);
                if(val){
                    this.getData();
                    this.getCatalogue();
                }
            },
            shoppingManageModal(val){
                console.log('监听到传过来的数据变化');
                this.modal=val;
            },
            //以上处理样式

        },
        created(){}
    };
</script>

<style lang="scss" >
.addShoppingModalHeight{
}
</style>

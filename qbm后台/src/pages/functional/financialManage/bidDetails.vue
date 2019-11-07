<template>
	<div class="">
			<TablePage
                    :columns="columns"
                    :tableData="data"
                    :page="page"
                    :pageSize="pageSize"
                    @pageChange="changePage"
					:printData.sync="printData"
            >
                <Button style="margin-right: 5px;" type="primary"  slot="header" @click="exportData(2)"><Icon type="ios-download-outline"></Icon> 导出结果</Button>
                <Button type="primary" icon="android-search" slot="header" @click="toggleSearch">搜索</Button>
                <Button type="primary" icon="android-sync" :loading="refresh" slot=header  @click="toRefresh" style="margin-left: 5px;">
					<span v-if="!refresh">刷新</span>
					<span v-else>加载中...</span>
				</Button>
            </TablePage>

<!--
		<div style="margin-bottom: 20px">
			<Button style=";" type="primary"  slot="header" @click="exportData(1)"><Icon type="ios-download-outline"></Icon> 导出结果</Button>
			<Button type="primary" icon="android-search" slot="header" @click="toggleSearch">搜索</Button>
			<Button type="primary" icon="android-sync" :loading="refresh"  @click="toRefresh"	>
				<span v-if="!refresh">刷新</span>
				<span v-else>加载中...</span>
			</Button>
		</div>

		<Table :columns="columns" :data="data"  ref="table"></Table>
		<div style="text-align: right;margin-top: 20px;">
			<Page :total="page.total" @on-change="changePage" show-total show-elevator></Page>
		</div>
-->



		<search-bar
				:searchShow="searchShow"
				:formItem.sync="formItem"
				@toggleSearch="toggleSearch"
				@searchSubmit="handleSubmit"
		>
			<Form :label-width="100">
				<FormItem  label="下单时间" >
					<DatePicker placement="bottom-end" format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime($event,1)" type="datetimerange" placeholder="" style="width: 300px"></DatePicker>
				</FormItem>
				<FormItem label="满标复审时间" >
					<DatePicker  placement="bottom-end" format="yyyy-MM-dd HH:mm:ss" @on-change="changeTime($event,2)" type="datetimerange" placeholder="" style="width: 300px"></DatePicker>
				</FormItem>
				<FormItem label="筛选" >
					<Input v-model="formItem.searchName" placeholder="项目名称/商品名称/用户手机号" style="width: 300px;"></Input>
				</FormItem>
				<FormItem label="标状态" >
					<Select v-model="formItem.borrowStatus"  placeholder="请选择" style="width: 300px">
						<Option value="">全部</Option>
						<Option v-for="(item,index) in searchData.borrowStatus" :key="item.order" :value="item.order">{{item.name}}</Option>
					</Select>
				</FormItem>
				<FormItem label="渠道来源" >
					<Select v-model="formItem.channelId" clearable placeholder="请选择" style="width: 300px">
						<Option value="">全部</Option>
						<Option v-for="(item,index) in searchData.channelList" :key="index" :value="item.id">{{item.channelName}}</Option>
					</Select>
				</FormItem>
				<CategorySelect
						:levelOne.sync="formItem.level_one"
						:levelTwo.sync="formItem.level_two"
						:levelThree.sync="formItem.level_three"
				></CategorySelect>
			</Form>
		</search-bar>

	</div>
</template>

<script>
    import CategorySelect from '@components/common/CategorySelect';
    import Upload from '@/components/common/uploadPic/upload';
    import {formatTimestamp} from '@/util/util';
    import TablePage from '@components/common/TablePage';
    import searchBar from '@components/common/SearchBar';
    let Component = {
        name: 'bidDetails',
        components: {
            TablePage,
            searchBar,
            Upload,
            CategorySelect
        },
        data () {
            return {
                printData:{
                    // name:'884',
					type:1,
					is_print:false
				},
                refresh: false,
                //table
                columns: [
                    {title: '序号', fixed:'left', width:80,align:'center', key: 'id'},
                    {title: '项目标的',fixed:'left', width:120, align:'center',key: 'borrowName'},
                    {title: '项目金额（元）',width:100,align:'center', key: 'itemAmount'},
                    {title: '标状态', width:80,align:'center', key: 'borrowStatus'},
                    {title: '复审时间', width:170, align:'center',key: 'verifyTime',render:function (h,params) {
                            return h('span',{},[formatTimestamp(params.row.verifyTime)]);
                        }
                    },

                    {title: '借款期限',width:100,align:'center',
                        render:function (h,params) {
                            return h('span',{},[`${params.row.timeLimit}个月`]);
                        },
                        key: 'timeLimit'
                    },
                    {title: '投资金额（元）',width:90,align:'center', key: 'account'},
                    {title: '生活券使用金额',width:90,align:'center', key: 'money'},
                    {title: '利率',width:90,align:'center', key: 'baseApr'},
                    {title: '现金利息（元）',width:90,align:'center', key: 'profit'},


                    {title: '商品收益率',width:90,align:'center', key: 'goodsProfitRate'},
                    {title: '商品收益',width:100,align:'center', key: 'goodsProfit'},
                    {title: '商品售价（元）',width:90,align:'center', key: 'goodsWorth'},
                    {title: '结算进货价（元）',width:100,align:'center', key: 'platPurchasePrice'},
                    {title: '商品名称',width:145,align:'center', key: 'goodsName'},

                    {title: '渠道',width:90,align:'center', key: 'channelName'},
                    {title: '品类',width:100,align:'center', key: 'varietiesName'},
                    {title: '购买用户',	width:120,
                        align:'center', key: 'myPhone'},
                    {title: '下单时间',	width:170,render:function (h,params) {
                            return h('span',{},[formatTimestamp(params.row.orderTime)]);
                        },
                        align:'center', key: 'orderTime'},
                ],
                data:[],
                page:{},
                pageSize: 10,
                //搜索
                searchShow: false, //搜索块是否显示
                formItem:{
                    searchName:'',
                    borrowStatus:'',
                    channelId:'',
                    level_one:'',
                    level_two:'',
                    level_three:'',
                    startTime:'',
                    endTime:'',
                    verifyStartTime:'',
                    verifyEndTime:'',
                },
                level_one:'',
                level_two:'',
                level_three:'',
                twoLevelSel:[],
                threeLevelSel:[],
                searchData:{},
                currentPage:1,
				actualSearch:{},//实际上搜索都是按照这个对象来
            };
        },
        methods:{
            changeTime(value,key){
                if(key==1){
                    this.formItem.startTime=value[0];
                    this.formItem.endTime=value[1];
				}else if(key==2){
                    this.formItem.verifyStartTime=value[0];
                    this.formItem.verifyEndTime=value[1];
				}
			},
            toRefresh(){
                this.refresh=true;
                this.getData();

			},
            getData(){
                let params={
                    pageSize:10,
                    page:this.currentPage,
					...this.actualSearch
                };
                this.$http({
                    method:'get',
                    url:'/goodsOrder/financialManage.html',
                    params:params
                }).then(res=>{
                    if(res.result){
                        this.data=res.dataList;
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
            getSearch(){
                this.$http({
                    method:'get',
                    url:'/goods/queryChannelAndSortList.html',
                    params:{}
                }).then(res=>{
                    if(res.result){
                        console.log(res,'搜索信息');
                        this.searchData=res;
                    }
                });
            },
            changeOneLevel(value,level){
                console.log(value,level);
                this.$http({
                    method:'get',
                    url:'/goodsClassification/loadGoodsClassificationList.html?',
                    params:{parentId:value}
                }).then(res=>{
                    if(res.result){
                        if(level==1){
                            console.log(res,'得到2级信息');
                            this.twoLevelSel=res.dataList;
                        }else if(level==2){
                            console.log(res,'得到3	级信息');
                            this.threeLevelSel=res.dataList;
                        }
                    }
                });
            },
            changePage(curr) {
                this.currentPage=curr;
                this.getData();
            },
            toggleSearch () {
                this.searchShow = !this.searchShow;
            },
            handleSubmit() {
                this.actualSearch=Object.assign({},this.formItem);
                this.currentPage=1;
                this.getData();
            },
            exportData (type) {
                this.printData.is_print=true;
                let self=this;
                setTimeout(()=>{
                    self.printData.is_print=false;
				},500);

             /*   if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: '哈哈哈哈'
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: 'Custom data',
                        columns: this.columns8.filter((col, index) => index < 4),
                        data: this.data7.filter((data, index) => index < 4)
                    });
                }*/
            },
        },
        created(){
            this.getData();
            this.getSearch();
        },
        mounted() {

        }
    };
    export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	.searchBarCard{
		padding: 0!important;
	}
</style>

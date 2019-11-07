<template>
	<div class="tablePageContainer">
		<div class="pageHeader">
			<slot name="header"></slot>
		</div>
		<div class="tableContext" v-if="tableData.length>0">
			<Table
			ref="table"
			border
			:highlight-row="oneSelect"
			:columns="columns"
			:data="tableData"
			@on-selection-change="handleSelectionChange"
			@on-current-change="handleSelectionChange"
			></Table>
		</div>
		<div class="pageContext" v-if="tableData.length>0">
			<Page :current="page.currentPage" :total="page.total" :page-size="pageSize" show-total show-elevator @on-change="handPageChange"></Page>
		</div>
		<div class="noDataContext" v-if="tableData.length==0">
			暂无数据~
		</div>
	</div>
</template>

<script>
let Component = {
	props: {
		columns: Array,
		tableData: Array,
		page: Object,
		oneSelect: {
			type: Boolean,
			default: false
		},
		pageSize: {
			type: Number,
			default: 10
		},
        printData:{
		    type:Object
		}
	},
	data () {
		return {
		};
	},
	mounted() {},
	methods: {
		handleSelectionChange(selection) {
			this.$emit('selectChange', selection);
		},
		handPageChange(currentPage) {
			this.$emit('pageChange', currentPage);
		},
		exportData(type=1,name='钱保姆'){
            if (type === 1) {
                this.$refs.table.exportCsv({
                    filename: name
                });
            } else if (type === 2) {
                this.$refs.table.exportCsv({
                    filename: name,
                    original: false
                });
            } else if (type === 3) {
                this.$refs.table.exportCsv({
                    filename: name,
                    columns: this.columns8.filter((col, index) => index < 4),
                    data: this.data7.filter((data, index) => index < 4)
                });
            }
		}
	},
	watch:{
		'printData.is_print':function (val){
		    if(val){
		   		this.exportData(this.printData.type,this.printData.name);
			}
		},

	},
	created(){}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
.tablePageContainer {
	font-size: 14px;
	.pageHeader {
		width: 100%;
		margin-bottom: 20px;
	}
	.pageContext {
		margin-top: 10px;
		text-align: right;
		font-size: 12px;
	}
	.noDataContext {
		text-align: center;
		font-size: 16px;
	}
}
</style>

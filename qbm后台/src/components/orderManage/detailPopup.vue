<template>
	<Modal
	:value="isShow"
	@on-cancel="cancel"
	class-name="vertical-center-modal orderDetail"
	>
		<p slot="header">订单详情</p>
		<div style="margin: 20px 0;">
			当前订单状态：{{modelData.logisticsStatus}}
		</div>
		<Card dis-hover style="margin-bottom: 20px;">
			<p slot="title">订单信息</p>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">商品名称：</Col>
				<Col span="20">{{modelData.goodsName}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">商品型号：</Col>
				<Col span="8">{{modelData.goodsModel}}</Col>
				<Col span="4" class-name="detailLabel">商品品类：</Col>
				<Col span="8">{{modelData.varietiesName}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">商品颜色：</Col>
				<Col span="8">{{modelData.goodsColour}}</Col>
				<Col span="4" class-name="detailLabel">商品编号：</Col>
				<Col span="8">{{modelData.goodsNumber}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">渠道来源：</Col>
				<Col span="8">{{modelData.channelName}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">市场价：</Col>
				<Col span="8">{{modelData.marketPrice}}</Col>
				<Col v-if="isChange" span="4" class-name="detailLabel">实际进货价：</Col>
				<Col v-if="isChange" span="8"><Input size="small" v-model="modelData.settlementPrice" style="width: 100px;"></Input>元</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">买家姓名：</Col>
				<Col span="8">{{modelData.realname}}</Col>
				<Col span="4" class-name="detailLabel">手机号：</Col>
				<Col span="8">{{modelData.phone}}</Col>
			</Row>
			<Card dis-hover style="margin-top: 20px;">
				<Row :gutter="5">
					<Col span="3" class-name="detailLabel">订单编号：</Col>
					<Col span="20">{{modelData.orderNo}}</Col>
				</Row>
				<Row :gutter="5">
					<Col span="3" class-name="detailLabel">下单时间：</Col>
					<Col span="20">{{modelData.orderTime | formatTimestamp}}</Col>
				</Row>
				<Row :gutter="5" v-if="modelData.sendTime">
					<Col span="3" class-name="detailLabel">发货时间：</Col>
					<Col span="20">{{modelData.sendTime | formatTimestamp}}</Col>
				</Row>
				<Row :gutter="5" v-if="modelData.overTime">
					<Col span="3" class-name="detailLabel">完成时间：</Col>
					<Col span="20">{{modelData.overTime | formatTimestamp}}</Col>
				</Row>
			</Card>
		</Card>
		<Card dis-hover style="margin-bottom: 20px;" v-if="!isChange">
			<p slot="title">投资信息</p>
			<Row :gutter="5" v-if="modelData.tenderStatus">
				<Col span="4" class-name="detailLabel">状态：</Col>
				<Col span="8">{{modelData.tenderStatus}}</Col>
				<Col span="4" class-name="detailLabel">到期时间：</Col>
				<Col span="8">{{modelData.repayTime | formatTimestamp}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">项目名称：</Col>
				<Col span="8">{{modelData.name}}</Col>
				<Col span="4" class-name="detailLabel">项目类别：</Col>
				<Col span="8">{{modelData.borrowType}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">项目期限：</Col>
				<Col span="8">{{modelData.timeLimit}}个月</Col>
				<Col span="4" class-name="detailLabel">预期年化：</Col>
				<Col span="8">{{modelData.yearApr}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">购买金额：</Col>
				<Col span="8">{{modelData.account}}</Col>
				<Col span="4" class-name="detailLabel">购买时间：</Col>
				<Col span="8">{{modelData.addtime | formatTimestamp}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">现金收益：</Col>
				<Col span="8">{{modelData.moneyProfit}}</Col>
				<Col span="4" class-name="detailLabel">还款方式：</Col>
				<Col span="8">{{modelData.style}}</Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">保全码：</Col>
				<Col span="20">{{modelData.recordNo}}</Col>
			</Row>
		</Card>
		<Card dis-hover style="margin-bottom: 20px;" v-if="!isChange">
			<p slot="title">收货与物流信息</p>
			<div v-show="logisticsInfoShow">
				<Row :gutter="5">
					<Col span="4" class-name="detailLabel">收货人姓名：</Col>
					<Col span="8">{{modelData.myRealname}}</Col>
					<Col span="4" class-name="detailLabel">手机号：</Col>
					<Col span="8">{{modelData.myPhone}}</Col>
				</Row>
				<Row :gutter="5">
					<Col span="4" class-name="detailLabel">收货地址：</Col>
					<Col span="20">{{modelData.myAddr}}</Col>
				</Row>
			</div>
			<div v-show="!logisticsInfoShow">
				<Row :gutter="5" v-if="modelData.logisticsStatus=='待发货'">
					<Col span="4" class-name="detailLabel">收货人姓名：</Col>
					<Col span="8"><Input size="small" v-model="modelData.myRealname"></Input></Col>
					<Col span="4" class-name="detailLabel">手机号：</Col>
					<Col span="8"><Input size="small" v-model="modelData.myPhone"></Input></Col>
				</Row>
				<Row :gutter="5" v-if="modelData.logisticsStatus=='待发货'">
					<Col span="4" class-name="detailLabel">收货地址：</Col>
					<Col span="20"><Input size="small"v-model="modelData.myAddr"></Input></Col>
				</Row>
			</div>
			<Row :gutter="5" v-if="modelData.logisticsStatus=='待发货'">
				<Col span="4"><Button style="margin-left: 40px;" type="success" @click="handleToggleShow">{{logisticsInfoShow? '修改发货信息' : '保存'}}</Button></Col>
			</Row>
			<Row :gutter="5">
				<Col span="4" class-name="detailLabel">物流状态：</Col>
				<Col span="8">暂无</Col>
			</Row>
			<Row :gutter="5" v-if="modelData.sjLogisticsCompany">
				<Col span="4" class-name="detailLabel">物流公司：</Col>
				<Col span="8">{{modelData.sjLogisticsCompany}}</Col>
			</Row>
			<Row :gutter="5" v-if="modelData.sjLogisticsCompany">
				<Col span="4" class-name="detailLabel">运单号：</Col>
				<Col span="8">{{modelData.sjOrderNumber}}</Col>
			</Row>
			<Row :gutter="5" v-if="modelData.sjLogisticsCompany">
				<Col span="4" class-name="detailLabel">物流跟踪：</Col>
				<Col span="8">暂无</Col>
			</Row>
		</Card>
		<div slot="footer">
			<Button type="success" v-if="isChange" @click="handleSubmit">保存</Button>
		</div>
	</Modal>	
</template>

<script>
import * as $util from '@util/util';

let Component = {
	components: {

	},
	props:[
		'isShow',
		'modelData',
		'orderId',
		'isChange'
	],
	data () {
		return {
			logisticsInfoShow: true,
		};
	},
	filters: {
		formatTimestamp(value) {
			return $util.formatTimestamp(value);
		}
	},
	created() {

	},
	mounted() {

	},
	beforeUpdate() {

	},
	updated() {
	},
	methods: {
		cancel () {
			this.logisticsInfoShow = true;
			setTimeout(()=>{
				this.$emit('update:isChange', false);
				this.$emit('togglePopup');
			},10);
		},
		handleToggleShow() {
			if (this.logisticsInfoShow) {
				this.logisticsInfoShow = false;
			} else {
				this.$http({
					method: 'get',
					url: '/goodsOrder/updateLogisticsInfo.html',
					params: {
						id: this.orderId,
						myRealname: this.modelData.myRealname,
						myPhone: this.modelData.myPhone,
						myAddr: this.modelData.myAddr
					},
				}).then((response) => {
					if (response.result) {
						this.$Message.success(response.msg);
						this.logisticsInfoShow = true;
					}else {
						this.$Message.error(response.msg);
					}
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			}
		},
		handleSubmit (name) {
			this.$http({
				method: 'get',
				url: '/goodsOrder/updateOrderStatus.html',
				params: {
					id: this.orderId,
					settlementPrice: this.modelData.settlementPrice,
					dstatus: 3
				},
			}).then((response) => {
				if (response.result) {
					this.$Message.success(response.msg);
					this.$emit('update:isChange', false);
					this.$emit('togglePopup');
				}else {
					this.$Message.error(response.msg);
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
	.orderDetail{
		.ivu-modal {
			width: 900px!important;
		}
		.ivu-modal-body {
			height: 600px;
			overflow: auto;
		}
		.detailLabel {
			text-align: right;
		}
		.ivu-row {
			margin-top: 8px;
		}
	} 
</style>

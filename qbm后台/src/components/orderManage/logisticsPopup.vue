<template>
	<Modal
		:value="isShow"
		@on-cancel="cancel"
		class-name="vertical-center-modal"
		>
		<p slot="header">{{modelData.sjLogisticsCompany? '收货' : '发货'}}</p>
		<Card dis-hover style="margin-bottom: 20px;">
            <p slot="title">收货信息</p>
            <p>收货人： {{modelData.myRealname}} {{modelData.myPhone}}</p>
            <p>收货地址： {{modelData.myAddr}}</p>
        </Card>
        <Card dis-hover>
            <p slot="title">物流信息</p>
			<Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="100">
				<FormItem label="物流公司：" prop="sjLogisticsCompany">
					<span v-if="modelData.sjLogisticsCompany">{{modelData.sjLogisticsCompany}}</span>
					<Input v-if="!modelData.sjLogisticsCompany" v-model="formData.sjLogisticsCompany" placeholder="请输入物流公司"></Input>
				</FormItem>
				<FormItem label="运单号：" prop="sjOrderNumber">
					<span v-if="modelData.sjOrderNumber">{{modelData.sjOrderNumber}}</span>
					<Input v-if="!modelData.sjOrderNumber" v-model="formData.sjOrderNumber" placeholder="请输入运单号"></Input>
				</FormItem>
			</Form>
		</Card>
		<div v-if="modelData.remainTime">
			<p v-html="countDownTime">*</p>
			<p><span class="txt-red">*</span> 操作确认收货前请确保商品已被签收</p>
		</div>
		<div slot="footer">
			<Button type="primary" @click="handleSubmit()">确定</Button>
			<Button type="ghost" @click="cancel" style="margin-left: 8px">取消</Button>
		</div>
	</Modal>	
</template>

<script>

let Component = {
	components: {

	},
	props: {
		isShow: {
			type: Boolean,
			default: false
		},
		modelData: {
			type: Object,
			default: {}
		},
		orderId: {
			type: [ String, Number],
			default: ''
		}
	},
	data () {
		return {
			countDownTime: '',
			timer: null,
			formData: {
				sjLogisticsCompany: '',
				sjOrderNumber: ''
			},
			ruleValidate: {
				sjLogisticsCompany: [
					{ required: true, message: '物流公司不能为空', trigger: 'blur' }
				],
				sjOrderNumber: [
					{ required: true, message: '运单号不能为空', trigger: 'blur' }
				]
			}
		};
	},
	created(){
		
	},
	mounted() {
		
	},
	beforeUpdate() {
		this.countDown(this.modelData.remainTime);
		this.timer = setInterval(() => {
			if (this.modelData.remainTime) {
				this.countDown(this.modelData.remainTime);
			} else {
				this.timer = null;
			}
		}, 1000);
	},
	methods: {
		cancel () {
			this.$refs["formValidate"].resetFields();
			this.$emit('togglePopup');
			this.content = "";
			this.timer = null;
		},
		handleSubmit () {
			if (this.modelData.remainTime) {
				this.updateOrderStatus();
			} else {

				this.$refs['formValidate'].validate((valid) => {
					if (valid) {
						this.updateOrderStatus();
					} else {
						this.$Message.error('请填写完整');
					}
				});
			}
		},
		updateOrderStatus() {
			this.$http({
				method: 'post',
				url: '/goodsOrder/updateOrderStatus.html',
				params: {
					...this.formData,
					id: this.orderId
				},
			}).then((response) => {
				if (response.result) {
					this.$emit('togglePopup');
					this.$emit('updateTable');

					this.$Message.success('操作成功');
					// this.logisticsData = response;
				}else {
					 this.$Message.error(response.msg);
				}
			}).catch((err) => {
				this.$Message.error(err.msg);
			});
		},
		handleReset (name) {
			this.$refs[name].resetFields();
		},
		countDown: function(timestamp) {
			if (!timestamp) {
				this.timer = null;
				return false;
			}
			let nowTime = new Date();
			let endTime = new Date(timestamp * 1000);
			let t = endTime.getTime() - nowTime.getTime();
			let day = Math.floor(t / 1000 / 60 / 60 / 24);
			let hour = Math.floor(t / 1000 / 60 / 60 % 24);
			let min = Math.floor(t / 1000 / 60 % 60);
			let sec = Math.floor(t / 1000 % 60);

			if (hour < 10) {
				hour = "0" + hour;
			}
			if (min < 10) {
				min = "0" + min;
			}
			if (sec < 10) {
				sec = "0" + sec;
			}
			let countDownTime = `<span class="txt-red">*</span> 当前订单将于<span class="txt-red">${day}</span>天<span class="txt-red">${hour}</span>小时<span class="txt-red">${min}</span>分<span class="txt-red">${sec}</span>秒自动确认收货`;
			this.countDownTime = countDownTime;
		},
	},
	mounted(){
		this.$nextTick(function () {
			this.content = "";
		});
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
	p {
		margin: 5px 0;
	}
	
</style>

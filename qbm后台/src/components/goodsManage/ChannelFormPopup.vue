<template>
	<Modal
	:value="isShow"
	@on-cancel="cancel"
	:mask-closable="false"
	class-name="vertical-center-modal channelForm"
	>
		<p slot="header">渠道配置</p>
		<Form v-if="isShow" :key="key" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
			<FormItem label="渠道名称：" prop="channelName">
				<Input v-model="formValidate.channelName" placeholder="渠道名称" style="width: 200px;"></Input>
			</FormItem>
			<FormItem label="渠道icon：" prop="channelIcon">
				<PicturePicker
				:limit="1"
				:isMultiple="false"
				:uriList.sync="formValidate.channelIcon"
				></PicturePicker>
			</FormItem>
            <FormItem label="商家icon：" prop="sellerIcon">
				<PicturePicker
				:limit="1"
				:isMultiple="false"
				:uriList.sync="formValidate.sellerIcon"
				></PicturePicker>
			</FormItem>
			<FormItem label="渠道范围：" prop="channelScope">
				<Select v-model="formValidate.channelScope" placeholder="请选择" style="width: 200px;">
					<Option value="1">全国</Option>
					<Option value="2">杭州</Option>
				</Select>
			</FormItem>
            <FormItem label="物流配送：" prop="logisticsDeliveryId">
				<Select v-model="formValidate.logisticsDeliveryId" placeholder="请选择" style="width: 200px;">
					<Option value="1">快递</Option>
					<Option value="2">物流</Option>
				</Select>
			</FormItem>
             <FormItem label="平台保障：" prop="guaranteesStr">
				<CheckboxGroup v-model="formValidate.guaranteesStr">
                    <Checkbox label="1">正品保障</Checkbox>
                    <Checkbox label="2">品牌授权</Checkbox>
                    <Checkbox label="3">免费配送</Checkbox>
                    <Checkbox label="4">中华保险承保</Checkbox>
                </CheckboxGroup>
			</FormItem>
            <FormItem label="Content" prop="remark">
				<quill-editor
				ref="QuillEditor"
				:options="editorOption"
				v-model="formValidate.remark"
				>
				</quill-editor>
			</FormItem>
		</Form>
		
		<div slot="footer">
			<Button type="success" @click="handleSubmit">保存</Button>
		</div>
	</Modal>	
</template>

<script>
import PicturePicker from '@components/common/PicturePicker';

const initForm = {
    channelName: '',
    channelIcon: [],
    sellerIcon: [],
    channelScope: '',				
    logisticsDeliveryId: '',
    guaranteesStr: [],
    remark: ''
};

let Component = {
	components: {
		PicturePicker
	},
	props: {
        isShow: {
            type: Boolean,
            default: false
        },
        channelId: {
			type: [Number, String],
			default: ''
        },
		// modelData: {
		// 	type: Object,
		// 	default: {}
		// },
    },
	data () {
		return {
			key: '',
            editorOption: {
				modules: {
					toolbar: [
						['bold', 'italic', 'underline', 'strike'],
						['blockquote', 'code-block']
					]
				}
			},
            formValidate: {
				...initForm
			},
            ruleValidate: {
				channelName: [
					{ required: true, message: '渠道名不能为空', trigger: 'blur' }
				],
				channelIcon: [
					{ required: true, min:1, type: 'array', message: '请上传渠道icon', trigger: 'blur' }
				],
				sellerIcon: [
					{ required: true, min:1, type: 'array', message: '请上传商家icon', trigger: 'blur' }
				],
				channelScope: [
					{ required: true, message: '请选择渠道范围', trigger: 'blur' }
				],
				logisticsDeliveryId: [
					{ required: true, message: '请选择配送方式', trigger: 'blur' }
                ],
                guaranteesStr: [
					{ required: true, min:1, type: 'array', message: '至少选择一个平台保障', trigger: 'blur' }
                ],
				remark: [
					{ required: true, message: 'Please enter a personal introduction', trigger: 'blur' }
				]
            },
            type: 'add'
		};
    },
    watch: {
		isShow(val, oldv){
			if (this.channelId != 0 && val) {
				this.type = 'edit';
				this.$http({
					method: 'get',
					url: '/channelConfig/channelConfigPage.html',
					params: {
						id: this.channelId,
						type: this.type
					},
				}).then((response) => {
					if (response.result) {
						// this.$Message.success(response.msg);
						// this.modelData = response;
						const {
							channelConfig
						} = response;
						const {
							channelName,
							channelIcon,
							sellerIcon,
							channelScope,
							logisticsDeliveryId,
							platGuarantee,
							remark
						} = channelConfig;
						this.formValidate = {
							...initForm,
							channelName: channelName,
							channelIcon:  [{uri: this.$url.imageSeverPath + channelIcon}],
							sellerIcon: [{uri: this.$url.imageSeverPath + sellerIcon}],
							channelScope: channelScope,				
							logisticsDeliveryId: logisticsDeliveryId.toString(),
							guaranteesStr: platGuarantee.split(','),
							remark: remark
						};
					}else {
						this.$Message.error(response.msg);
					}
				}).catch((err) => {
					this.$Message.error(err.msg);
				});
			} else if (val && this.channelId == 0) {
				this.formValidate = {...initForm};
			}
		},
		// modelData(val, oldv){
		// 	if (!val.channelConfig) {
		// 		return false;
		// 	}
		// 	const {
		// 		channelConfig
		// 	} = val;
		// 	const {
		// 		channelName,
		// 		channelIcon,
		// 		sellerIcon,
		// 		channelScope,
		// 		logisticsDeliveryId,
		// 		platGuarantee,
		// 		remark
		// 	} = channelConfig;
		// 	this.formValidate = {
		// 		...initForm,
		// 		channelName: channelName,
		// 		channelIcon:  [ {uri: this.$url.imageSeverPath + channelIcon}],
		// 		sellerIcon: [ {uri: this.$url.imageSeverPath + sellerIcon}],
		// 		channelScope: channelScope,				
		// 		logisticsDeliveryId: logisticsDeliveryId.toString(),
		// 		guaranteesStr: platGuarantee.split(','),
		// 		remark: remark
		// 	};
		// }
    },
	created() {

	},
	mounted() {

	},
	// beforeUpdate() {
	// 	if (this.formValidate.channelName == null) {
	// 		if (this.channelId == 0) {
	// 			this.type = 'add';
	// 			this.formValidate = {...initForm};
	// 		}
	// 	}
	// },
	updated() {},
	methods: {
		cancel () {
			this.$emit('update:channelId', 0);
			this.$emit('update:isShow', false);
        },
		handleSubmit () {
			console.log(this.formValidate);
			
			this.$refs['formValidate'].validate((valid) => {
				if (valid) {
					// this.updateOrderStatus();
				}
			});
			// this.$http({
			// 	method: 'get',
			// 	url: '/goodsOrder/updateOrderStatus.html',
			// 	params: {
			// 		id: this.orderId,
			// 		settlementPrice: this.modelData.settlementPrice,
			// 		dstatus: 3
			// 	},
			// }).then((response) => {
			// 	if (response.result) {
			// 		this.$Message.success(response.msg);
			// 		this.$emit('update:isChange', false);
			// 		this.$emit('togglePopup');
			// 	}else {
			// 		this.$Message.error(response.msg);
			// 	}
			// }).catch((err) => {
			// 	this.$Message.error(err.msg);
			// });
		}
	}
};
export default Component;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
	.channelForm{
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
        .quill-editor {
            height: 200px;
            .ql-container {
                height: 140px;
            }
        }
	} 
</style>

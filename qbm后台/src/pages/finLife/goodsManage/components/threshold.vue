<template>
    <div>
        <Modal
            title="商品门槛设置"
            :value="isShow"
            width="560"
            :mask-closable='false'
            @on-cancel="cancel()"
            class-name="vertical-center-modal"
            >

            <Form
                ref="thresholdForm"
                :model="thresholdForm"
                :label-width="120"
                >
                <Row>
                    <Col span="12">
                        <FormItem label="投资期限">
                            <Input type="text" class="w100" v-model="thresholdForm.tenderLimit">
                                <span slot="append">个月</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="项目年化">
                            <Input type="text" class="w100" v-model="thresholdForm.baseApr">
                                <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品收益率">
                            <Input type="text" class="w100" v-model="thresholdForm.goodsProfitRate" :readonly="true">
                                <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="现金收益率">
                            <Input type="text" class="w100" v-model="thresholdForm.moneyProfitRate" :readonly="true">
                                <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="11">
                        <FormItem label="投资本金">
                            <Input type="text" class="w100" v-model="thresholdForm.tenderAccount">
                                <span slot="append">%</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="13" style="line-height: 32px;">
                        (建议投资本金：<span id="suggestTenderAccount"></span>元)
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品收益">
                            <Input type="text" class="w100" v-model="thresholdForm.moneyProfitRate" :readonly="true">
                                <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="现金收益">
                            <Input type="text" class="w100" v-model="thresholdForm.moneyProfit" :readonly="true">
                                <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="12">
                        <FormItem label="商品进货价">
                            <Input type="text" class="w100" v-model="thresholdForm.moneyProfitRate" :readonly="true">
                                <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="当前利润">
                            <Input type="text" class="w100" v-model="thresholdForm.lirun" :readonly="true">
                                <span slot="append">元</span>
                            </Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel()" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submit()" >确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
let Component = {
    props: {
		isShow: {
			type: Boolean,
			default: false
		},
    },
    data () {
        return {
            thresholdForm: {
                tenderLimit: '',
                baseApr: '',
                goodsProfitRate: '',
                moneyProfitRate: '',
                tenderAccount: '',
                moneyProfitRate: '',
                moneyProfit: '',
                lirun: '',
            }
        };
    },
    methods: {

        //提交
        submit () {
            console.log('确定');
        },
        //取消
        cancel () {
            console.log('cancel');
            this.$emit('update:isShow',false);
        },
    },
};
export default Component;
</script>
<style lang='scss' scoped >
    .w100{
		width: 100px;
	}
	.vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
            top: 0;
        }
    }
</style>



<template>
    <div>
        <Modal
            title="商品规格设置"
            :value="isShow"
            width="560"
            :mask-closable='false'
            @on-cancel="cancel()"
            class-name="vertical-center-modal"
            >

            <Form
                ref="specificationForm"
                :model="specificationForm"
                :label-width="120"
                >
                <FormItem label="商品型号">
                    <Input type="text" class="w200" v-model="specificationForm.goodsModel"></Input>
                </FormItem>
                <FormItem label="商品颜色">
                    <Input type="text" class="w200" v-model="specificationForm.goodsColour"></Input>
                </FormItem>
                <FormItem label="商品编号">
                    <Input type="text" class="w200" v-model="specificationForm.goodsNumber"></Input>
                </FormItem>
                <FormItem label="数量">
                    <Input type="text" class="w200" v-model="specificationForm.stock"></Input>
                </FormItem>

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
        dataId: {
			type: [Number, String],
			default: ''
        },
        goodsId: {
			type: [Number, String],
			default: ''
        },
        pageType1: {
			type: [Number, String],
			default: ''
        },
    },
    data () {
        return {
            specificationForm:{
                goodsModel: '',
                goodsColour: '',
                goodsNumber: '',
                stock: '',
            },
        };
    },
    methods: {
        getDate(){
            //数据请求
            this.$http({
                method: 'get',
                url: '/goodsSpecification/goodsSpecificationPage.html',
                params: {
                    "type": this.pageType1,
                     "id": this.dataId
                },
            }).then((response) => {
                console.log(response);
                if(response.result){
                    console.log('数据加载成功！');
                    this.specificationForm = response.goodsSpecification;//数据列表
                }else{
                    this.$Message.error({
                        content: '数据获取失败，请重试'
                    });
                }
            }).catch((err) => {
                this.$Message.error(err);
            });
        },
        //提交
        submit () {
            console.log('确定');
        },
        //取消
        cancel () {
            console.log('cancel');
            this.$emit('update:isShow',false);
            this.$emit('getSumStock');//重新获取当前库存及用户前台显示总库存
            setTimeout(() => {
                this.$emit('getDataList');//重新获取表格数据
            }, 200);

        },
    },
    watch: {
        isShow(val, oldv){
			if(this.goodsId != 0 && this.pageType !='' && val){
                console.log('goodsId=' + this.goodsId);
                console.log('pageType=' + this.pageType1);

                if(this.pageType == 'view') {
                    // this.addBtnShow = false; //查看时，隐藏添加按钮
                    // this.showAvailableStock = true; //查看时，显示用户前台显示总库存
                    //this.submitBtn = false; //查看时，隐藏提交按钮
                }
                this.getDate();//重新加载数据
            }
		},
    },
};
export default Component;
</script>
<style lang='scss' scoped>
    .w200{
		width: 200px;
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



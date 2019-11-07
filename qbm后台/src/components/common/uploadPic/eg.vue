<template>
<div>
   <!-- 传递两个属性is_multiple默认多选,不可传0
    maxNum：默认不限制张数
    pics接收后台返回的数据
    -->
    <upload :is_multiple="is_multiple" :maxNum="maxNum" :sPics="sPics" @sPicList="getPicList($event)"></upload>
    <!--单张图片用下面这个-->
    <input type="hidden" name="listPagePic" :value="picList">
    <!--多张图片用这个-->
    <input type="hidden" name="detailPagePic" :value="picList">
</div>
</template>

<script>


    import Upload from './upload';
    export default {
        name: "test",
        components:{
            upload:Upload,
        },
        data() {
            return {
                is_multiple:true,
                maxNum:5,
                sPics:'',//'/manage/images/e187508eb76d9309e91e24e00c8049f1.JPG,/manage/images/5735e0c56edbb375d0d2099b36a126b2.JPG',
                picList:'',//子组件传过来的sPiclist
            };
        },
        computed:{},
        methods: {
            getPicList(value){
                this.picList=value;
            }
        },
    };
</script>

<style lang="scss" scoped>

</style>

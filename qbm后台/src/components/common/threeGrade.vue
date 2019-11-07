<template>
    <div>
        <FormItem label="商品品类"  required inline :class="{margin0:margin0}">
            <Select v-model="levelOne" style="width:100px" @on-change="change($event,'changeOne')">
                <Option v-for="item in categoryList" :value="item.id" :key="item.id">{{ item.varietiesName }}</Option>
            </Select>
        <Select v-model="levelTwo" style="width:100px" @on-change="change($event,'changeTwo')" :disabled="levelTwoList.length>0? false : true">
            <Option value="">全部</Option>
            <Option v-for="item in levelTwoList" :value="item.id" :key="item.id">{{ item.varietiesName }}</Option>
        </Select>
        <Select v-model="levelThree" style="width:100px" @on-change="changeThree" :disabled="levelThreeList.length>0? false :true">
            <Option value="">全部</Option>
            <Option v-for="item in levelThreeList" :value="item.id" :key="item.id">{{ item.varietiesName }}</Option>
        </Select>
        </FormItem>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "threeGrade",
        props:['levelOne','levelTwo','levelThree','margin0'],
        data(){
            return{
                levelTwoList:[],
                levelThreeList:[],
                is_one:false,
                is_two:false,
                is_three:false,
            };
        },
        computed: {
            ...mapGetters({
                categoryList: 'categoryList'
            })
        },
        methods:{
            getdata(id){
                return this.$http({
                    url:'goodsClassification/loadGoodsClassificationList.html',
                    params:{
                        parentId:id
                    }
                });
            },
            change(id,type){
                if(type=='changeOne'){
                    this.$emit('update:levelOne',id);
                }else if(type=='changeTwo'){
                    this.$emit('update:levelTwo',id);
                }
                if(id!=''){
                    if(type=='changeOne'){
                        this.getdata(id).then(res=>{
                            if(res.result){
                                if(type=='changeOne'){
                                    this.levelTwoList=res.dataList;
                                }else if(type=='changeTwo'){
                                    this.levelThreeList=res.dataList;
                                }
                            }else{
                                this.$Message.error(res.msg);
                            }
                        });
                    }else{
                        setTimeout(()=>{
                            this.getdata(id).then(res=>{
                                log(res);
                                if(res.result){
                                    if(type=='changeOne'){
                                        this.levelTwoList=res.dataList;
                                    }else if(type=='changeTwo'){
                                        this.levelThreeList=res.dataList;
                                    }
                                }else{
                                    this.$Message.error(res.msg);
                                }
                            });
                        },500);
                    }

                }else {//这里处理level变为''时候的响应操作
                    if(type=='changeOne'){
                        this.levelTwoList=[];
                        this.levelThreeList=[];
                    }else if(type=='changTow'){
                        this.levelThreeList=[];
                    }
                };
            },
            changeThree(id){
                this.$emit('update:levelThree',id);
            },
            /* init(){
                 if(this.levelOne){
                     this.getdata(this.levelOne).then(res=>{
                         if(res.result){
                             this.levelTwoList=res.dataList;
                         }else{
                             this.$Message.error(res.msg);
                         }
                     });
                 }
                 setTimeout(()=>{
                     if(this.levelTwo){
                         this.getdata(this.levelTwo).then(res=>{
                             if(res.result){
                                 this.levelThreeList=res.dataList;
                             }else{
                                 this.$Message.error(res.msg);
                             }
                         });
                     }
                 },200);
             },
             changeData(){}*/
        },
        watch:{
        },
        created(){
            // this.init();

            // this.levelOne && this.change(this.levelOne,'changeOne');
            // this.levelTwo && this.change(this.levelTwo,'changeTwo');
        },
    };
</script>

<style scoped>
.margin0{
    margin: 0;
}
</style>

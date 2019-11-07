<!--何-->

<template>
    <div>
        <div class="uploadpic flex-row-left">
            <div class="imglist1" v-for="(item,index) in picList"  :style="{width:width ? width+'px': '100px',height:height?height+'px':'100px'}" :key="index">
                <Spin fix  v-if="!picList[index].show">加载中</Spin>
                <img @click="toLarge(index)" @load="load(index)" class="pic" :src="item.src" alt="">
                <Icon v-if="!disabled" color="red" style="position: absolute;top: 0px;right: 0px"  @click.native.stop="delPic(index)" size="20" type="close-circled"></Icon>
            </div>
            <div class="addpic1" v-if="is_add&&!disabled" :style="{width:width ? width+'px': '100px',height:height?height+'px':'100px'}" >
                <div class="img" style="z-index: 0;text-align: center" >
                    <Icon  type="plus" color="#dddee1" :size="addSize ? addSize:40"  :style="{lineHeight: height ? height+'px':'100px'}"></Icon>
                </div>
                <form ref="form">
                    <input name="Filedata" @change="change($event)" class="upload" type="file" :multiple="maxNum>1 ? true:false" accept="image/*">
                    <!--<input type="hidden" name="Filename" value="lll">-->
                    <input type="hidden" name="folder" value="\manage\images">
                    <input type="hidden" name="hideName" value="true">
                    <!--<input type="hidden" name="timestamp" value="1521016849000" >-->
                    <!--<input type="hidden" name="Upload" value="Submit Query">-->
                </form>
            </div>
        </div>
        <Modal
                :styles="{zIndex: 2000}"
                class-name="diyi"
                v-model="modal1"
                title="图片预览"
                width="740"
                @on-ok="ok"
                @on-cancel="cancel">
            <Carousel v-model="value1" loop  style="width: 700px;height: 500px" >
                <CarouselItem v-for="(item,index) in picList" :key="index">
                    <div class="demo-carousel" style="height: 100%;width: 100%">
                        <img :src="item.src" alt="" style="width: 700px;height: 500px">
                    </div>
                </CarouselItem>
            </Carousel>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>

<script>
    import {upload} from "@/util/http";
    import axios from 'axios';
    export default {
        name: "upload",
        props:['maxNum','sPics','is_reset','size','width','height','addSize','disabled','delPrefix'],
        data() {
            return {
                value1: 0,//当前的图片
                picList: [],
                modal1: false,//对话框
                hhh:1,
                is_add:true,
            };
        },
        computed:{
            sPicList(){
                let str='';
                this.picList.forEach(val=>{
                    str+=`${val.src},`;
                });
                str=str.slice(0,str.length-1);
                return str;
            }
        },
        methods: {
            load(index){
                this.picList[index].show=true;
            },
            ok () {
                // this.$Message.info('Clicked ok');
            },
            cancel () {
                // this.$Message.info('Clicked cancel');
            },
            change(e){
                let form=this.$refs.form;
                let formdata=new FormData(form);
                axios({
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url:this.$url.fileSever,
                    data:formdata,
                }).then(res=>res.data).catch(error=>error).then(res=>{
                    let str=res.slice(15,);//'294893fa99f1aaa361503f80a3297901.pngd00700152aad17592c80cf69f13c1dff.jpge6b33e90a075727b95a66a104d5e9374.jpeg2865cb288a89f7d1bd4304b75c6fb9cb.jpg71c00116e62608f96e5cb395f1e0cd39.jpg'
                    let reg2 = /.jpeg|.jpg|.gif|.bmp|.png/i;
                    let nameArr=str.split(reg2);//["e118faad94061a634600d9aaf4402ac2", "176521607f952f080cbae4983057709f", ""]
                    nameArr.pop();
                    let arr=nameArr.map(val=>{
                        return str.indexOf(val);
                    });
                    let picList=[];
                    for(let i=0;i<arr.length;i++){
                        let picUnit;
                        if(i<(arr.length-1)){
                            picUnit=str.slice(arr[i],arr[i+1]);
                        }else if(i==(arr.length-1)){
                            picUnit=str.slice(arr[i],);
                        }
                        picList.push(picUnit);
                    }
                    //以上为处理后台返回数据处理，变成["e118faad94061a634600d9aaf4402ac2.jpg", "176521607f952f080cbae4983057709f.gif"]
                        picList.forEach(val=>{
                            let obj={src:`${this.$url.imageSeverPath}/manage/images/${val}`,show:false};
                            this.picList.push(obj);
                        });
                    e.target.value='';//清空input
                    if(this.maxNum){
                        this.picList=this.picList.slice(0,this.maxNum);
                    }
                    this.$emit('sPicList',this.sPicList);
                });
            },
            delPic(index){
                this.picList.splice(index,1);
                this.$emit('sPicList',this.sPicList);
            },
            toLarge(index){
                this.modal1=true;
                this.value1=index;
            },
            initPic(){
                if(this.sPics){//
                    if(typeof this.sPics=='object'){//接口返回数组形式的图片
                        this.sPics.forEach(val=>{
                            let obj={
                                src:val.uri,
                                show:false
                            };
                            this.picList.push(obj);
                        });
                    }else{//以下做兼容，有些接口返回的是字符串的形式的图片，
                        this.sPics.split(',').forEach(val=>{
                            let obj;
                            if(val.slice(0,4)=='http'){
                                obj={src:val,show:true};
                            }else{
                                obj={src:`${this.$url.imageSeverPath}/${val}`,show:true};
                            }
                            this.picList.push(obj);
                        });
                    }
                    this.$emit('sPicList',this.sPicList);
                }
            },
            callback(){},
        },
        watch:{
            is_reset(val){
                this.picList=[];
                this.$emit('sPicList',this.sPicList);
            },
            picList(val){

                if(val.length>=this.maxNum){
                    this.is_add=false;
                }else{
                    this.is_add=true;
                }
            },
            sPics(){
                this.initPic();
                this.$emit('sPicList',this.sPicList);
            },

        },
        created(){
            this.initPic();
        },
        mounted(){
            // 把该图层提权
            let a=document.getElementsByClassName('diyi')[0];
            a.parentNode.firstChild.style.zIndex=1500;
        }
    };
</script>

<style lang="scss" >
    .ivu-modal-wrap.diyi{
        z-index: 2000;
    }
    .imglist1{
        margin-bottom:   10px;
        border-radius: 7px;
        overflow: hidden;
        text-align: center;
        width: 100px;
        height: 100px;
        margin-right: 10px;
        position: relative;
        &:hover{
            background: hotpink;
            cursor: pointer;
        }
        .pic{
            width: 100%;height: 100%;
        }
        .del{
            position: absolute;
            top: 0;


            right: 0;
            &:hover{
                cursor:context-menu ;
            }
        }
        .del2{
            position: absolute;
            top: 5px;
            right: 5px;
            &:hover{
                cursor:context-menu ;
            }
        }

    }
    .imglist1:hover{
        background: rgba(225,225,225,0.4);
    }
    .addpic1{
        margin-bottom:  10px;
        -webkit-border-radius: 7px;
        -moz-border-radius: 7px;
        border-radius: 7px;
        margin-right: 10px;
        position: relative;
        border: 1px solid #dddee1;
        width: 100px;
        height: 100px;
        &:hover{
            cursor: pointer;
        }
        .img{
            width: 100%;
            height: 100%;
            z-index: 1;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
        form{
            &:hover{
                cursor: pointer;
            }
            position: absolute;
            z-index: 10;
            top: 0;
            left: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
            .upload{
                width: 100%;
                height: 100%;
                &:hover{
                    cursor: pointer;
                }
            }
        }
    }
    form{
        .upload:hover{
            cursor: pointer;
        }
    }
    //公用样式
    .flex-row-left{
        display: flex;
        flex-flow: row wrap;
        justify-content: left;
    }

    .comfirm{
        position: fixed;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.4);
        top: 0;
        left: 0;
        z-index: 99999;
    }
    .tan{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: white;
    }
</style>






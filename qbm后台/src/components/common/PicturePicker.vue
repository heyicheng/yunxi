<template>
<div>
    <div v-if="uploadList.length>0" class="upload-list" v-for="(item, index) in uploadList" :style="{width: width + 'px', height: height + 'px', lineHeight: height + 'px'}">
        <template>
            <img :src="item.uri" @click="handleView(index)">
            <div class="upload-list-cover" @click="handleRemove(item)">
                <Icon type="close-round" size="12"></Icon>
            </div>
        </template>
    </div>
    <Upload
    ref="upload"
    v-show="uploadList.length < limit"
    :show-upload-list="false"
    :default-file-list="uriList"
    :format="['jpg', 'jpeg', 'png', 'gif']"
    :max-size="5120"
    :on-format-error="handleFormatError"
    :on-exceeded-size="handleMaxSize"
    :before-upload="handleBeforeUpload"
    :action="$url.fileSever"
    :multiple="isMultiple"
    :headers="{'Content-Type': 'multipart/form-data'}"
    :style="{display: 'inline-block',width: width}">
        <div :style="{width: width + 'px', height: height + 'px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center'}">
            <Icon type="android-add" :size="width * 0.5"></Icon>
        </div>
    </Upload>
    <Modal title="View Image" v-model="visible">
        <Carousel v-model="imgIndex" :loop="uploadList.length>1" style="width: 488px;height: 488px" >
            <CarouselItem v-for="(item, index) in uploadList" :key="index">
                <div class="imgBox">
                    <img :src="item.uri">
                </div>
            </CarouselItem>
        </Carousel>
    </Modal>
</div>
</template>
<script>
import axios from 'axios';
export default {
    props: {
        limit: {
            type: Number,
            default: 5
        },
        uriList: {
            type: Array,
            default: []
        },
        width: {
            type: [Number, String],
            default: 100
        },
        height: {
            type: [Number, String],
            default: 100
        },
        isMultiple: {
            type: Boolean,
            default: true
        }
    },
    data () {
        return {
            imgIndex: 0,
            visible: false,
            uploadList: []
        };
    },
    methods: {
        handleView (index) {
            this.imgIndex = index;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '请检查您的文件格式',
                desc: '请选择jpg或png或gif'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超过文件大小限制',
                desc: '文件  ' + file.name + ' 太大, 超过5M.'
            });
        },
        handleBeforeUpload (file) {
            const check = this.uploadList.length < this.limit;
            if (!check) {
                this.$Notice.warning({
                    title: '超过文件上传上限'
                });
            }
            this.uploadPic(file);
            return false;
        },
        uploadPic(file) {
            let formData = new FormData();
            
            formData.append('file', file);
            formData.append('folder', '\\manage\\images');
            formData.append('hideName', true);
            formData.append('timestamp', Date.parse(new Date()));
            axios({
                method: 'post',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                url: this.$url.fileSever,
                data: formData,
            }).then(res => res.data).catch(error => error).then(res => {
                this.$refs.upload.fileList.push({uri: this.$url.imageSeverPath + res});
                let fileList = this.$refs.upload.fileList;
                this.$emit('update:uriList', fileList);
            });
        }
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    },
    beforeUpdate() {
        this.uploadList = this.$refs.upload.fileList;        
    }
};
</script>
<style lang='scss'>
.imgBox {
    position: relative;
    z-index: 99999;
    width: 488px;
    height: 488px;
    background: #fff;
    img {
        display: block;
        width: 100%;
        height: 100%;
    }
}
.upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 10px;
    vertical-align: middle
}
.upload-list img{
    width: 100%;
    height: 100%;
}
.upload-list-cover{
    position: absolute;
    top: -6px;
    right: -6px;
    width: 18px;
    height: 18px;
    line-height: 18px;
    text-align: center;
    border-radius: 100%;
    background: red;
}
.upload-list-cover i{
    color: #fff;
    font-size: 12px;
    cursor: pointer;
    margin: 0 2px;
}
</style>

<template>
  <div class="page" v-show="vshow">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"/>
    <div>
      <img :src="headurl">
      <van-uploader accept="image/*" type="file" :before-read="onRead">
        <van-button class="v-t" block>从相册中选一张</van-button>
      </van-uploader>
      <van-uploader capture="camera" :before-read="onRead">
        <van-button class="v-b" block>拍一张照片</van-button>
      </van-uploader>
    </div>
    <!-- vueCropper 剪裁图片实现-->
    <!-- <van-dialog
      v-model="dialogVisible"
      show-cancel-button
      @confirm="dialogConfirm()"
      cancelButtonColor="#fff"
    >-->
    <div class="cropper-content" v-show="dialogVisible">
      <div class="cropper" style="text-align:center">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="option.info"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :fixedBox="option.fixedBox"
          :maxImgSize="option.maxImgSize"
          :output-size="option.size"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :mode="option.mode"
        ></vueCropper>
      </div>
      <div class="foot-button">
        <van-button @click="dialogVisible = false">取消</van-button>
        <van-button @click="dialogConfirm()">完成</van-button>
      </div>
    </div>
    <!-- </van-dialog> -->
  </div>
</template>
<script>
import { Uploader, Toast } from "vant";
import { UpdateHeadPic } from "@/api/accountSetting";
import EXIF from "exif-js";
import { VueCropper } from "vue-cropper";
export default {
  components: {
    "van-uploader": Uploader,
    VueCropper
  },
  data() {
    return {
      vshow: true,
      headurl:
        JSON.parse(localStorage.getItem("accountInfo")).headpicurl.length > 0
          ? JSON.parse(localStorage.getItem("accountInfo")).headpicurl
          : require("../../../assets/account/pic_head.png"),
      toast: "",
      dialogVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: false, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        fixedBox: true, // 固定截图框大小 不允许改变
        full: false, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
        size: 1,
        mode:'90%',
      }
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    onRead(file) {
      this.toast = Toast.loading({ mask: true, duration: 0 });
      this.fileAdd(file);
    },
    updateHeadPic(img) {
      this.toast = Toast.loading({ mask: true, duration: 0 });
      UpdateHeadPic(img)
        .then(response => {
          console.log(response);
          this.toast.clear();
          if (response.ResultCode == 0) {
            Toast({ message: response.ResultMsg, duration: 2000 });
            this.goBack();
          }
        })
        .catch(error => {
          this.toast.clear();
        });
    },
    //图片压缩
    imgCompress(data, obj) {
      //path是指上传的图片，obj是压缩的品质，越低越模糊
      let _this = this; //这里的this 是把vue的实例对象指向改变为_this
      var img = new Image();
      img.src = data;
      img.onload = function() {
        var that = this; //这里的this 是把img的对象指向改变为that
        // 默认按比例压缩
        var w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        var quality = 0.5; // 默认图片质量为0.7
        //生成canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
          quality = obj.quality;
        }

        // quality值越小，所绘制出的图像越模糊
        var base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        var urlFile = _this.convertBase64UrlToBlob(base64); //这个地方的处理是为了把压缩的base64转化为对象，获得压缩后图片的大小size，方便对压缩后的图片再次进行判断；
        // console.log(urlFile);
        if (urlFile.size / 1024 > 2048) {
          Toast({ message: "图片过大，请重新上传图片", duration: 2000 });
          // this.toast.clear();
        } else {
          _this.updateHeadPic(base64.split(",")[1]);
        }
      };
    },

    //将base64码转化为file（Blob）
    //此处函数对压缩后的base64经过处理返回{size: "", type: ""}
    convertBase64UrlToBlob(urlData) {
      var arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },
    // 点击裁剪，这一步是可以拿到处理后的地址
    dialogConfirm() {
      this.$nextTick(() => {
        // 获取截图的base64 数据
        this.$refs.cropper.getCropData(data => {
          this.headurl = data.src; //页面上显示所选择的图片
          this.imgCompress(data, { quality: 0.2 });
          this.dialogVisible = false;
        });
      });
    },
    /**
     * 处理图片 获取图片EXIF
     */
    fileAdd(file) {
      let reader = new FileReader();
      let image = new Image();
      let _this = this;
      reader.readAsDataURL(file);
      reader.onload = function() {
        image.onload = function() {
          let width = image.width;
          let height = image.height;
          file.width = width;
          file.height = height;
          _this.option.autoCropWidth = window.screen.width; // 生成截图框宽度
          _this.option.autoCropHeight = window.screen.width;
          try {
            EXIF.getData(image, function() {
              EXIF.getAllTags(this);
              var Orientation = EXIF.getTag(this, "Orientation");
              var canvas = document.createElement("canvas"),
                ctx = canvas.getContext("2d");
              canvas.width = width;
              canvas.height = height;

              ctx.drawImage(image, 0, 0, width, height);
              var base64 = null;
              if (Orientation !== "" && Orientation != 1) {
                switch (Orientation) {
                  case 6:
                    // console.log("顺时针旋转270度");
                    _this.rotateImg(image, "left", canvas);
                    break;
                  case 8:
                    // console.log("顺时针旋转90度");
                    _this.rotateImg(image, "right", canvas);
                    break;
                  case 3:
                    // console.log("顺时针旋转180度");
                    _this.rotateImg(image, "horizen", canvas);
                    break;
                }
              }
              //输出转换后的base64图片
              var base64 = canvas.toDataURL(file.type, 1);
              _this.option.img = URL.createObjectURL(
                _this.convertBase64UrlToBlob(base64)
              );
              _this.dialogVisible = true;
              _this.toast.clear();
              // _this.crop();
            });
          } catch (e) {
            this.toast.clear();
          }
        };
        image.src = this.result;
      };
    },

    //对图片旋转处理
    rotateImg(img, direction, canvas) {
      //图片旋转4次后回到原方向
      if (img == null) return;
      var height = img.height;
      var width = img.width;
      var step = 2;

      if (direction == "right") {
        step++;
      } else if (direction == "left") {
        step--;
      } else if (direction == "horizen") {
        step = 2; //不处理
      }
      //旋转角度以弧度值为参数
      var degree = (step * 90 * Math.PI) / 180;
      var ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.page {
  position: relative;
}
.vue-cropper {
  background-image: none;
  background: rgb(94, 88, 88);
}
.cropper-modal {
  background: rgba(0, 0, 0, 0.8);
}
// 截图
.cropper-content {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  overflow: hidden;
  font-size: 0.42667rem;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  border-radius: 0.10667rem;
  background-color: #fff;
  -webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  .cropper {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .foot-button {
    position: absolute;
    width: 100%;
    bottom: 0;
    button:first-child {
      width: 50%;
      background: white;
      color: black;
    }
    button:last-child {
      width: 50%;
      background: rgba(74, 144, 224, 1);
      color: #fff;
    }
  }
}
.page {
  height: 100%;
  width: 100%;
  position: fixed;
  background: #fff;
}
.van-uploader {
  display: inline;
}
img {
  height: 110px;
  width: 110px;
  margin-top: 60px;
  border-radius: 55px;
}
.v-t {
  background: rgba(74, 144, 224, 1);
  margin-top: 47px;
  color: #fff;
  border: 0px;
  display: inline-block;
  width: 90%;
}
.v-b {
  color: rgba(74, 144, 224, 1);
  background: #fff;
  margin-top: 15px;
  border: 1px solid rgba(74, 144, 224, 1);
  display: inline-block;
  width: 90%;
}
.van-button--normal {
  padding: 0px;
}
</style>


<template>
  <div class="codeShadow">
    <div class="codeShadowContent">
      <div class="div-img">
        <img src="@/assets/account/bg_kaihu.png">
      </div>
      <p class="p-tips p-top1">您还未开通第三方托管账户，</p>
      <p class="p-tips">无法进行相应的资金处理操作，</p>
      <p class="p-tips">是否立即开通？</p>
      <div class="div-button">
        <button class="bt-cancel" @click="onCancel">暂缓开通</button>
        <button class="bt-sure" @click="onSure">立即开通</button>
      </div>
    </div>
  </div>
</template>
<script>
import { OpenEscrowAccount, OpenAutoBid } from "@/api/account.js";
import { Toast } from "vant";
import { log } from "util";
import router from "@/router/index";
export default {
  data() {
    return {
      accountInfo: "",
      /*  是否开启自动投标	0否 1 是 */
      isautobid: "",
      /* 是否汇付天下托管账户 */
      isopenescrow: ""
    };
  },
  mounted: function() {
    this.accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
    this.isautobid = this.accountInfo.isautobid;
    this.isopenescrow = this.accountInfo.isopenescrow;
  },
  created() {
    localStorage.setItem("huifuGoBack", window.location.href);
  },
  props: {
    cancelCallback: {
      default: null
    },
    sureCallback: {
      default: null
    }
  },
  methods: {
    onSure() {
      if (this.isautobid == 0 && this.isopenescrow == 1) {
        OpenAutoBid().then(response => {
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              router.push({
                name: "huifuInput",
                query: {
                  PayUrl:
                    response.Data.PayUrl +
                    "?" +
                    this.setQueryConfig(response.Data.PostData),
                  PostData: response.Data.PostData
                }
              });
            } else {
              Toast(response.ResultMsg);
            }
          }
        });
      } else {
        OpenEscrowAccount().then(response => {
          console.log(response);
          if (response) {
            if (response.ResultCode == 0) {
              //开通资金存管账户中转页面
              router.push({ name: "openhuifu" });
            } else {
              Toast(response.ResultMsg);
            }
          }
        });
      }
      // 确认的回调
      this.sureCallback && this.sureCallback();
    },
    onCancel() {
      // 关闭弹窗
      this.cancelCallback && this.cancelCallback();
    },
    setQueryConfig(PostData) {
      var str = "";
      for (var data in PostData) {
        if (PostData[data] != -1) {
          str += data + "=" + PostData[data] + "&";
        }
      }
      var _str = str.substring(0, str.length - 1);
      return _str;
    }
  }
};
</script>
<style scoped lang="scss">
.codeShadow {
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;

  z-index: 100;
}
.codeShadowContent {
  background: #fff;
  width: 270px;
  height: 299px;
  border-radius: 7px;
  position: absolute;
  // margin-left: -162.5px;
  left: 15%;
  top: 25%;
  // margin-top: -120px;
}
.div-img img {
  width: 270px;
  height: 128px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
}

.div-button {
  text-align: center;
  margin-top: 20px;
}
.p-top1{
  margin-top: 15px;
}
.p-tips {
  opacity: 1;
  font-size: 15px;
  color: rgba(49, 49, 52, 1);
  line-height: 22px;
  letter-spacing: 0px;
  text-align: center;
}
.div-button button {
  width: 112px;
  height: 40px;
  border-radius: 2px;
  font-size: 16px;
  outline: none;
  cursor: pointer;
}
.bt-cancel {
  background: #fff;
  color: rgba(74, 144, 224, 1);
  border: 1px solid rgba(74, 144, 224, 1);
  margin-right: 14px;
}
.bt-sure {
  background: rgba(74, 144, 224, 1);
  color: #fff;
  border: none;
}
</style>

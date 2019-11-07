<template>
  <div class="addressContainer page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div class="livecity clearfix">
      <img src="@/assets/account/ic_address.png" class="fl cityIcon">
      <p class="fl cityLabel">{{ liveCity }}</p>
    </div>
    <van-field
      class="addressField"
      v-model="address"
      type="textarea"
      rows="3"
      placeholder="请输入您的详细地址"
    />
    <van-button
      class="addressButton"
      :disabled="address && address.length === 0"
      type="default"
      @click="saveAddress"
    >提交</van-button>
  </div>
</template>

<script>
import { Field, Button, Toast } from "vant";
import { SaveLiveAddress } from "@/api/account.js";

export default {
  data() {
    return {
      liveCity: "",
      address: ""
    };
  },
  components: {
    "van-field": Field,
    "van-button": Button
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    saveAddress() {
      Toast.loading({ mask: true, duration: 0 });
      SaveLiveAddress(this.address)
        .then(response => {
          if (response.ResultCode === 0) {
            Toast.clear();
            this.$router.go(-1);
          } else {
            Toast({ message: response.ResultMsg, duration: 1500 });
          }
        })
        .catch(error => {
          Toast.clear();
        });
    }
  },
  mounted() {
    var accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
    this.liveCity = accountInfo.cityname;
    this.address = accountInfo.liveaddress;
    if (this.liveCity.length === 0) {
      this.liveCity = "未设置";
    }
  }
};
</script>

<style scoped lang='scss'>
.addressContainer {
  position: fixed;
  background: rgba(248, 248, 248, 1);
  height: 100%;
  width: 100%;
}

.addressContainer .addressField {
  margin-top: 19px;
  height: 114px;
  font-size: 16px;
}

.addressContainer .addressButton {
  height: 40px;
  width: calc(100% - 30px);
  margin-top: 25px;
}

.addressContainer .livecity {
  margin-top: 20px;
  .cityIcon {
    margin-left: 17px;
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
  .cityLabel {
    font-size: 16px;
    color: rgba(99, 105, 118, 1);
    margin-left: 14px;
  }
}

/deep/.van-button--default {
  border: none;
  color: white;
  background: rgba(42, 117, 204, 1);
}
/deep/.van-button::before {
  background-color: rgba(74, 144, 224, 1);
}
</style>
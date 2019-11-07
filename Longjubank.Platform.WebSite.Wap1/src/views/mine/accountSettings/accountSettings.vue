<template>
  <div class="page">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      @click-left="goBack"
      right-text="退出登录"
      @click-right="logout"
      style="position:fixed"
    />
    <van-cell-group>
      <van-cell title="头像" is-link to="settingHead">
        <template slot>
          <img class="v-img" :src="userAccountInfo.headurl">
        </template>
      </van-cell>
      <van-cell title="账号" :value="userAccountInfo.account"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="登录密码" is-link to="modifyPassword" value="修改"/>
      <van-cell title="授权密码" is-link to="authorizationPassword" :value="issetpay"/>
    </van-cell-group>
    <van-cell-group>
      <van-cell title="手机号" is-link to="modifyPhone" :value="userAccountInfo.mobile"/>
      <van-cell title="所在地区" is-link to="citySelected" :value="userAccountInfo.city"/>
      <van-cell title="详细地址" is-link to="address" :value="userAccountInfo.addres"/>
      <van-cell title="邮箱" is-link to="email" :value="userAccountInfo.mailbox"/>
    </van-cell-group>
    <van-button
      v-if="userAccountInfo.isopenescrow"
      class="v-button"
      block
      @click="openEscrowAccount"
    >立即开通资金托管账户</van-button>
    <van-cell-group v-else>
      <van-cell title="汇付天下账号" :value="userAccountInfo.escrowaccount"/>
      <van-cell title="真实姓名" :value="userAccountInfo.realname"/>
      <van-cell title="身份证号" :value="userAccountInfo.cardno"/>
    </van-cell-group>
  </div>
</template>
<script>
import { Cell, CellGroup, Toast } from "vant";
import { LoginOut } from "@/api/login";
import { GetUserAccountInfo, GetUserAccount } from "@/api/account.js";
import CommonUtils from "@/utils/public";
import { OpenEscrowAccount } from "@/api/account.js";
export default {
  components: {
    "van-cell-group": CellGroup,
    "van-cell": Cell
  },
  data() {
    return {
      accountInfo: "",
      issetpay:
        JSON.parse(localStorage.getItem("account")).issetpay == 1
          ? "修改"
          : "未设置"
    };
  },
  computed: {
    userAccountInfo() {
      var params = {};
      var _accountInfo = this.accountInfo;
      _accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
      if (_accountInfo != null && _accountInfo.length === 0) {
        _accountInfo = null;
      }
      if (!CommonUtils.isEmpty(_accountInfo)) {
        params.headurl =
          _accountInfo.headpicurl.length == 0
            ? require("../../../assets/account/pic_head.png")
            : _accountInfo.headpicurl;
        params.city =
          _accountInfo.cityname.length == 0
            ? "选择城市"
            : _accountInfo.cityname;
        params.addres =
          _accountInfo.livecity.length == 0
            ? "添加详细地址"
            : _accountInfo.liveaddress.slice(0, 12) +'...';
        params.mailbox =
          _accountInfo.bindemail.length == 0
            ? "添加常用邮箱"
            : _accountInfo.bindemail;

        params.account =
          _accountInfo.useraccount.slice(0, 3) +
          "****" +
          _accountInfo.useraccount.slice(-4, _accountInfo.useraccount.length);
        params.mobile =
          _accountInfo.mobile.slice(0, 3) +
          "****" +
          _accountInfo.mobile.slice(-4, _accountInfo.mobile.length);
        //0未开户 1已开户
        params.isopenescrow = _accountInfo.isopenescrow == "1" ? false : true;
        if (!params.isopenescrow) {
          params.escrowaccount = _accountInfo.escrowaccount;
          params.realname = _accountInfo.realname;
          params.cardno =
            _accountInfo.cardno.slice(0, 3) +
            "***********" +
            _accountInfo.cardno.slice(-4, _accountInfo.cardno.length);
        }
      }
      return params;
    }
  },
  mounted() {
    if (
      localStorage.getItem("token") == null ||
      localStorage.getItem("token").length <= 1
    ) {
      this.$router.push("login");
    } else {
      GetUserAccount().then(response => {
        if (response.ResultCode == 0) {
          // this.account = response.Data;
          this.issetpay = response.Data.issetpay == 1 ? "修改" : "未设置";
          localStorage.setItem("account", JSON.stringify(response.Data));
        }
      });
      GetUserAccountInfo().then(response => {
        console.log(response);
        if (response.ResultCode == 0) {
          this.accountInfo = response.Data;
          localStorage.setItem("accountInfo", JSON.stringify(this.accountInfo));
        }
      });
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    logout() {
      this.$dialog
        .confirm({
          title: "是否安全退出？",
          message: "",
          className: "notSufficientFunds",
          cancelButtonText: "取消",
          cancelButtonColor: "#4A90E2",
          confirmButtonText: "安全退出",
          confirmButtonColor: "#4A90E2",
          closeOnClickOverlay: true
        })
        .then(() => {
          LoginOut().then(Response => {
            if (Response) {
              if (Response.ResultCode == 0) {
                localStorage.clear();
                localStorage.setItem("phone", this.accountInfo.mobile);
                this.goBack();
                Toast({ message: Response.ResultMsg, duration: 2000 });
              } else {
                Toast(Response.ResultMsg);
              }
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    openEscrowAccount() {
      OpenEscrowAccount().then(response => {
        console.log(response);
        if (response) {
          if (response.ResultCode == 0) {
            //开通资金存管账户中转页面
            this.$router.push({ name: "openhuifu" });
          } else {
            Toast(response.ResultMsg);
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.van-cell-group {
  margin-top: 10px;
}
.page {
  background: rgba(250, 250, 250, 1);
  position: absolute;
  height: 100%;
  width: 100%;
}
.van-cell__title {
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  color: rgba(49, 49, 52, 1);
  line-height: 30px;
  flex: 2;
  padding-top: 2px;
}
.van-cell__right-icon {
  line-height: 32px;
}
.van-cell__value {
  width: auto;
  font-size: 14px;
  color: rgba(154, 163, 173, 1);
  margin: auto;
  text-align: right;
  top: 1px;
  flex: 3;
  overflow: visible;
}
.van-nav-bar__right {
  font-size: 13px;
  line-height: 40px;
  height: auto;
}
.van-nav-bar__text {
  color: rgba(74, 144, 224, 1);
}
.v-button {
  background: rgba(74, 144, 224, 1);
  color: #fff;
  width: 340px;
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
}
.v-button[disabled] {
  background: rgba(74, 144, 224, 0.5);
}
.v-img {
  height: 36px;
  width: 36px;
  border-radius: 18px;
  margin: 0;
  position: absolute;
  top: 50%;
  left: 90%;
  transform: translate(-50%, -50%);
}
</style>


<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" @click-right="goToMessage">
      <div slot="right" class="clock">
        <div v-if="hasNewMessage" class="ret-dot"></div>
        <img
          src="@/assets/home/ic_message.png"
          class="clock-img"
          alt
          @click="$router.push('message')"
        >
      </div>
    </van-nav-bar>

    <!-- 显示账户名称等信息 -->
    <div class="accountSketch">
      <template v-if="!alreadyLogin">
        <img src="@/assets/account/pic_head.png" class="notloginhead">
        <p class="notloginlabel" @click="goToLogin">登录/注册</p>
      </template>
      <template v-else>
        <!-- 账号名称 -->
        <div class="accountContent clearfix">
          <div class="details fl">
            <img
              :src="userAccountInfo.headpicurl"
              class="headPic fl"
              @click="itemClick({id:'accountsetting',path:'/accountSettings',requireLoginFirst: true})"
            >
            <!-- <img src="@/assets/account/pic_head.png" class="headPic fl"> -->
            <div class="fl">
              <p class="accountname">{{ userAccountInfo.realname }}</p>
              <p class="accountphone">{{ userAccountInfo.account }}</p>
            </div>
          </div>
          <!-- 优惠券 -->
          <div
            class="coupons fl"
            @click="itemClick({id:'privilege',path:'/privilege',requireLoginFirst: true})"
          >
            <div class="coupinscontent">
              <div class="fl couponleft">
                <p class="couponshint">优惠券</p>
              </div>
              <div class="fl couponright">
                <p class="totalcoupons">
                  {{ userCouponsInfo.totalCashAmount }}
                  <span>元&nbsp;|&nbsp;</span>
                  {{ userCouponsInfo.totalCanUseCount }}
                  <span>张</span>
                </p>
                <p class="soonexpired">
                  {{userCouponsInfo.totalExipiringCount}}
                  <span>张即将过期</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="seperate"></div>
        <div class="accountContent clearfix">
          <!-- 总资产 -->
          <div class="totalbalance fl">
            <p class="balancelabel">总资产（元）</p>
            <p v-if="amountVisiable" class="balancenum">{{ userBalanceInfo.assets }}</p>
            <p v-else class="balancenum">********</p>
          </div>
          <!-- 总负债 -->
          <div class="totaldebet fl">
            <div class="clearfix">
              <p class="fl debetlabel">总负债（元）</p>
              <img
                v-if="amountVisiable"
                class="fl eyeicon"
                src="@/assets/account/ac_ic_see.png"
                @click="visiableChange(false)"
              >
              <img
                v-else
                class="fl eyeicon"
                src="@/assets/account/ac_ic_Invisible.png"
                @click="visiableChange(true)"
              >
            </div>
            <p v-if="amountVisiable" class="debetnum">{{ userBalanceInfo.debt }}</p>
            <p v-else class="debetnum">****</p>
          </div>
        </div>
      </template>
    </div>
    <!-- 显示账户余额等信息 -->
    <div class="balance">
      <div class="balanceDetail">
        <div class="fl">
          <p class="availableBalance">可用余额（元）</p>
          <p v-if="amountVisiable" class="availableBalanceAmount">{{ userBalanceInfo.balance }}</p>
          <p v-else class="availableBalanceAmount">********</p>
        </div>
        <div
          class="fr recharge"
          @click="itemClick({id:'recharge', path:'/recharge',requireLoginFirst: true})"
        >
          <img class="fl" src="@/assets/account/ac_ic_recharge.png">
          <p class="fl">充值</p>
        </div>
        <div class="fr seperator"/>
        <div
          class="fr withDraw"
          @click="itemClick({id:'withdraw', path:'/withdraw',requireLoginFirst: true})"
        >
          <img class="fl" src="@/assets/account/ac_ic_withdraw.png">
          <p class="fl">提现</p>
        </div>
      </div>
    </div>
    <!-- 显示菜单栏 -->
    <div class="accountItems">
      <template v-for="(item, index) in accountItems">
        <div class="fl item" :key="item.id" @click="itemClick(item)">
          <img class="fl itemIcon" :src="item.icon">
          <p class="fl itemLabel">{{ item.label }}</p>
        </div>
        <div v-if="index%2==0" :key="index" class="fl verticalSeperate"/>
        <div v-else-if="index!=accountItems.length-1" :key="index" class="fl horizontalSeperate"/>
      </template>
    </div>
    <!-- 显示底部提示 -->
    <div class="insurancehint flex-row-center" v-show="false">
      <img class="insuranceicon" src="@/assets/home/foot_ic_protect.png" alt>
      <span class="insurancelabel">账户资金安全由安心财险承保</span>
    </div>
    <div class="customerTel flex-row-center">
      <img class="customerTelIcon" src="@/assets/home/foot_ic_customer.png" alt>
      <a href="tel:4000-119-888" class="customerTelLabel">4000-119-888</a>
    </div>
  </div>
</template>

<script>
import {
  GetUserAccount,
  GetUserAccountInfo,
  GetCouponsStatus
} from "@/api/account.js";
import openEscrow from "@@/openEscrow/openEscrowAccount.js";
import { LoginOut } from "@/api/login.js";
import { GetMessageCountUtils } from "@/utils/messageUtils.js";
import AppEventHandler from "@/utils/AppEventHandler.js";

export default {
  data() {
    return {
      account: null,
      accountInfo: null,
      couponsInfo: null,
      amountVisiable: true,
      hasNewMessage: false
    };
  },
  computed: {
    alreadyLogin() {
      var token = localStorage.getItem("token");
      return token && token != "undefined" && token.length > 0;
    },
    userAccountInfo() {
      var params = {};
      var _accountInfo = this.accountInfo;
      if (_accountInfo != null && _accountInfo.length === 0) {
        _accountInfo = null;
      }
      // 用户名
      if (_accountInfo === null) {
        params.realname = "未知";
        params.headpicurl = require("@/assets/account/pic_head.png");
        params.account = "***********";
      } else {
        params.realname =
          _accountInfo.isopenescrow === 1 ? _accountInfo.realname : "未开户";
        if (params.realname.length === 0) {
          params.realname = "未知";
        }
        params.headpicurl =
          _accountInfo.headpicurl.length > 0
            ? _accountInfo.headpicurl
            : require("@/assets/account/pic_head.png");
        params.account =
          _accountInfo.useraccount.slice(0, 3) +
          "****" +
          _accountInfo.useraccount.slice(-4, _accountInfo.useraccount.length);
      }

      return params;
    },
    userBalanceInfo() {
      var params = {};
      var _account = this.account;
      if (_account != null && _account.length === 0) {
        _account = null;
      }

      if (_account === null) {
        params.assets = "0.00";
        params.debt = "0,00";
        params.balance = "0.00";
      } else {
        params.assets = _account.assets.toFixed(2);
        params.debt = _account.debt.toFixed(2);
        params.balance = _account.blanceamount.toFixed(2);
      }
      return params;
    },
    userCouponsInfo() {
      var params = {};
      var _couponInfo = this.couponsInfo;

      if (_couponInfo === null) {
        params.totalCashAmount = "0.00";
        params.totalCanUseCount = "0";
        params.totalExipiringCount = "0";
      } else {
        params.totalCashAmount = _couponInfo.totalcashamount.toFixed(2);
        params.totalCanUseCount = _couponInfo.totalcanusecount;
        params.totalExipiringCount = _couponInfo.totalexipiringcount;
      }

      return params;
    },
    accountItems() {
      return [
        {
          id: "myInvest",
          label: "我的投资",
          icon: require("@/assets/account/ac_ic_investment.png"),
          path: "/investments",
          requireLoginFirst: true
        },
        {
          id: "tradesDetail",
          label: "交易详情",
          icon: require("@/assets/account/ac_ic_jiaoyi.png"),
          path: "/tradeDetails",
          requireLoginFirst: true
        },
        {
          id: "privilege",
          label: "会员特权",
          icon: require("@/assets/account/ac_ic_privilege.png"),
          path: "/privilege",
          requireLoginFirst: true
        },
        {
          id: "mybankcard",
          label: "我的银行卡",
          icon: require("@/assets/account/e_ac_ic_card.png"),
          path: "/bankcard",
          requireLoginFirst: true
        },
        {
          id: "newfriend",
          label: "邀请有礼",
          icon: require("@/assets/account/ac_ic_invite.png"),
          path: "/invitePresent",
          requireLoginFirst: false
        },
        {
          id: "lottery",
          label: "参与抽奖",
          icon: require("@/assets/account/ac_ic_lottery.png"),
          path: "/drawPrize",
          requireLoginFirst: false
        },
        {
          id: "feedback",
          label: "意见反馈",
          icon: require("@/assets/account/ac_ic_feedback.png"),
          path: "/feedback",
          requireLoginFirst: true
        },
        {
          id: "accountsetting",
          label: "账户设置",
          icon: require("@/assets/account/ac_ic_set.png"),
          path: "/accountSettings",
          requireLoginFirst: true
        }
      ];
    }
  },
  methods: {
    goToLogin() {
      this.$router.push("/login");
    },
    goToMessage() {
      this.$router.push("/message");
    },
    visiableChange(visiable) {
      this.amountVisiable = visiable;
    },
    itemClick(obj) {
      if (obj.requireLoginFirst && !this.alreadyLogin) {
        this.goToLogin();
        return;
      }

      this.$router.push(obj.path);
      return;
    }
  },
  mounted() {
    if (!this.alreadyLogin) {
      this.account = null;
      this.accountInfo = null;
      this.couponsInfo = null;
      return;
    }
    this.account = JSON.parse(localStorage.getItem("account"));
    this.accountInfo = JSON.parse(localStorage.getItem("accountInfo"));
    GetUserAccount()
      .then(response => {
        if (response.ResultCode == 0) {
          this.account = response.Data;
          localStorage.setItem("account", JSON.stringify(this.account));
        }
      })
      .catch(error => {});
    GetUserAccountInfo()
      .then(response => {
        if (response.ResultCode == 0) {
          this.accountInfo = response.Data;
          localStorage.setItem("accountInfo", JSON.stringify(this.accountInfo));
        }

        if (this.accountInfo && this.accountInfo.isopenescrow != 1) {
          openEscrow();
        }
      })
      .catch(error => {});
    GetCouponsStatus()
      .then(response => {
        if (response.ResultCode == 0) {
          this.couponsInfo = response.Data;
        }
      })
      .catch(error => {});
    GetMessageCountUtils((personal, activity, system, error) => {
      this.hasNewMessage = personal + system > 0;
    });
  }
};
</script>

<style scoped lang='scss'>
img {
  width: 100%;
  height: 100%;
}

.clock {
  width: 16px;
  height: 18px;
  position: relative;
  .ret-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(247, 54, 54, 1);
    top: 9px;
    right: 0;
  }
}

.accountSketch {
  height: 223px;
  background-image: url("../../assets/account/ac_bg.png");
  background-size: 100% 100%;
  .notloginhead {
    width: 70px;
    height: 70px;
    margin-top: 27px;
    border: 1px solid white;
    border-radius: 35px;
  }
  .notloginlabel {
    color: rgba(250, 250, 250, 1);
    border-radius: 21px;
    line-height: 42px;
    width: 130px;
    font-size: 16px;
    border: 1px solid white;
    margin: 15px auto;
  }
}

.accountSketch .accountContent {
  margin-left: 15px;
}

.accountSketch .accountContent .details {
  width: 53%;
  height: 87px;
  .headPic {
    margin-top: 15px;
    margin-right: 10px;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: 1px solid #E1F2FD;
  }
  .accountname {
    margin-top: 21px;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
    text-align: left;
  }
  .accountphone {
    margin-top: 10px;
    width: 92px;
    line-height: 26px;
    background: rgba(101, 160, 228, 1);
    border-radius: 13px;
    border: 1px solid rgba(147, 189, 236, 1);
    opacity: 0.8;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
    line-height: 21px;
  }
}

.accountSketch .accountContent .coupons {
  height: 87px;
  .coupinscontent {
    margin-top: 15px;
    overflow: hidden;
    padding-top: 5px;
    padding-right: 5px;
    p {
      font-size: 12px;
      color: white;
    }
    span {
      font-size: 12px;
      color: rgba(197, 217, 243, 1);
    }
    .couponleft {
      background-image: url("../../assets/account/coupons_left.png");
      background-size: 100% 100%;
      width: 20px;
      height: 46px;
      display: flex;
      text-align: center;
      .couponshint {
        margin: auto;
        line-height: 15px;
        font-size: 12px;
        color: white;
      }
    }
    .couponright {
      background-image: url("../../assets/account/coupons_right.png");
      background-size: 100% 100%;
      margin-left: 1.5px;
      padding-left: 3px;
      height: 46px;
      .totalcoupons {
        text-align: left;
        margin-top: 5px;
        margin-right: 10px;
      }
      .soonexpired {
        text-align: left;
        margin-top: 12px;
        margin-bottom: 8px;
        margin-right: 10px;
      }
    }
  }
}

.accountSketch .seperate {
  width: calc(100% - 30px);
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin-left: 15px;
  margin-bottom: 6px;
}

.accountSketch .accountContent .totalbalance {
  width: 53%;
  height: 93px;
  text-align: left;
  .balancelabel {
    margin-left: 12px;
    margin-top: 25px;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .balancenum {
    margin-left: 12px;
    margin-top: 18px;
    font-size: 21px;
    color: rgba(255, 255, 255, 1);
  }
}

.accountSketch .accountContent .totaldebet {
  text-align: left;
  max-width: 47%;
  height: 93px;
  .debetlabel {
    margin-top: 25px;
    font-size: 12px;
    color: rgba(255, 255, 255, 1);
  }
  .eyeicon {
    margin-top: 25px;
    width: 19px;
    height: 12px;
    object-fit: contain;
  }
  .debetnum {
    margin-top: 18px;
    font-size: 21px;
    color: rgba(255, 255, 255, 1);
  }
}

.balance {
  height: 81px;
  position: relative;
  background: rgba(250, 250, 250, 1);
  .balanceDetail {
    margin: 0 auto;
    border-radius: 5px;
    position: relative;
    width: 355px;
    height: 98px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 24px 0px rgba(195, 195, 195, 0.5);
    bottom: 35px;
    .availableBalance {
      text-align: left;
      margin-top: 25px;
      margin-left: 24px;
      font-size: 12px;
      color: rgba(154, 163, 173, 1);
    }
    .availableBalanceAmount {
      text-align: left;
      margin-top: 17px;
      margin-left: 24px;
      font-size: 21px;
      color: rgba(49, 49, 52, 1);
    }
    .recharge {
      margin-top: 41px;
      margin-right: 25px;
      img {
        width: 20px;
        height: 18px;
      }
      p {
        font-size: 16px;
        color: rgba(255, 145, 0, 1);
        line-height: 20px;
        vertical-align: middle;
        margin-left: 9px;
      }
    }
    .seperator {
      margin: 35px 17px auto 17px;
      width: 1px;
      height: 28px;
      background: rgba(237, 237, 237, 1);
    }
    .withDraw {
      margin-top: 41px;
      img {
        width: 20px;
        height: 18px;
      }
      p {
        font-size: 16px;
        color: rgba(74, 144, 224, 1);
        line-height: 20px;
        vertical-align: middle;
        margin-left: 9px;
      }
    }
  }
}

.accountItems {
  width: 360px;
  height: 266px;
  position: relative;
  padding-left: 15px;
  background: white;
  .item {
    width: 171px;
    height: 65px;
    .itemIcon {
      margin-left: 35px;
      margin-top: 25px;
      width: 18px;
      height: 18px;
      object-fit: contain;
    }
    .itemLabel {
      margin-top: 25px;
      margin-left: 15px;
      font-size: 16px;
      color: rgba(49, 49, 52, 1);
      line-height: 18px;
    }
  }
  .verticalSeperate {
    margin-top: 17px;
    width: 1px;
    height: 30px;
    background: rgba(237, 237, 237, 1);
  }
  .horizontalSeperate {
    width: 345px;
    height: 1px;
    background: rgba(237, 237, 237, 1);
  }
}

.insurancehint {
  background: rgba(250, 250, 250, 1);
  .insuranceicon {
    margin-top: 25px;
    width: 14px;
    width: 14px;
    margin-right: 7px;
  }
  .insurancelabel {
    margin-top: 25px;
    font-size: 12px;
    color: rgba(99, 105, 118, 1);
  }
}

.customerTel {
  background: rgba(250, 250, 250, 1);
  .customerTelIcon {
    margin-top: 16px;
    width: 12px;
    width: 12px;
    margin-right: 7px;
  }
  .customerTelLabel {
    margin-top: 18px;
    font-size: 12px;
    color: rgba(51, 61, 83, 1);
  }
}
</style>

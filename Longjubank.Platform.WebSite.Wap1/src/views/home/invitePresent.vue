<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="goBack"></van-nav-bar>

    <div class="banner">
      <div class="openrules" @click="popRules=true"></div>
    </div>
    <div class="unit">
      <div class="title"></div>
      <div class="godrawprize">
        <div @click="$router.push({name:'drawPrize'})" class="draw-prize"></div>
      </div>
    </div>
    <div class="unit invite">
      <div class="title invitefuc"></div>
      <div class="red-btn" @click="openCode">我的二维码</div>
      <div class="black-text">当面或发送二维码邀请好友</div>
      <div class="or"></div>
      <div
        @click="copyurl"
        class="copysrc red-btn copybtn"
        :data-clipboard-text="'我用【龙驹财行】赚了不少钱！早餐费、外卖配送费、公交车钱，吃穿住行不用愁，快来和我一起补贴生活零用吧！'+shareData.personalurl"
      >复制链接</div>
      <div class="black-text copyinvite">复制链接邀请好友</div>
      <div class="step"></div>
    </div>
    <div class="unit record">
      <div class="title record-title"></div>
      <div class="recordcontain">
        <div v-if="token&&inviteList.length>0">
          <div class="record-head record-unit clearfix">
            <div class="first fl weight">序号</div>
            <div class="second fl weight">好友姓名</div>
            <div class="third fl weight">注册时间</div>
          </div>
          <div class="record-contain" ref="fuel">
            <ul class="record-list" ref="ziel">
              <li class="record-unit clearfix" v-for="(item,index) in inviteList" :key="index">
                <div class="first fl">{{index+1}}</div>
                <div class="second fl">{{item.friendname}}</div>
                <div class="third fl">{{item.registertime.slice(0,10)}}</div>
              </li>
            </ul>
          </div>
        </div>
        <div v-else-if="token&&inviteList.length==0">
          <div class="none-record"></div>
          <div class="textinfo">
            <span>暂无记录</span>
          </div>
        </div>
        <div v-else>
          <div class="none-record"></div>
          <div class="textinfo">
            <span>先登录后才能查看哦</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 二维码弹窗 -->
    <van-dialog v-model="popcode" class="code-pop" :showConfirmButton="false">
      <div @click="popcode=false" class="code-close"></div>
      <div style=";position:relative;top:15px;left:0;right:0;margin:auto">
        <canvas id="canvas"></canvas>
        <img v-if="portraitUrl" :src="portraitUrl" class="logo" alt>
        <img v-else src="@/assets/home/logo.png" class="logo" alt>
        <div style="position:absolute;top:0;left:0;"></div>
      </div>
      <div class="notice-text">邀请好友扫一扫，注册龙驹</div>
    </van-dialog>

    <!-- 规则说明弹窗 -->
    <van-popup v-model="popRules" class="rules-explain">
      <div @click="popRules=false">
        <div class="head">规则说明</div>
        <ul class="neirong">
          <li>1、被邀请人除新手计划外，首次单笔投资金额达到10000元，奖励邀请双方各68元现金券;</li>
          <li>2、68元现金券自发放之日起30天内有效，单笔投资金额满5000元，即可使用该现金券(需选择支持现金券的理财计划);</li>
          <li>3、每成功邀请一位好友注册并实名认证，即可获得抽奖机会3次，抽奖规则详见“抽奖活动”页面;</li>
          <li>4、活动截止时间以龙驹财行平台公告为准。</li>
          <li class="te">如有任何疑问请咨询在线客服，或致电4000-119-888查询本活动最终解释权归龙驹财行所有</li>
        </ul>
      </div>
      <!-- <van-dialog v-model="popRules" class="rules-explain" :showConfirmButton="false"> -->

      <!-- </van-dialog> -->
    </van-popup>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import QRCode from "qrcode";
import { GETPERSONURL, INVITERECORD, GETPORTRAIT } from "@/api/home";
export default {
  data() {
    return {
      shareData: {},
      popcode: false,
      token: localStorage.getItem("token"),
      inviteList: [],
      popRules: false,
      portraitUrl: ""
    };
  },
  methods: {
    copyurl() {
      if (!this.token) {
        this.$router.push({ name: "login" });
      }
    },
    scroll(fuel, ziel, time = 60) {
      this.$nextTick(function() {
        if (this.inviteList.length <= 0) {
          return;
        }
        let fu = this.$refs[fuel];
        let zi = this.$refs[ziel];
        let containHeight = fu.offsetHeight;
        let zielHeight = zi.offsetHeight;
        let unitHeight = zi.firstChild
          ? this.$refs[ziel].firstChild.offsetHeight
          : 0;
        if (zielHeight > containHeight) {
          setInterval(() => {
            if (!zi.style.marginTop) {
              zi.style.marginTop = 0 + "px";
            }
            zi.style.marginTop = parseInt(zi.style.marginTop) - 1 + "px";
            let marginT =
              parseInt(zi.style.marginTop) >= 0
                ? parseInt(zi.style.marginTop)
                : -1 * parseInt(zi.style.marginTop);
            if (marginT >= unitHeight) {
              let firstChild = zi.firstChild;
              zi.removeChild(firstChild);
              zi.style.marginTop = 0 + "px";
              zi.appendChild(firstChild);
            }
          }, time);
        }
      });
    },
    openCode() {
      if (this.token) {
        this.popcode = true;
        this.$nextTick(function() {
          this.generateCode();
        });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    copyFuc() {
      var clipboard = new Clipboard(".copybtn");

      clipboard.on("success", e => {
        if (this.token) {
          this.$toast("复制成功");
        }
        e.clearSelection();
      });

      clipboard.on("error", e => {
        this.$toast("失败");
      });
    },
    generateCode() {
      var canvas = document.getElementById("canvas");
      QRCode.toDataURL(
        canvas,
        this.shareData.personalurl,
        { errorCorrectionLevel: "H", width: "186" },
        function(error) {
          if (error) console.log(error);
          console.log("success!");
        }
      );
    },
    getPersonUrl() {
      GETPERSONURL().then(res => {
        if (res.ResultCode == 0) {
          this.shareData = res.Data;
          this.generateCode();
        }
      });
    },
    getInviteList() {
      INVITERECORD({ pagesize: 1000, pageindex: 1 }).then(res => {
        if (res.ResultCode == 0) {
          this.inviteList = res.Data.inviterecordlist;
          this.scroll("fuel", "ziel");
        }
        console.log(res, "邀请记录");
      });
    }
  },
  mounted() {
    this.copyFuc();
    if (this.token) {
      this.getPersonUrl();
      this.getInviteList();
      GETPORTRAIT().then(res => {
        if (res.Data.headpicurl) {
          this.portraitUrl = res.Data.headpicurl;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.page {
  background: #f7dfaa;
  padding-bottom: 36px;
}
.banner {
  height: 604px;
  background: url(~@/assets/home/banner.png) center / 100% 100%;
  position: relative;
  .openrules {
    // width:
    position: absolute;
    width: 64px;
    height: 18px;
    top: 256px;
    left: 298px;
  }
}

.unit {
  position: relative;
  width: 350px;
  height: 271px;
  margin: 27px auto 0 auto;
  background: white;
  border-radius: 10px;
  .title {
    position: absolute;
    top: -5px;
    left: 0;
    right: 0;
    margin: auto;
    background: url(~@/assets/home/titletwo.png) center / 100% 100%;
    width: 167px;
    height: 32px;
  }
  .godrawprize {
    position: absolute;
    top: 60px;
    width: 256px;
    height: 176px;
    left: 0;
    right: 0;
    margin: auto;
    background: url(~@/assets/home/drawprize.png) center / 100% 100%;
  }
  .draw-prize {
    position: absolute;
    top: 142px;
    height: 29px;
    left: 78px;
    width: 98px;
  }
  &.invite {
    height: 485px;
  }
  .invitefuc {
    background: url(~@/assets/home/invitefun.png) center / 100% 100%;
  }
  .red-btn {
    background: #ff5c59;
    width: 135px;
    height: 32px;
    font-size: 12px;
    line-height: 32px;
    color: white;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 100px;
  }
  .black-text {
    color: #313134;
    font-size: 12px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 152px;
  }
  .or {
    position: absolute;
    background: url(~@/assets/home/or.png) center / 100% 100%;
    height: 35px;
    width: 321px;
    left: 0;
    right: 0;
    margin: auto;
    top: 207px;
  }
  .copysrc {
    top: 268px;
  }
  .copyinvite {
    top: 319px;
  }
  .step {
    width: 300px;
    height: 95px;
    background: url(~@/assets/home/step.png) center / 100% 100%;

    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 367px;
  }
  &.record {
    height: 305px;
    padding-top: 45px;
    color: #313134;
    font-size: 12px;
    // margin-bottom: 36px;
    // padding-left: 29px;
    // padding-right: 10px;
  }
  .record-title {
    background: url(~@/assets/home/inviterecord.png) center / 100% 100%;
  }
  .record-unit {
    // margin-bottom: 14px;
    padding-bottom: 14px;
  }
  .record-head {
    .weight {
      font-weight: 700;
    }
    margin-top: 0;
  }
  .recordcontain {
    // text-align: left;
    width: 312px;
    margin-left: 29px;
    position: relative;
  }
  .first {
    width: 26px;
  }
  .second {
    width: 75px;
    margin-left: 47px;
  }
  .third {
    width: 72px;
    margin-left: 60px;
  }
  .record-list {
    overflow: auto;
  }
}
.record-contain {
  padding-top: 14px;
  height: 257px;
  overflow: auto;
}
.none-record {
  width: 89px;
  height: 92px;
  position: absolute;
  background: url(~@/assets/moneyManage/nologin.png) no-repeat center / 89px
    92px;
  left: 104px;
  top: 80px;
}
.textinfo {
  font-size: 12px;
  color: #666666;
  position: absolute;
  top: 200px;
  margin-left: -10px;
  left: 50%;
  right: 0;
  transform: translateX(-50%);
}
.code-pop {
  width: 221px;
  height: 251px;
  // position: relative;
  .code-close {
    position: absolute;
    width: 12px;
    height: 12px;
    background: red;
    right: 12px;
    top: 12px;
    background: url(~@/assets/moneyManage/-e-ic_colse.png) center/100% 100%;
    z-index: 1;
  }
  #canvas {
    width: 186px;
    height: 186px;
    // width: 166px;
    // height: 166px;
  }
  .logo {
    background: white;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    width: 39px;
    height: 39px;
  }
  .notice-text {
    font-size: 14px;
    color: #ff5c59;
    margin-top: 14px;
    z-index: 1;
    position: relative;
  }
}
.rules-explain {
  width: 300px;
  padding: 27px 0;
  .head {
    background: url(~@/assets/home/invitation_ic_08.png) no-repeat center/161px
      15px;
    font-size: 15px;
    font-weight: 500;
  }
  .neirong {
    font-size: 13px;
    line-height: 20px;
    width: 256px;
    color: #838383;
    margin: 0 auto;
    text-align: left;
    margin-top: 21px;
  }
  .te {
    margin-top: 20px;
  }
}
</style>

<template>
  <div class="page">
    <div style="height:40px"></div>
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK()"></van-nav-bar>

    <div class="object">
      <h2>{{$route.query.planname}}</h2>
      <div style="opacity:0.5;margin-top:20px" class="clearfix">
        <span
          class="fl"
        >年化收益{{$route.query.fixedinterestrate==0 ? `${Number($route.query.annualrate).toFixed(2)}%`:`${Number($route.query.annualrate-$route.query.fixedinterestrate).toFixed(2)}%+${Number($route.query.fixedinterestrate).toFixed(2)}%` }}</span>
        <span class="fl right">投资期限{{$route.query.investmentterm}}天</span>
      </div>
    </div>
    <div class="maxnum flex-row-between">
      <span class="more-text">本次最多可投:</span>
      <span class="more-text">{{Number($route.query.maxbidamount).toFixed(2)}}元</span>
    </div>
    <div class="invest">
      <p class="balance">可用余额: {{data.blanceamount}}元</p>
      <div class="money">
        <van-field
          class="count"
          type="number"
          v-model="count"
          @input="validator()"
          center
          maxlength="9"
          clearable
          placeholder="请输入100的整数倍"
        >
          <span slot="left-icon">￥</span>
        </van-field>
      </div>
      <div class="expect">
        <div v-if="validatorCount&&isThanMaxbidamount">
          <span class="black">预期到期净收益:</span>
          <span class="orange">{{expectProfit}}</span>
          <span class="black">元</span>
        </div>
        <div v-else-if="!isThanMaxbidamount" class="orange">投资金额不得高于最多可投金额</div>

        <div v-else class="orange">投资金额必须是100的倍数</div>
      </div>
    </div>
    <div class="separate"></div>
    <div class="coupon-cantain">
      <coupon-cell
        ref="coupon"
        v-if="Number($route.query.useprivilege)>0"
        class="coupon"
        :value="couponStatus"
        @click="openCoupon"
      ></coupon-cell>
      <div v-if="fanli_switch" class="signback flex-row-between">
        <p>
          <span>签到返利（</span>
          <span class="orange">{{Number($route.query.weixinsigngiftsbalance).toFixed(2)}}</span>
          <span>元）</span>
        </p>
        <div
          class="switch"
          @click="is_switch=!is_switch"
          :class="{switched:is_switch,'not-switch':!is_switch}"
        ></div>
      </div>
      <div v-else class="signin">签到返利（{{Number($route.query.weixinsigngiftsbalance).toFixed(2)}}元）</div>
    </div>
    <div class="agreement flex-row-start">
      <div
        class="agreeswitch"
        @click="agreeis_switch=!agreeis_switch"
        :class="{agreeswitched:agreeis_switch,'agreenot-switch':!agreeis_switch}"
      ></div>

      <div class="agreetext">
        同意按
        <span style="color:#4A90E2">
          <span @click="goPage('/p2ph5/person/protocol/manageInvest.html','债券投资咨询与服务协议')">《龙驹财行服务协议》</span>
          <span>/</span>
          <span @click="goPage('/p2ph5/person/protocol/manageContract.html','授权委托书')">《投资授权委托书》</span>
        </span>
        <span>的格式的格式和条款生成协议</span>
      </div>
    </div>
    <div style="flex:1"></div>

    <div v-show="hidshow" class="footer flex-row-start">
      <!-- <div v-show="true" class="footer flex-row-start"> -->
      <div class="realmoney">
        <span>共需支付</span>
        <span class="orange">{{Global.tofixed2(count)}}</span>
        <span>元</span>
      </div>
      <div
        :class="{'not-submit':!validatorCount || !count || !isThanMaxbidamount}"
        class="submit"
        @click="orderSubmit"
      >确认</div>
    </div>
    <!-- 是否选择优惠券 -->
    <van-dialog v-model="show" class="is_coupon" :showConfirmButton="false">
      <div class="head"></div>
      <div class="pop-coupon-text">
        <span>您有</span>
        <span class="orange">{{newCouponList.length}}张优惠券</span>可以使用，是否立即进行选择使用？
      </div>
      <div class="flex-row-start">
        <div class="btn cancel" @click="goPay">取消</div>
        <div class="btn ok" @click="popcoupon=true;show=false">去选择</div>
      </div>
    </van-dialog>
    <van-nav-bar
      v-if="popcoupon"
      class="coupon-title"
      :title="'选择优惠券'"
      left-arrow
      @click-left="popcoupon=false"
    ></van-nav-bar>
    <van-actionsheet v-model="popcoupon" class="pop-coupon">
      <coupons
        v-for="item in newCouponList"
        :key="item.mpno"
        :coupon="item"
        style="margin-top:15px;"
        @getCouponNo="getMpno"
      ></coupons>
    </van-actionsheet>
  </div>
</template>


<script>
import { GETBALANCE, SUBMITORDER } from "@/api/moneyManage";
import { GetUserAccountInfo } from "@/api/account.js";
import openEscrow from "@@/openEscrow/openEscrowAccount.js";
var html = document.getElementsByTagName("html")[0];
var body = document.getElementsByTagName("body")[0];
var app = document.getElementById("app");
import { CouponCell, CouponList } from "vant";
import Coupons from "@@/privilege/couponsPrivilege";

export default {
  name: "orderDeatil",
  data() {
    return {
      count: "",
      couponStatus: "暂无可用",
      show: false, //选择优惠券提示
      show1: false,
      is_switch: false, //签到返利的开关
      agreeis_switch: true, //统一协议开关
      data: {},
      newCouponList: [],
      mplist: JSON.parse(localStorage.getItem("mplist")),
      popcoupon: false,
      couponData: {},
      accountInfo: JSON.parse(localStorage.getItem("accountInfo")),
      //解决底部顶起问题
      docmHeight: 0, //默认屏幕高度
      showHeight: 0, //实时屏幕高度
      hidshow: true //显示或者隐藏footer
    };
  },
  components: {
    // 'van-coupon-cell':CouponCell,
    // 'vanCouponList':CouponList
    CouponCell,
    coupons: Coupons
    // CouponList
  },
  computed: {
    //預期收益
    expectProfit() {
      var dayProfit = this.Global.tofixed2(
        (Number(this.count) * Number(this.$route.query.annualrate)) / 100 / 365
      );
      var allProfit = dayProfit * Number(this.$route.query.investmentterm);
      return this.Global.tofixed2(allProfit);
    },
    // 为金额的整数的逻辑
    validatorCount() {
      if (this.count % 100 == 0) {
        return true;
      } else {
        return false;
      }
    },
    // 金额是否大于可投金额逻辑
    isThanMaxbidamount() {
      if (this.count > Number(this.$route.query.maxbidamount)) {
        return false;
      } else {
        return true;
      }
    },
    // 为是否显示返利的逻辑
    fanli_switch() {
      if (!this.count || this.count < 1000) {
        return false;
      } else if (
        Number(this.$route.query.usewinxinprivilege) != 0 &&
        Number(this.$route.query.weixinsigngiftsbalance) > 0
      ) {
        return true;
      } else {
        return false;
      }
    },

    totalAmount() {
      return "";
    }
  },
  methods: {
    goPage(url, title) {
      const src = process.env.VUE_APP_H5SERVER;

      this.$router.push({
        name: "activityDetail",
        query: {
          path: `${src}${url}`,
          title
        }
      });
    },
    orderSubmit() {
      // 获取账户信息
      GetUserAccountInfo().then(response => {
        if (!this.validatorCount || !this.count || !this.isThanMaxbidamount) {
          return;
        }
        if (!this.agreeis_switch) {
          this.$toast({
            message: "你未同意投资协议，请勾选同意",
            duration: 2000
          });
          return;
        }
        // 未开户 或者 未开通自动投标
        if (response.Data.isopenescrow != 1 || !response.Data.isautobid) {
          this.$toast.clear();
          openEscrow();
          return;
        }

        if (
          this.newCouponList.length > 0 &&
          Object.keys(this.couponData).length == 0
        ) {
          this.show = true;
          return;
        }

        if (response.ResultCode != 0) {
          this.$toast({ message: response.ResultMsg, duration: 1500 });
          return;
        }

        this.goPay();
      });

      // $router.push({ name: "payment" });
    },
    //跳转支付页面
    goPay() {
      var params = {
        pid: this.$route.query.pid,
        bidamount: this.count,
        mpno: this.couponData.mpno ? this.couponData.mpno : "",
        weixinsigngiftsamount:
          this.fanli_switch && this.is_switch
            ? this.$route.query.weixinsigngiftsbalance
            : 0
      };
      SUBMITORDER(params).then(res => {
        // alert('jietong')
        if (res.ResultCode == 0) {
          // alert('chenggong')
          this.$router.push({
            name: "payment",
            query: {
              orderid: res.Data.orderid,
              planname: this.$route.query.planname,
              payamount: this.count,
              blanceamount: this.data.blanceamount, //可用余额
              issetpay: this.data.issetpay
            }
          });
        } else {
          // alert(res.ResultMsg)
          this.$toast(res.ResultMsg);
        }
      });
    },

    openCoupon() {
      if (this.newCouponList.length > 0) {
        this.popcoupon = true;
      }
    },
    getMpno(data) {
      this.couponData = data;
      this.popcoupon = false;
      let time = "";
      if (
        Number(data.mpday) <= Number(this.$route.query.investmentterm) &&
        Number(data.mpday) > 0
      ) {
        time += data.mpday;
      } else {
        time += this.$route.query.investmentterm;
      }
      if (data.typeLabel.indexOf("加息券") > -1) {
        this.couponStatus = `${data.typeLabel}：${
          data.mpparameter
        }%（${time}天）`;
      } else if (data.typeLabel.indexOf("理财金券") > -1) {
        this.couponStatus = `${data.typeLabel}：${
          data.mpparameter
        }元（${time}天）`;
      } else if (data.typeLabel.indexOf("现金券") > -1) {
        this.couponStatus = `${data.typeLabel}：${data.mpparameter}`;
      }
    },
    closeCoupon() {},
    validator() {
      // 返利签到逻辑
    }
  },
  created() {
    GETBALANCE().then(res => {
      if (res.ResultCode == 0) {
        console.log(res, "获取可用余额");
        this.data = res.Data;
        localStorage.setItem("account", JSON.stringify(res.Data));
      } else {
        this.$toast(res.ResultMsg);
      }
      // log(res, "获取可用余额");
    });
  },
  watch: {
    // 用来控制优惠券  右边的样式
    couponStatus(val) {
      if (val == "暂无可用") {
        this.$refs.coupon.getElementsByClassName(
          "van-cell__value"
        )[0].style.color = "#969799";
      } else {
        this.$refs.coupon.getElementsByClassName(
          "van-cell__value"
        )[0].style.color = "#ff9100";
      }
    },
    // 监听count变化，显示多少张优惠券可以使用
    count(val) {
      const cplist = this.mplist;
      let newCplist = cplist.filter((item, index) => {
        if (Number(val) >= Number(item.mplimitingparameter)) {
          return item;
        }
      });
      this.newCouponList = newCplist;
      if (newCplist.length > 0) {
        this.couponStatus = `${newCplist.length}张可用`;
      } else {
        this.couponStatus = "暂无可用";
      }
    },
    //显示底部问题
    showHeight: function() {
      if (this.docmHeight > this.showHeight) {
        this.hidshow = false;
      } else {
        this.hidshow = true;
      }
    }
  },

  mounted() {
    html.style.height = "100%";
    body.style.height = "100%";
    app.style.height = "100%";
    setTimeout(() => {
      this.docmHeight = document.body.clientHeight;
      this.showHeight = document.body.clientHeight;
      window.onresize = () => {
        return (() => {
          this.showHeight = document.body.clientHeight;
        })();
      };
    });
  },
  destroyed() {
    html.style.height = "auto";
    body.style.height = "auto";
    app.style.height = "auto";
  }
};
</script>


<style lang="scss" scoped>
.pop-coupon /deep/ .van-cell__title {
  flex: auto;
}
.coupon-title {
  &.van-nav-bar {
    z-index: 3000 !important;
  }
}
.page {
  background: #fafafa;
  height: 100%;
  padding-top: 0;
}
.separate {
  height: 10px;
  opacity: 1;
  background: rgba(250, 250, 250, 1);
}
.object {
  background: linear-gradient(to bottom, #589fef, #4a90e0);
  // height: 90px;
  padding: 23px 15px;
  text-align: left;
  h2 {
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
  }
  span {
    color: rgba(255, 255, 255, 1);
    font-size: 12px;
  }
  .right {
    margin-left: 24px;
    padding-left: 20px;
    border-left: 1px solid rgba(255, 255, 255, 0.2);
  }
}
.maxnum {
  font-size: 12px;
  height: 36px;
  background: rgba(248, 248, 248, 1);
  padding: 0 15px;
}
.invest {
  background: white;
  text-align: left;
  padding: 15px 15px 0 15px;
  .balance {
    font-size: 12px;
    color: rgba(154, 163, 173, 1);
  }
  .money {
  }
  .count {
    font-size: 18px;
    width: 100%;
    padding: 22px 0;
    border-bottom: 1px solid #f4f4f4;
  }
  .expect {
    font-size: 14px;
    line-height: 40px;
  }
  .orange {
    color: rgba(255, 145, 0, 1);
  }
}
.signback {
  height: 50px;
  font-size: 14px;
}
.coupon-cantain {
  background: white;
  padding: 0 15px;
}
.coupon {
  text-align: left;
  height: 50px;
  padding: 0;
  border-bottom: 1px solid rgba(230, 230, 230, 1);
  line-height: 50px;
  div:first-child {
    flex: 1;
  }
  .van-cell__value {
    flex: 2;
  }
}
/deep/.van-icon.van-icon-arrow.van-cell__right-icon {
  margin-top: 12px;
}

.signin {
  text-align: left;
  height: 50px;
  line-height: 50px;
  font-size: 14px;
  color: rgba(154, 163, 173, 1);
}
.footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  height: 48px;
  line-height: 48px;
  font-size: 16px;
  background: white;

  .realmoney {
    padding-left: 15px;
    text-align: left;
    flex: 1;
  }
  .orange {
    color: rgba(255, 145, 0, 1);
  }
  .submit {
    width: 134px;
    background: rgba(74, 144, 226, 1);
    color: rgba(255, 255, 255, 1);
  }
  .not-submit {
    background: rgba(74, 144, 226, 0.5);
  }
}

.is_coupon {
  padding-bottom: 22px;
  .head {
    height: 128px;
    background: url(~@/assets/moneyManage/pop-coupon.png) no-repeat center /
      100% 100%;
  }
  .pop-coupon-text {
    color: rgba(49, 49, 52, 1);
    text-align: left;
    font-size: 13px;
    padding: 30px 22px 35px 22px;
    line-height: 22px;
  }
  .btn {
    width: 112px;
    height: 40px;
    border-radius: 1px;
    font-size: 17px;
    line-height: 40px;
  }
  .cancel {
    margin-left: 16px;
    border: 1px solid rgba(74, 144, 224, 1);
    color: rgba(74, 144, 224, 1);
  }
  .ok {
    margin-left: 12px;
    color: white;
    background: rgba(74, 144, 224, 1);
    border: 1px solid rgba(74, 144, 224, 1);
  }
}
.third-party {
  padding-bottom: 22px;
  .head {
    height: 128px;
    background: url(~@/assets/moneyManage/bg_kaihu.png) no-repeat center / 100%
      100%;
  }
  .pop-coupon-text {
    color: rgba(49, 49, 52, 1);

    // text-align: left;
    font-size: 15px;
    padding: 30px 22px 30px 22px;
    line-height: 22px;
  }
  .btn {
    width: 112px;
    height: 40px;
    border-radius: 1px;
    font-size: 17px;
    line-height: 40px;
  }
  .cancel {
    margin-left: 16px;
    border: 1px solid rgba(74, 144, 224, 1);
    color: rgba(74, 144, 224, 1);
  }
  .ok {
    margin-left: 12px;
    color: white;
    background: rgba(74, 144, 224, 1);
    border: 1px solid rgba(74, 144, 224, 1);
  }
}
.switch {
  width: 18px;
  height: 18px;
}
.switched {
  background: url(~@/assets/moneyManage/ic_selected.png) center / 100% 100%;
}
.not-switch {
  background: url(~@/assets/moneyManage/ic_weixuanze.png) center / 100% 100%;
}

.agreement {
  align-items: flex-start;
  padding: 0 15px;
  margin-top: 15px;
  color: #b9bfc6;
}
.agreeswitch {
  width: 12px;
  height: 12px;
  margin-top: 2px;
}
.agreeswitched {
  background: url(~@/assets/moneyManage/ic_agree.png) center / 100% 100%;
}
.agreenot-switch {
  background: url(~@/assets/moneyManage/ic_un.png) center / 100% 100%;
}
.agreetext {
  width: 305px;
  text-align: left;
  line-height: 18px;
  margin-left: 5px;
  font-size: 12px;
}
.pop-coupon {
  max-height: none;
  padding-top: 40px;
  top: 0;
  background: #fafafa;
}
// /deep/.van-dialog {
//   height: 100%;
//   width: 100% !important;
// }
</style>
<style lang="scss">
.van-dialog {
  width: 270px !important;
}
.notSufficientFunds .van-dialog__cancel .van-button__text,
.notSufficientFunds .van-dialog__confirm .van-button__text {
  font-size: 17px;
  color: rgba(74, 144, 226, 1);
}
.notSufficientFunds .van-dialog__cancel {
  border-right: 1px solid rgba(212, 213, 215, 1);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.notSufficientFunds .van-dialog__header {
  border-bottom: 1px solid rgba(212, 213, 215, 1);
  font-size: 17px;
  font-weight: 500;
  color: rgba(49, 49, 52, 1);
  line-height: 22px;
}
</style>

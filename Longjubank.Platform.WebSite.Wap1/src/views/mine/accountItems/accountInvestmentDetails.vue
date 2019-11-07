<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div class="special_box">
      <div class="box-s clearfix planName" id="topPlan">{{planname}}</div>
      <ul class="special_list clearfix">
        <li>
          <p>原始本金(元)</p>
          <p class="cost">{{bidamount}}</p>
        </li>
        <li>
          <p>待收收益(元)</p>
          <p class="profit">{{waitprofit}}</p>
        </li>
      </ul>
    </div>
    <div class="p-lie">
      <ul>
        <li>
          <span style="font-size:14px;color:rgba(99,105,118,1)">预期年化收益</span>
          <span class="p-percentage">{{annualrate}}%</span>
          <!-- <span class="fr">|</span> -->
        </li>
        <li>
          <span style="font-size:14px;color:rgba(99,105,118,1)">剩余期限</span>
          <span class="p-percentage">{{expiredays}}天</span>
        </li>
      </ul>
    </div>

    <div class="p-list">
      <ul>
        <li class="box-s clearfix">
          <p class="fl icon2">项目类型</p>
          <span class="fr">{{plantypename}}</span>
        </li>

        <li class="box-s clearfix">
          <p class="fl icon_time">投资期限</p>
          <span class="fr">{{investmentterm}}天</span>
        </li>

        <template v-if="activitytype==1">
          <li class="box-s clearfix">
            <p class="fl icon_profit1">理财金券</p>
            <span class="fr bank_text1">{{activityparameter}}元</span>
          </li>
          <li class="box-s clearfix">
            <p class="fl icon_interest1">理财金收益</p>
            <span class="fr bank_loan1">{{activityexpectprofit}}元</span>
          </li>
        </template>

        <template v-else-if="activitytype==2">
          <li class="box-s clearfix">
            <p class="fl icon_profit2">加息券</p>
            <span class="fr bank_text2">{{activityparameter}}%</span>
          </li>
          <li class="box-s clearfix">
            <p class="fl icon_interest2">加息收益</p>
            <span class="fr bank_loan2">{{activityexpectprofit}}元</span>
          </li>
        </template>

        <li v-else-if="activitytype==3" class="box-s clearfix">
          <p class="fl icon99">现金券</p>
          <span class="fr special_cash">{{activityexpectprofit}}元</span>
        </li>

        <li class="box-s clearfix" v-if="WeiXinSignGiftsProfit>0">
          <p class="fl icon_gift">签到返利</p>
          <span class="fr financial_rebate">{{WeiXinSignGiftsProfit}}元</span>
        </li>

        <li class="box-s clearfix">
          <p class="fl icon6">投资日期</p>
          <span class="fr">{{bidtime.substring(0,11)}}</span>
        </li>

        <li class="box-s clearfix">
          <p class="fl icon4">到期时间</p>
          <span class="fr specia l_time">{{expiretime.substring(0,11)}}</span>
        </li>

        <li v-if="backtype==1" class="box-s clearfix">
          <p class="fl icon3">还款方式</p>
          <span class="fr">一次性还本付息</span>
        </li>
        <router-link tag="li" :to="{name:'interestReturn', params:{financialID: getFinancialOrderID()}}" v-else-if="backtype==2" class="box-s clearfix">
          <p class="fl icon3">还款方式</p>
          <img class="icon-back fr" src="@/assets/moneyManage/ic_jiaobiao.png">
          <span class="fr">季度付息到期还本</span>
        </router-link>

        <li class="box-s clearfix">
          <p class="fl icon5">还款日期</p>
          <span class="fr">到期后次日</span>
        </li>
        <router-link tag="li" :to="{name:'creditorList', params:{financialID: getFinancialOrderID()}}" v-if="orderstatus!=10" class="box-s clearfix">
          <p class="fl icon7">投资债权</p>
          <img class="icon-back fr" src="@/assets/moneyManage/ic_jiaobiao.png">
          <span class="fr">{{creditorcount}}笔</span>
        </router-link>
      </ul>

      <img class="p-img" src="../../../assets/account/ic_bid.png">
      <van-button
        :disabled="btStatus"
        class="special-btn"
        @click="getInvestmentAgreementUrl"
      >{{btText}}</van-button>
    </div>
  </div>
</template>

<script>
import {
  MyOrderFinancialDetail,
  GetInvestmentAgreementUrl
} from "@/api/account";
export default {
  mounted() {
    MyOrderFinancialDetail(this.getFinancialOrderID()).then(response => {
      console.log(response);
      if (response.ResultCode == 0) {
        // Toast(response.ResultMsg);
        this.planname = response.Data.planname;
        this.bidamount = this.Global.tofixed2(response.Data.bidamount);
        this.waitprofit = this.Global.tofixed2(response.Data.waitprofit);
        this.annualrate = this.Global.tofixed2(response.Data.annualrate);
        this.expiredays = response.Data.expiredays <=0 ?0:response.Data.expiredays;
        this.plantypename = response.Data.plantypename;
        this.investmentterm = response.Data.investmentterm;
        this.bidtime = response.Data.bidtime.substring(0, 11);
        this.expiretime = response.Data.expiretime.substring(0, 11);
        this.backtype = response.Data.backtype;
        this.btStatus = false;
        this.activitytype = response.Data.activitytype;
        this.activityparameter = response.Data.activityparameter;
        this.activityexpectprofit = response.Data.activityexpectprofit;
        this.WeiXinSignGiftsProfit = response.Data.weixinsigngiftsprofit;
        this.orderstatus = response.Data.orderstatus;
        this.creditorcount = response.Data.creditorcount;
      }
    });
  },
  data() {
    return {
      planname: "",
      //原始本金
      bidamount: "",
      //待收收益
      waitprofit: "",
      //预期收益
      expectprofit: "",
      //年化收益
      annualrate: "",
      //剩余期限
      expiredays: "",
      //项目类型
      plantypename: "",
      //投资期限
      investmentterm: "",
      //
      activitytype: "",
      //理财金券  加息券
      activityparameter: "",
      //理财金收益  加息券  现金券
      activityexpectprofit: "",
      //签到返利
      WeiXinSignGiftsProfit: "",
      //投资日期
      bidtime: "",
      //到期时间
      expiretime: "",
      //==1 一次性还本付息  ==2季度付息到期还本
      backtype: "",
      btText: "《投资协议》",
      btStatus: true,
      //债券协议
      orderstatus: "",
      //债券协议
      creditorcount: ""
    };
  },
  computed: {
    detailData() {
      return "";
    }
  },
  methods: {
    GOBACK() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    getFinancialOrderID() {
      return this.$route.params.id;
    },
    getInvestmentAgreementUrl() {
      GetInvestmentAgreementUrl(this.getFinancialOrderID()).then(response => {
        console.log(response);
        if (response.ResultCode == 0) {
          if (response.Data.investmentagreementurl == "") {
            let _this = this;
            _this.btText = "投资协议生成中...";
            _this.btStatus = false;
            var t1;
            clearInterval(t1);
            t1 = setTimeout(function() {
              clearInterval(t1);
              _this.btText = "《投资协议》";
              _this.btStatus = true;
            }, 2000);
          } else {
            this.showFinancialTreaty(response.Data.investmentagreementurl);
          }
        }
      });
    },
    showBorrowTreaty(orderid) {
      let protocol = orderid;
      this.$router.push({ name: "protocol", params: { protocol } });
    },
    showFinancialTreaty(url) {
      let financialUrl = url;
      this.$router.push({ name: "protocol", params: { financialUrl } });
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  background: #fafafa;
}

.planName {
  color: #fff;
  text-align: center;
  margin-bottom: 48px;
  font-size: 18px;
}

.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.clearfix {
  *zoom: 1;
}
.p-lie {
  clear: both;
  height: 43px;
  border-bottom: 1px solid #ededed;
}

.p-lie ul li {
  width: 50%;
  float: left;
  background: #fff;
  height: 43px;
}

.p-lie ul li span {
  text-decoration: none;
  line-height: 43px;
  text-align: center;
  position: relative;
  bottom: 5px;
}

.p-percentage {
  margin-left: 5px;
  font-size: 16px;
  color: rgba(49, 49, 52, 1);
}

.p-lie ul li a .fr {
  float: right;
  display: inline;
}

.p-list {
  margin-top: 10px;
  padding: 0px 0px 30px;
}

.p-list a {
  text-decoration: none;
}
.p-list ul {
  padding: 0px 15px;
  background: white;
}
.p-list ul li {
  border-bottom: 1px solid #ededed;
  line-height: 50px;
  font-size: 16px;
}
.p-list ul li:last-child {
  border-bottom: none;
}
.fl {
  float: left;
  display: inline;
}

.fr {
  float: right;
  display: inline;
  color: #636976;
  font-size: 14px;
}

.p-img {
  width: 69px;
  height: 69px;
  margin: auto;
  margin-top: -15px;
  display: block;
}
.list-info {
  background: #f2f3f8;
}
/*暂无记录*/
.norecord {
  padding-top: 40%;
  text-align: center;
}

.norecord img {
  width: 20%;
}

.norecord p {
  color: #cbcbcb;
}
.special-btn {
  margin-top: 33px;
  opacity: 1;
  font-size: 16px;
  color: rgba(74, 144, 224, 1);
  line-height: 15px;
  letter-spacing: 0px;
  width: 159px;
  height: 40px;
  opacity: 1;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 1px 12px 0px rgba(195, 195, 195, 0.5);
  border-radius: 20px;
}
.btn_special {
  opacity: 0;
  width: 100%;
  height: 50px;
}
.statementBtn {
  margin-top: 2em;
  display: none;
}
.special_box {
  background: -webkit-linear-gradient(
    bottom,
    rgba(74, 144, 224, 1),
    rgba(88, 159, 239, 1)
  );
  width: 100%;
  padding: 36px 0;
}
.special_list li {
  float: left;
  width: 50%;
  text-align: center;
  font-size: 14px;
}
.special_list li p {
  color: #fff;
}
.special_list li p:last-child {
  font-size: 22px;
  margin-top: 12px;
}
.special_list li p:first-child {
  opacity: 0.5;
}
.p-list ul li .icon-back {
  margin-left: 10px;
  width: 6px;
  height: 12px;
  margin-top: 19px;
}
</style>

<template>
  <div class="detailsContainer page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div v-if="borrowInfo != null" class="contentDetails">
      <div class="contentTitle clearfix">
        <img src="@/assets/account/borrow_details.png" class="fl contentTitleIcon">
        <p class="contentTitleLabel fl">借款详情</p>
      </div>
      <div class="dashSeperate"></div>
      <ul class="contentDetailsList">
        <li class="contentLi clearfix">
          <p class="leftTitle">借款编号</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ borrowInfo.orderId }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">借款用途</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ borrowInfo.purpose }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">借&nbsp;&nbsp;款&nbsp;&nbsp;人</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ borrowInfo.borrowUserName }}</p>
        </li>
        <li v-if="'identifyCard' in borrowInfo" class="contentLi clearfix">
          <p class="leftTitle">身份证号</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ borrowInfo.identifyCard }}</p>
        </li>
        <li v-if="'licenseNumber' in borrowInfo" class="contentLi clearfix">
          <p class="leftTitle">营业执照</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ borrowInfo.licenseNumber }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">借款时间</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ borrowInfo.createtime }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">还款时间</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ borrowInfo.expiretime }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">借款金额</p>
          <p class="colon">：</p>
          <p class="rightLabel blueColor">{{ borrowInfo.borrowAmount }}</p>
        </li>
      </ul>
    </div>
    <div class="contentDetails" v-if="payInfo != null">
      <div class="contentTitle clearfix">
        <img src="@/assets/account/borrow_pay.png" class="fl contentTitleIcon">
        <p class="contentTitleLabel fl">支付详情</p>
      </div>
      <div class="dashSeperate"></div>
      <ul class="contentDetailsList">
        <li class="contentLi clearfix">
          <p class="leftTitle">运&nbsp;&nbsp;单&nbsp;&nbsp;号</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ payInfo.waybillid }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">交易时间</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ payInfo.tradtime }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">交易金额</p>
          <p class="colon">：</p>
          <p class="rightLabel orangeColor">{{ payInfo.trademount }}</p>
        </li>
        <li class="contentLi clearfix">
          <p class="leftTitle">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注</p>
          <p class="colon">：</p>
          <p class="rightLabel">{{ payInfo.orderdesc }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MyFinancialBormachDetail } from "@/api/account.js";
export default {
  data() {
    return {
      borrowInfo: null,
      payInfo: null
    };
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    loadCreditorInfo() {
      MyFinancialBormachDetail(this.$route.params.orderid)
        .then(response => {
          if (response.ResultCode === 0) {
            this.borrowInfo = {};
            this.borrowInfo.orderId = response.Data.bororderid;
            this.borrowInfo.purpose = response.Data.borway;
            this.borrowInfo.borrowUserName = response.Data.borusername;
            this.borrowInfo.borrowerType = response.Data.bortype;
            if (this.borrowInfo.borrowerType === 1) {
              this.borrowInfo.identifyCard = response.Data.cardno;
            } else if (this.borrowInfo.borrowerType === 2) {
              this.borrowInfo.licenseNumber = response.Data.licensenumber;
            }
            this.borrowInfo.createtime = response.Data.createtime.split(
              " "
            )[0];
            this.borrowInfo.expiretime = response.Data.expiretime.split(
              " "
            )[0];
            this.borrowInfo.borrowAmount = response.Data.boramount + '元';

            if (response.Data.waybillid) {
              this.payInfo = {};
              this.payInfo.waybillid = response.Data.waybillid;
              this.payInfo.tradtime = response.Data.tradtime.split(" ")[0];
              this.payInfo.trademount = response.Data.tradamount.toFixed(2) + '元';
              this.payInfo.orderdesc = response.Data.orderdesc;
            }
          }
        })
        .catch(err => {});
    }
  },
  mounted() {
    this.loadCreditorInfo();
  }
};
</script>

<style scoped lang='scss'>
.detailsContainer {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.detailsContainer .contentDetails {
  background: white;
  width: calc(100% - 30px);
  margin-left: 15px;
  margin-top: 15px;
  position: relative;
  .contentTitle {
    margin: 15px;
    .contentTitleIcon {
      width: 26px;
      height: 26px;
    }
    .contentTitleLabel {
      margin-left: 7px;
      font-size: 16px;
      color: rgba(49, 49, 52, 1);
      line-height: 26px;
    }
  }
  .contentDetailsList {
    margin: 15px 0px 10px 10px;
    .contentLi {
      display: table;
      .leftTitle {
        width: 60px;
        font-size: 14px;
        color: rgba(154, 163, 173, 1);
        text-align: left;
        line-height: 30px;
        display: table-cell;
      }
      .colon {
        display: table-cell;
        font-size: 14px;
        color: rgba(154, 163, 173, 1);
        width: 4px;
      }
      .rightLabel {
        line-height: 30px;
        text-align: left;
        font-size: 14px;
        color: #313134;
      }
    }
  }
}
.dashSeperate {
  background-image: url("../../../assets/account/dash_seperate.png");
  background-repeat: repeat;
  height: 1.5px;
  width: 100%;
}

.blueColor {
  color: #549aea !important;
}

.orangeColor {
  color: #ff9100 !important;
}
</style>

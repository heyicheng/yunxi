<template>
  <div ref="page" class="page">
    <van-nav-bar :title="$route.query.title" left-arrow @click-left="GOBACK()"></van-nav-bar>
    <div class="header">
      <div style="height:10px"></div>

      <div class="flex-row-end">
        <div class="platform" v-if="pageData&&pageData.fixedinterestrate">
          <span class="text">平台加息</span>
        </div>
        <div class="platform-tian"></div>
      </div>
      <div class="expect head-text">预期年化收益</div>
      <div class="allrate">
        <span
          class="rate"
          v-if="pageData"
        >{{(pageData.annualrate-pageData.fixedinterestrate).toFixed(2)}}</span>
        <span class="addrate">%</span>
        <span
          class="addrate"
          v-if="pageData.fixedinterestrate"
        >+{{pageData.fixedinterestrate.toFixed(2)}}%</span>
      </div>
      <ul class="detail flex-row-around">
        <li class="left detail-unit">
          <p class="head-text">项目期限</p>
          <p class="count">{{pageData.investmentterm}}天</p>
        </li>
        <li class="middle detail-unit">
          <p class="head-text">剩余可投(元)</p>
          <p class="count">{{toThousands(pageData.maxbidamount)}}</p>
        </li>
        <li class="right detail-unit">
          <p class="head-text">起投金额(元)</p>
          <p class="count">{{pageData.minbidamount}}</p>
        </li>
      </ul>
    </div>

    <ul class="feature flex-row-around">
      <li class="feature-unit flex-col-center">
        <img class="feature-img" src="@/assets/moneyManage/morrow.png" alt>
        <span class="feature-text">次日计息</span>
      </li>
      <li class="feature-unit flex-col-center">
        <img class="feature-img" src="@/assets/moneyManage/creditor.png" alt>
        <span class="feature-text">优质债权</span>
      </li>
      <li class="feature-unit flex-col-center">
        <img class="feature-img" src="@/assets/moneyManage/duty.png" alt>
        <span class="feature-text">连带责任保证</span>
      </li>
    </ul>
    <div class="separate"></div>

    <ul class="description">
      <li class="descriptionp-unit">
        <span class="description-title">投标范围</span>
        <span class="description-text">{{pageData.bidrange}}</span>
      </li>
      <li class="descriptionp-unit">
        <span class="description-title">还款方式</span>
        <span class="description-text">{{pageData.backtype==1 ? '一次性还本付息':'季度付息到期还本'}}</span>
      </li>
      <li class="descriptionp-unit">
        <span class="description-title">还款日期</span>
        <span class="description-text">到期后次日</span>
      </li>
    </ul>

    <div class="separate"></div>

    <div class="tab">
      <ul ref="tabHead" class="tab-head flex-row-around" :class="{'fixed-tab':fixedTab}">
        <li @click="changeTab(0)" :class="{'tab-active':activeTab==0}" class="tab-unit">计划详情</li>
        <li @click="changeTab(1)" :class="{'tab-active':activeTab==1}" class="tab-unit">投资记录</li>
        <li @click="changeTab(2)" :class="{'tab-active':activeTab==2}" class="tab-unit">常见问题</li>
      </ul>
      <div style="height:46px;" v-if="fixedTab"></div>
      <div class="tab-contain">
        <div v-if="activeTab==0">
          <ul class="plan-detail">
            <li class="plan-unit clearfix">
              <div class="plan-title fl">计划说明</div>
              <div class="plan-text fr" v-html="transformHtml"></div>
            </li>
            <li class="clearfix plan-unit">
              <div class="plan-title fl">投标范围</div>
              <div class="plan-text fr">{{pageData.bidrange}}</div>
            </li>
            <li class="clearfix plan-unit">
              <div class="plan-title fl">加入条件</div>
              <div class="plan-text fr">加入金额100元起，且为100元的整数倍递增</div>
            </li>
            <li class="clearfix plan-unit">
              <div class="plan-title fl">起息日</div>
              <div class="plan-text fr" ref="shuoming">次日计息</div>
            </li>
            <li class="clearfix plan-unit">
              <div class="plan-title fl">结清期限</div>
              <div class="plan-text fr">计划到期日</div>
            </li>
            <li class="clearfix plan-unit">
              <div class="plan-title fl">还款日</div>
              <div class="plan-text fr">
                计划到期后次日，投资金额及利息将自动返还到投资
                人账户
              </div>
            </li>
            <li class="clearfix plan-unit">
              <div class="plan-title fl">费用</div>
              <div class="plan-text fr">
                龙驹财行收取投资人投资收益的10%做为管理费
                （{{platformFeeDes}}前暂免）
              </div>
            </li>
            <li class="clearfix plan-unit">
              <div class="plan-title fl">保障方式</div>
              <div class="plan-text fr">
                助贷人履行债务承担义务且第三方担保公司进行连带
                责任保证的方式对投资人权益进行保障
              </div>
            </li>
          </ul>
          <div class="separate"></div>
          <ul class="agreement">
            <li class="agreement-unit flex-row-between" @click="safetyGuarantee">
              <div class>《龙驹财行安全保障计划》</div>
              <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
            </li>
            <li
              class="agreement-unit flex-row-between"
              @click="goPage('/p2ph5/person/protocol/manageInvest.html','债券投资咨询与服务协议')"
            >
              <div class>《债权投资咨询与服务协议》</div>
              <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
            </li>
            <li
              class="agreement-unit flex-row-between"
              @click="$router.push({name:'modelAgreementList'})"
            >
              <div class>《合同范本》</div>
              <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
            </li>
            <li
              class="agreement-unit flex-row-between"
              @click="goPage('/p2ph5/person/protocol/riskDisclosure.html','风险揭示书')"
            >
              <div class>《风险揭示书》</div>
              <img src="@/assets/moneyManage/ic_jiaobiao.png" class="turn-right" alt>
            </li>
          </ul>
          <div class="tianchong" style="height:30px"></div>
          <div class="warn flex-row-center">
            <div class="dan"></div>
            <div style="margin:0 5px">市场有风险，投资需谨慎</div>
            <div class="dan"></div>
          </div>
        </div>
        <div class="invest-record" v-if="activeTab==1">
          <div v-if="!token">
            <div class="norecord-img recordnologin">
              <p class="inverlisttext">登录后可查看投资记录</p>
            </div>
          </div>
          <div v-else-if="recordList.length>0">
            <div class="record-title flex-row-around">
              <span style="flex:1">投资人</span>
              <span style="flex:1;margin-left:10px">投资金额（元）</span>
              <span style="flex:1">投资时间</span>
            </div>
            <ul class="record-list">
              <li
                class="record-unit flex-row-between"
                v-for="(item,index) in realRocordList"
                :key="index"
              >
                <div class="danyuan">
                  <span class="left-name">{{item.bidrealname}}</span>
                </div>
                <div class="danyuan">
                  <span class="middle-amount">{{item.bidamount}}</span>
                </div>
                <div class="danyuan">
                  <span class="right-time">{{item.createtime}}</span>
                </div>
              </li>
            </ul>
          </div>
          <div class="norecord-img" v-else-if="recordList.length==0">
            <p class="inverlisttext">暂无记录</p>
          </div>
        </div>
        <div class="problems" v-if="activeTab==2">
          <ul class="problems-list">
            <li
              class="problems-unit flex-row-start"
              v-for="(item,index) in questionsList"
              :key="index"
            >
              <img class="search" src="@/assets/moneyManage/-e-ic_question.png" alt>
              <div class="problems-text">
                <h2>{{item.asks}}</h2>
                <p>{{item.answers}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="separate" style="height:25px;"></div>
    <div class="tianchong"></div>
    <div class="footer flex-row-start">
      <img @click="show=true" class="calculator" src="@/assets/moneyManage/calculator.png" alt>
      <div @click="goOrderDetail()" class="submit">立即投资</div>
    </div>
    <van-dialog v-model="show" title class="caculator-dialog" :show-confirm-button="false">
      <div class="head flex-row-between">
        <div style="width:40px"></div>
        <span>收益计算器</span>
        <div @click="show=false" class="close flex-row-center">
          <img class="close-img" src="@/assets/moneyManage/-e-ic_colse.png" alt>
        </div>
      </div>
      <div
        @scroll.stop.prevent
        @touchmove.stop.prevent
        @mousewheel.stop.prevent
        class="caculator-contain"
      >
        <van-field
          @input="validCount($event)"
          type="number"
          class="input-money"
          v-model="calulatorCount"
        >
          <span class="yuan" slot="button">元</span>
        </van-field>
        <div class="profit">{{profit}}</div>
        <div class="explain">到期收益（本息合计/元）</div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import {
  GETDETAIL,
  GETDESCRIPTION,
  INVESTRECORDS,
  GETQUESTIONS,
  GETSYSTEMCONFIG
} from "@/api/moneyManage";
export default {
  name: "objectDetail",
  data() {
    return {
      show: false,
      activeTab: 0,
      fixedTab: false,
      tobTop: 0,
      calulatorCount: "",
      pageData: "",
      questionsList: [],
      recordList: [],
      token: localStorage.getItem("token"),
      planExplean: "",
      platformFeeDes: '2019年12月31日'
    };
  },
  computed: {
    profit() {
      var dayProfit = this.Global.tofixed2(
        (Number(this.calulatorCount) * Number(this.pageData.annualrate)) /
          100 /
          365
      );
      var allProfit =
        dayProfit * Number(this.pageData.investmentterm) +
        Number(this.calulatorCount);
      return this.Global.tofixed2(allProfit);
    },
    transformHtml() {
      function HTMLDecode(text) {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
      }
      return HTMLDecode(this.planExplean);
    },
    realRocordList() {
      var arr = [];
      this.recordList.forEach(val => {
        var str = "";
        var date = new Date(val.createtime.replace(/-/g, "/"));
        let yyyy = date.getFullYear();
        let yy =
          date.getMonth() + 1 < 10
            ? `0${date.getMonth() + 1}`
            : date.getMonth() + 1;
        let dd = date.getDay() < 10 ? `0${date.getDay()}` : date.getDay();
        str = `${yyyy}.${yy}.${dd}`;

        var obj = {
          bidrealname: val.bidrealname.slice(0, 1) + "**",
          bidamount: val.bidamount,
          createtime: str
        };
        arr.push(obj);
      });
      return arr;
    }
  },
  methods: {
    validCount(val) {
      this.calulatorCount = val.slice(0, 9);
    },
    toThousands(num) {
      var result = [],
        counter = 0;
      num = (num || 0).toString().split("");
      for (var i = num.length - 1; i >= 0; i--) {
        counter++;
        result.unshift(num[i]);
        if (!(counter % 3) && i != 0) {
          result.unshift(",");
        }
      }
      return result.join("");
    },

    changeTab(val) {
      this.activeTab = val;
    },
    handleScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      if (scrollTop > this.tabTop - 40) {
        this.fixedTab = true;
      } else {
        this.fixedTab = false;
      }
    },
    goOrderDetail() {
      if (this.token) {
        localStorage.setItem("mplist", JSON.stringify(this.pageData.mplist));
        this.$router.push({
          name: "orderDetial",
          query: {
            pid: this.pageData.pid,
            planname: this.pageData.planname,
            annualrate: this.pageData.annualrate,
            fixedinterestrate: this.pageData.fixedinterestrate,
            investmentterm: this.pageData.investmentterm,
            maxbidamount: this.pageData.maxbidamount,
            usewinxinprivilege: this.pageData.usewinxinprivilege, //是否可以选择签到返利
            weixinsigngiftsbalance: this.pageData.weixinsigngiftsbalance, //签到返利的金额
            useprivilege: this.pageData.useprivilege //当值>0的时候，在下页中展示优惠券选项，否则不展示
          }
        });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    initWeb() {
      GETDETAIL({
        planno: this.$route.query.planno
      }).then(res => {
        console.log(res);
        if (res.ResultCode == 0) {
          this.pageData = res.Data;
        } else {
          this.$toast(res.ResultMsg);
        }
      });
      // 说明
      GETDESCRIPTION({
        financialid: this.$route.query.financialid
        // financialid: 41342
      }).then(res => {
        if (res.ResultCode == 0) {
          this.planExplean = res.Data.describe;
        } else {
          this.$toast(res.ResultMsg);
        }
        console.log(res, "说明");
      });
      // 投资记录
      INVESTRECORDS({
        financialorderid: this.$route.query.financialid,
        pageindex: 1,
        pagesize: 10
      }).then(res => {
        if (res.ResultCode == 0) {
          this.recordList = res.Data.finarecordlist;
          console.log(this.realRocordList);
        } else {
          this.$toast(res.ResultMsg);
        }
        console.log(res, "记录");
      });
      // 问题
      GETQUESTIONS({
        planno: this.$route.query.planno
      }).then(res => {
        console.log(res, "问题");
        if (res.ResultCode == 0) {
          this.questionsList = res.Data.list;
        }
      });
      GETSYSTEMCONFIG( {
        configkey: 'PlatformFee'
      }).then(res => {
        if (res.ResultCode == 0 && 'configvalue' in res.Data && res.Data.configvalue.length > 0) {
          this.platformFeeDes = res.Data.configvalue;
        }
      })
    },
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
    safetyGuarantee() {
      this.$router.push("/safeGurante");
    }
  },
  mounted() {
    this.tabTop = this.$refs.tabHead.offsetTop;
    window.addEventListener("scroll", this.handleScroll);
    this.initWeb();
    // this.$refs.page.scrollIntoView();
  }
};
</script>
<style lang="scss" scoped>
.separate {
  height: 10px;
  opacity: 1;
  background: rgba(250, 250, 250, 1);
}
.header {
  height: 188px;
  background: linear-gradient(
    to bottom,
    rgba(88, 159, 239, 1),
    rgba(74, 144, 224, 1)
  ); /* 标准的语法 */
}
.platform {
  color: rgba(255, 255, 255, 1);
  text-align: left;
  width: 75px;
  height: 20px;
  border: 1px solid rgba(183, 210, 246, 1);
  font-size: 12px;
  line-height: 21px;
  border-radius: 10px;
  background: url(~@/assets/moneyManage/platform.png) no-repeat 6px center /
    13px 10px;
  .text {
    margin-left: 20px;
    color: rgba(250, 250, 250, 0.5);
  }
  margin-right: 10px;
}
.platform-tian {
  height: 20px;
}
.expect {
  margin-top: 4px;
}
.head-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
.allrate {
  color: white;
  margin-top: 17px;
}
.rate {
  font-size: 41px;
}
.addrate {
  font-size: 24px;
}
.detail {
  padding-top: 15px;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  .detail-unit {
    width: 80px;
  }
  .count {
    font-size: 14px;
    color: white;
    line-height: 14px;
    margin-top: 10px;
  }
}
.feature {
  padding: 20px 0;
  .feature-unit {
    width: 80px;
  }
  .feature-img {
    width: 29px;
    height: 29px;
  }
  .feature-text {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(49, 49, 52, 1);
  }
}
.description {
  padding: 25px 15px 0 15px;
}
.descriptionp-unit {
  text-align: left;
  font-size: 12px;
  margin-bottom: 20px;
  .description-title {
    color: rgba(154, 163, 173, 1);
  }
  .description-text {
    color: rgba(49, 49, 52, 1);
    margin-left: 21px;
  }
}
.tab {
  .tab-head {
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }
  .fixed-tab {
    position: fixed;
    top: 40px;
    width: 100%;
    background: white;
  }
  .tab-unit {
    font-size: 14px;
    color: rgba(154, 163, 173, 1);
    height: 42px;
    line-height: 42px;
  }
  .tab-active {
    color: rgba(74, 144, 226, 1);
    border-bottom: 4px solid rgba(74, 144, 226, 1);
  }
}
.plan-detail {
  text-align: left;
  padding: 25px 15px;
  font-size: 12px;
  line-height: 18px;
  .plan-unit {
    margin-bottom: 15px;
  }
  .plan-title {
    color: rgba(154, 163, 173, 1);
    width: 50px;
  }
  .plan-text {
    color: rgba(49, 49, 52, 1);
    margin-left: 0px;
    width: 276px;
  }
}
.agreement {
  padding: 0 15px;
  color: rgba(49, 49, 52, 1);
  font-size: 18px;
  .agreement-unit {
    font-size: 16px;
    height: 50px;
    border-bottom: 1px solid rgba(237, 237, 237, 1);
  }
  .turn-right {
    width: 6px;
    height: 10px;
  }
}
.invest-record {
  font-size: 12px;
  .record-list {
    padding: 0 30px;
  }
  .record-unit {
    color: rgba(154, 163, 173, 1);
    border-bottom: 1px solid rgba(237, 237, 237, 1);
    height: 50px;
    .danyuan {
      flex: 1;
      width: 90px;
      text-align: center;
    }
    .left-name {
      margin-left: -40px;
    }
    .middle-amount {
    }
    .right-time {
      margin-left: 37px;
    }
  }
  .record-title {
    height: 50px;
    color: rgba(99, 105, 118, 1);
    background: rgba(250, 250, 250, 1);
  }
}

.warn {
  color: rgba(154, 163, 173, 1);
  font-size: 10px;
  background: rgba(250, 250, 250, 1);
}
.tianchong {
  height: 50px;
  background: rgba(250, 250, 250, 1);
}
.footer {
  bottom: 0;
  position: fixed;
  height: 49px;
  background: white;
  width: 100%;
  .calculator {
    width: 32px;
    height: 32px;
    margin: 0 17px;
  }
  .submit {
    background: rgba(74, 144, 226, 1);
    font-size: 16px;
    line-height: 49px;
    flex: 1;
    color: rgba(255, 255, 255, 1);
  }
}
.problems-list {
  padding: 0px 15px 0 15px;
  .problems-unit {
    text-align: left;
    align-items: flex-start;
    // margin-bottom: 20px;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    padding-bottom: 15px;
    padding-top: 17px;
    .search {
      width: 18px;
      height: 18px;
      margin-top: -4px;
    }
    .problems-text {
      margin-left: 12px;
    }
    h2 {
      font-size: 14px;
      color: rgba(49, 49, 52, 1);
    }
    p {
      color: rgba(154, 163, 173, 1);
      font-size: 12px;
      margin-top: 18px;
      line-height: 18px;
    }
  }
}
.caculator-dialog {
  width: 270px;
  height: 210px;
  .head {
    font-size: 17px;
    color: rgba(49, 49, 52, 1);
    font-weight: 500;
    border-bottom: 1px solid rgba(212, 213, 215, 1);
  }
  .close {
    width: 40px;
    height: 54px;
  }
  .close-img {
    width: 11px;
    height: 11px;
  }
  .caculator-contain {
    // height: 100px;
  }

  .input-money {
    width: 233px;
    height: 40px;
    color: rgba(49, 49, 52, 1);
    font-size: 17px;
    // line-height: 40px;
    padding-top: 8px;
    padding-bottom: 0;
    border: 1px solid rgba(212, 213, 215, 1);
    margin: 18px 19px 0 19px;
  }
  .yuan {
    color: rgba(49, 49, 52, 1);
  }
  .profit {
    color: rgba(255, 145, 0, 1);
    font-size: 24px;
    margin-top: 20px;
  }
  .explain {
    color: rgba(49, 49, 52, 1);
    font-size: 12px;
    margin-top: 10px;
  }
}
.norecord-img {
  position: relative;
  height: 400px;
  background: rgba(250, 250, 250, 1) url(~@/assets/moneyManage/norecord.png)
    no-repeat center center / 90px 90px;
}
.recordnologin {
  background: rgba(250, 250, 250, 1) url(~@/assets/moneyManage/nologin.png)
    no-repeat center center / 90px 90px;
}
.inverlisttext {
  font-size: 14px;
  color: rgba(154, 163, 173, 1);
  position: absolute;
  top: 260px;
  left: 0;
  right: 0;
  // margin: 0 auto;
}
.dan {
  width: 30px;
  border-top: 1px solid #ededed;
  // color: #ededed
}
</style>
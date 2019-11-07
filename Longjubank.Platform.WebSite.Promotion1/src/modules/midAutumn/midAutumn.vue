<template>
  <v-container @tokenExpired="tokenExpired">
    <template v-slot:content v-cloak>
      <div class="scrollProblem" :class="{'scrollProblem-ios':showPrizeRecords}">
        <div class="banner">
          <div class="banner-time">{{activityTime.start}}-{{activityTime.end}}</div>
        </div>
        <div class="activity-introduce"></div>
        <div class="part-one">
          <div class="part-one-introduce">活动期间，用户投资驹宝盆系列理财计划，累计投资金额达到以下条件即可获得相应奖品:</div>
          <ul class="prize-items clearfix">
            <li :class="item.className" v-for="(item,index) in renderPart1Data" :key="index">
              <div
                v-if="token&&(activityStatus==2||activityStatus==3)&&item.bidamount!=undefined"
                class="myinvest"
              >我的投资:{{item.bidamount.toFixed(2)}}元</div>
            </li>
          </ul>
          <div v-if="activityStatus==1" class="nostart">
            <div class="nostart-text">
              <div class="line line-left"></div>活动尚未开始
              <div class="line line-right"></div>
            </div>
          </div>
          <div v-else-if="!token" class="login" @click="login">登录查看</div>
        </div>
        <div class="part-two">
          <div class="part-one-introduce">活动期间，用户年化投资金额每累计1万元，就可获得拆红包机会一次。最高可获得688元红包，最低6.66元。</div>
          <div
            class="recordbtn"
            v-if="token&&(activityStatus==2||activityStatus==3)&&partTwoData.openredenvelopeinfolist.length>0"
            @click="showPrizeRecords=true"
          ></div>
          <div class="redpacket" :class="{dark:!is_draw}">
            <div class="light-redpacket" v-if="is_draw">
              <div class="light-bottm"></div>
              <div class="light-top" @click="drawPrize"></div>
            </div>
            <div
              v-if="token&&activityStatus==2"
              class="chancenum"
            >您还有{{partTwoData.remainingchancecount}}次拆红包机会</div>
            <div class="totalamount">
              <div v-if="activityStatus==1" class="nostart-text">
                <div class="line line-left"></div>活动尚未开始
                <div class="line line-right"></div>
              </div>
              <div v-else-if="!token" @click="login" style="cursor:pointer">登录查看</div>
              <div v-else>累计年化投资金额:{{partTwoData.annualinvestmentamount.toFixed(2)}}元</div>
            </div>
          </div>
        </div>
        <div class="rules"></div>
        <div class="foot-explain">如有任何疑问请咨询在线客服，或致电4000-119-888。本活动最终解释权归龙驹财行所有</div>
        <!--活动结束-->
        <v-mask
          :imgSrc="require('./assets/gameover.png')"
          @closeClick="is_over = false"
          :showMask="is_over"
        ></v-mask>
        <!--获奖记录-->
        <div v-if="showPrizeRecords" class="h-mask" @scroll.stop @touchmove.stop @mousewheel.stop>
          <div class="h-mask-contain">
            <img class="close" src="./assets/close.png" alt @click="showPrizeRecords=false" />
            <div class="title clearfix">
              <div class="star fl left"></div>
              <div class="fl">中奖记录</div>
              <div class="star fl right"></div>
            </div>
            <div class="record-contain">
              <div class="record-head prized-unit clearfix" style="border:0">
                <div class="prize-amount fl">中奖金额</div>
                <div class="prize-time fl">中奖时间</div>
              </div>
              <div class="cover-scroll">
                <ul class="prized-list">
                  <li
                    class="prized-unit clearfix"
                    v-for="(item,index) in partTwoData.openredenvelopeinfolist"
                    :key="index"
                    :class="{border1:index==0?true:false}"
                  >
                    <div class="prize-amount fl">{{item.money}}元</div>
                    <div class="prize-time fl">{{partTwoCreattime[index]}}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!--拆红包弹框-->
        <div @scroll.stop @touchmove.stop @mousewheel.stop v-if="showDrawPrize" class="h-mask">
          <div class="drawprize-contain">
            <img
              class="close2 drawclose"
              src="./assets/close2.png"
              alt
              @click="showDrawPrize=false"
            />
            <div class="win-amount">{{redpacketAmount==""?'':`${redpacketAmount}元`}}</div>
            <div class="close-win-btn">
              <span v-if="partTwoData.remainingchancecount==0" @click="showDrawPrize=false">返回</span>
              <span v-else @click="drawPrize">继续拆</span>
            </div>
          </div>
        </div>
        <!--toast-->
        <v-toast
          :duration="toastData.duration"
          :message="toastData.message"
          v-if="toastData.is_light"
          @closeToast="toastData.is_light=false"
        ></v-toast>
        <!--circle-->
        <vant-loading v-if="is_circle" size="50px" class="circle" type="spinner" color="#1989fa"></vant-loading>
      </div>
    </template>
  </v-container>
</template>


<script>
import { Loading } from "vant";
import { formatTime } from "@/javascripts/utils/public";
import Toast from "@@/Toast";
import Container from "@@/ContentContainer/ContentContainer";
import Mask from "@@/ActivityFinishedMask/ActivityFinishedMask";
import {
  TopJetConfig,
  LongjulcServerRequest,
  GoToLogin
} from "@/javascripts/longjulc_activity.js";

export default {
  components: {
    "v-container": Container,
    "v-mask": Mask,
    "v-toast": Toast,
    "vant-loading": Loading
  },
  computed: {
    renderPart1Data() {
      let arr = [
        { className: ["prize-unit", "prize-one"] },
        { className: ["prize-unit", "prize-two", "marleft"] },
        { className: ["prize-unit", "prize-three", "martop"] },
        { className: ["prize-unit", "marleft", "martop", "prize-four"] }
      ];
      if (this.partOneData.length != 4 || this.partOneData.length == 0) {
        return arr;
      } else {
        return this.partOneData.map((val, index) => {
          val.className = arr[index].className;
          return val;
        });
      }
    },
    is_draw() {
      return (
        this.token &&
        this.activityStatus == 2 &&
        this.partTwoData.remainingchancecount > 0
      );
    },
    partTwoCreattime() {
      return this.partTwoData.openredenvelopeinfolist.map((item, index) => {
        return formatTime(item.opentime, "yyyy-mm-dd hh-mm");
      });
    }
  },
  data() {
    return {
      toastData: {
        is_light: false,
        message: "",
        duration: 6
      },
      activityTime: {
        start: "9.1",
        end: "9.30"
      },
      partOneData: [],
      partTwoData: {
        remainingchancecount: 0,
        annualinvestmentamount: 0,
        openredenvelopeinfolist: []
      },
      redpacketAmount: 0, //拆到的红包金额
      ActivityId: 28, //活动id
      activityStatus: 0, //1,2,3
      is_over: false, //活动是否结束
      showPrizeRecords: false, //显示中奖记录开关
      showDrawPrize: false, //抽奖显示开关
      token: TopJetConfig.token,
      redpack_switch: true, //防止连续拆红包
      is_circle: false
    };
  },
  methods: {
    tokenExpired() {
      this.token = "";
    },
    login() {
      GoToLogin();
    },
    getPart1Info() {
      LongjulcServerRequest(
        "GetInvestmentInfo",
        "September2019Activity",
        {}
      ).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          this.partOneData = res.investmentlist;
        }
      });
    },
    getActivityStatus: function getActivityStatus() {
      var _this = this;
      LongjulcServerRequest("GetActivityInfo", "NP", {
        ActivityId: this.ActivityId
      }).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          _this.activityTime.start = formatTime(
            res.activityinfo.starttime,
            "mm.dd"
          );
          _this.activityStatus = res.activitytimearea;
          if (res.activitytimearea == 3) {
            _this.is_over = true;
          }
        }
      });
    },

    getPart2Info() {
      LongjulcServerRequest(
        "SelectRedEnvelopeInfo",
        "September2019Activity",
        {}
      ).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          this.partTwoData = res;
        }
      });
    },
    drawPrize() {
      if (this.is_draw) {
        if (!this.redpack_switch) {
          return;
        }
        this.redpack_switch = false; //关闭

        this.is_circle = true; //打开进度条
        this.redpacketAmount = "";
        let timeout500 = new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve("");
          }, 500);
        });

        let ajaxPro = LongjulcServerRequest(
          "OpenRedEnvelope",
          "September2019Activity",
          {}
        ).then(response => {
          if (response.ResultCode == 0) {
            this.showDrawPrize = true;
            var res = JSON.parse(response.Data);
          } else {
          }
          this.getPart2Info();
          return response;
        });
        Promise.all([timeout500, ajaxPro])
          .then(res1 => {
            let response = res1[1];
            this.redpack_switch = true;
            if (response.ResultCode == 0) {
              var res = JSON.parse(response.Data);
              this.redpacketAmount = res.redenvelopemoney;
            } else {
              this.toastData = {
                is_light: true,
                message: response.ResultMsg,
                duration: 6
              };
            }
            this.is_circle = false;
          })
          .catch(() => {
            this.redpack_switch = true;
            this.is_circle = false;
            this.toastData = {
              is_light: true,
              message: "网络异常",
              duration: 6
            };
          });
      }
    }
  },
  mounted() {
    document.title = '提"钱"过中秋，月圆情更浓';
    this.getActivityStatus();
    if (this.token) {
      this.getPart1Info();
      this.getPart2Info();
    }
  },
  watch: {
    showPrizeRecords(val) {
      if (val) {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
      } else {
        document.getElementsByTagName("body")[0].style.overflow = "auto";
      }
    }
  }
};
</script>
<style scoped lang='scss'>
/deep/.foot p,
/deep/.foot p a {
  font-size: 18px;
  color: #d3a3ff;
}
/deep/.foot p a:hover {
  color: blue;
}
/deep/.foot {
  padding-bottom: 50px;
}
/deep/.foot,
/deep/.foot p {
  height: 40px;
  line-height: 40px;
}
</style>
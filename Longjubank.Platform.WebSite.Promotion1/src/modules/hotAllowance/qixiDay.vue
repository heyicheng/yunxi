<template>
  <v-container>
    <template v-slot:content v-cloak>
      <div class="banner"></div>
      <div class="partOne"></div>
      <div class="partTwo">
        <div class="img_Notstarted" v-if="activitytimearea == 0"></div>
        <img class="img_Notstarted" v-else-if="activitytimearea == 1 " :src="propsIcon.notStarted" />
        <img
          class="img_Notlogin"
          v-else-if="!logintoken"
          :src="propsIcon.notLogin"
          @click="loginClick"
        />
        <!-- 累计投资金额 -->
        <div class="div-status" v-else>
          <p>累计年化投资：{{annualbidamount}}元</p>
        </div>
        <!-- 选择津贴 -->
        <div class="div_grid">
          <div class="div-flex">
            <div>
              <img src="./assets/app/allowance_1.png" />
              <div>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src="prize88count>0?minus.clickable:minus.Unclickable"
                  alt
                  @click="minusClick(0)"
                />
                <b id="1">{{prize88count}}</b>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src="plusStatus[0]?plusIcon.clickable:plusIcon.Unclickable"
                  alt
                  @click="plusClick(0)"
                />
              </div>
            </div>
            <div>
              <img src="./assets/app/allowance_2.png" />
              <div>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src="prize328count>0?minus.clickable:minus.Unclickable"
                  alt
                  @click="minusClick(1)"
                />
                <b id="2">{{prize328count}}</b>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src=" plusStatus[1]?plusIcon.clickable:plusIcon.Unclickable"
                  alt
                  @click="plusClick(1)"
                />
              </div>
            </div>
          </div>
          <div class="div-flex">
            <div>
              <img src="./assets/app/allowance_3.png" />
              <div>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src="prize688count>0?minus.clickable:minus.Unclickable"
                  alt
                  @click="minusClick(2)"
                />
                <b id="3">{{prize688count}}</b>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src=" plusStatus[2]?plusIcon.clickable:plusIcon.Unclickable"
                  alt
                  @click="plusClick(2)"
                />
              </div>
            </div>
            <div>
              <img src="./assets/app/allowance_4.png" />
              <div>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src="prize1188count>0?minus.clickable:minus.Unclickable"
                  alt
                  @click="minusClick(3)"
                />
                <b id="4">{{prize1188count}}</b>
                <img
                  v-if="activitytimearea == 1 || isdisplay == 1"
                  :src=" plusStatus[3]?plusIcon.clickable:plusIcon.Unclickable"
                  alt
                  @click="plusClick(3)"
                />
              </div>
            </div>
          </div>
        </div>
        <p class="p_tips">集齐4个不同任务再得1888元七夕红包</p>
        <!-- 进度条 -->
        <div class="div_progress">
          <img v-show="progressStatus==0" src="./assets/app/Progress_0.png" />
          <img v-show="progressStatus==1" src="./assets/app/Progress_25.png" />
          <img v-show="progressStatus==2" src="./assets/app/Progress_50.png" />
          <img v-show="progressStatus==3" src="./assets/app/Progress_75.png" />
          <img v-show="progressStatus==4" src="./assets/app/Progress_100.png" />
        </div>
        <!-- <p class="p_progress">{{progress}}%</p> -->
        <button
          v-if="activitytimearea == 1 || isdisplay == 1"
          :disabled="buttonStatus"
          @click="showconfirmPopup = true"
        ></button>
      </div>
      <div class="partThree"></div>
      <div class="partfour"></div>
      <div class="left-um" v-if="equipment=='pc'"></div>
      <div class="left-leaf" v-if="equipment=='pc'"></div>
      <div class="right-um" v-if="equipment=='pc'"></div>
      <div class="right-leaf" v-if="equipment=='pc'"></div>
      <p class="p-foot" v-if="equipment=='pc'">
        如有任何疑问请咨询在线客服，或致电4000-119-888。
        本活动最终解释权归龙驹财行所有
      </p>
      <p class="p-foot" v-else>
        如有任何疑问请咨询在线客服，或致电4000-119-888
        本活动最终解释权归龙驹财行所有
      </p>
      <v-mask
        :imgSrc="require('./assets/app/activity-finished.png')"
        @closeClick="showActivityOver = false"
        :showMask="showActivityOver"
      ></v-mask>
      <choosePopup
        :showMask="showconfirmPopup"
        :num="[prize88count,prize328count,prize688count,prize1188count]"
        @closeClick="showconfirmPopup = false"
        @sureClick="confirm"
      ></choosePopup>
    </template>
  </v-container>
</template>
<script>
import Container from "@@/ContentContainer/ContentContainer";
import Mask from "@@/ActivityFinishedMask/ActivityFinishedMask";
import choosePopup from "./choosePopup";
import Toast from "vant/lib/toast";
import "vant/lib/toast/style";
import {
  TopJetConfig,
  LongjulcServerRequest,
  GoToLogin
} from "@/javascripts/longjulc_activity.js";

export default {
  components: {
    "v-container": Container,
    "v-mask": Mask,
    choosePopup
  },
  data() {
    return {
      /* TopJetConfig.token */
      logintoken: TopJetConfig.token,
      equipment: TopJetConfig.equipment,
      propsIcon: {
        notLogin: require("./assets/app/Login_view.png"),
        notStarted: require("./assets/app/Act_not_started.png")
      },
      /* 活动状态 0：活动关闭 1：活动前 2：活动中 3：活动结束 */
      activitytimearea: 0,
      showActivityOver: false,
      /* 累计年化投资金额 */
      annualbidamount: "0.00",
      /* 剩余年华投资金额 */
      surplusamount: 0,
      plusIcon: {
        clickable: require("./assets/app/plus_1.png"),
        Unclickable: require("./assets/app/plus_2.png")
      },
      minus: {
        clickable: require("./assets/app/Minus_1.png"),
        Unclickable: require("./assets/app/Minus_2.png")
      },
      prize88count: 0,
      prize328count: 0,
      prize688count: 0,
      prize1188count: 0,
      plusStatus: [false, false, false, false],
      prize88: 10000,
      prize328: 35000,
      prize688: 65000,
      prize1188: 100000,
      /* 进度条状态0 1:25% 2:50% 3:75% 4:100% */
      progressStatus: 0,
      // progress: 0,
      buttonStatus: true,
      /* 是否显示用户选择奖品区域  0不显示 1显示 */
      isdisplay: 0,
      showconfirmPopup: false
    };
  },
  mounted() {
    document.title = "全城热爱，福利不掉线";
    this.loadActivityStatus();
    this.choosePrizeZone();
  },
  methods: {
    loginClick() {
      GoToLogin();
    },
    confirm() {
      this.choosePrize();
      this.showconfirmPopup = false;
    },
    /* 进度条 */ 
    progressChange() {
      let array = [
        this.prize88count,  
        this.prize328count,
        this.prize688count,
        this.prize1188count
      ];
      let num = 0;
      array.forEach(element => {
        if (element > 0) {
          num++;
        }
      });
      this.progressStatus = num;
      this.isdisplay == 0 || this.progressStatus == 0
        ? (this.buttonStatus = true)
        : (this.buttonStatus = false);
    },
    /* 当津贴数量发生改变时 */
    fontchange(val, position) {
      if (val > 0) {
        document.getElementById(position).className = "redfont";
      } else {
        document.getElementById(position).className = "";
      }
      this.progressChange();
    },
    /* 点击- */
    minusClick(val) {
      if (this.isdisplay == 0) {
        return;
      }
      if (val == 0 && this.prize88count > 0) {
        this.prize88count--;
        this.surplusamount += this.prize88;
      } else if (val == 1 && this.prize328count > 0) {
        this.prize328count--;
        this.surplusamount += this.prize328;
      } else if (val == 2 && this.prize688count > 0) {
        this.prize688count--;
        this.surplusamount += this.prize688;
      } else if (val == 3 && this.prize1188count > 0) {
        this.prize1188count--;
        this.surplusamount += this.prize1188;
      }
    },
    /* 点击+ */
    plusClick(val) {
      if (this.isdisplay == 0) {
        return;
      }
      if (val == 0 && this.surplusamount >= this.prize88) {
        this.prize88count++;
        this.surplusamount -= this.prize88;
      } else if (val == 1 && this.surplusamount >= this.prize328) {
        this.prize328count++;
        this.surplusamount -= this.prize328;
      } else if (val == 2 && this.surplusamount >= this.prize688) {
        this.prize688count++;
        this.surplusamount -= this.prize688;
      } else if (val == 3 && this.surplusamount >= this.prize1188) {
        this.prize1188count++;
        this.surplusamount -= this.prize1188;
      }
    },
    /* 查询活动状态 */
    loadActivityStatus() {
      var _this = this;
      LongjulcServerRequest("GetActivityInfo", "NP", {
        ActivityId: 27
      }).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          _this.activitytimearea = res.activitytimearea;
          // _this.activitytimearea = 1;
          // 活动已经关闭或结束
          if (res.activitytimearea === 3) {
            _this.showActivityOver = true;
          }

          if (res.activitytimearea === 3 || res.activitytimearea === 2) {
            _this.logintoken && _this.getBidPrizeInfo();
          }
        }
      });
    },
    /* 查询个人年化投资金额及奖品选择情况 */
    getBidPrizeInfo() {
      var _this = this;
      LongjulcServerRequest("GetBidPrizeInfo", "HotWeatherCompensation").then(
        response => {
          if (response.ResultCode == 0) {
            var res = JSON.parse(response.Data);
            let annualbidamount = res.annualbidamount + "";
            if (annualbidamount) {
              _this.annualbidamount = Number(annualbidamount).toFixed(2);
            }
            _this.surplusamount = _this.annualbidamount;
            _this.prize88count = res.prize88count;
            _this.prize328count = res.prize328count;
            _this.prize688count = res.prize688count;
            _this.prize1188count = res.prize1188count;
            _this.surplusamount -=
              res.prize88count * _this.prize88 +
              res.prize328count * _this.prize328 +
              res.prize688count * _this.prize688 +
              res.prize1188count * _this.prize1188;
          }
        }
      );
    },
    /* 查询是否支持奖品选择 */
    choosePrizeZone() {
      var _this = this;
      LongjulcServerRequest(
        "DisplayChoosePrizeZone",
        "HotWeatherCompensation"
      ).then(response => {
        if (response.ResultCode == 0) {
          var res = JSON.parse(response.Data);
          _this.isdisplay = res.isdisplay;
        }
      });
    },
    /* 提交奖品兑换  */
    choosePrize() {
      var _this = this;
      LongjulcServerRequest("ChoosePrizes", "HotWeatherCompensation", {
        prize88count: _this.prize88count,
        prize328count: _this.prize328count,
        prize688count: _this.prize688count,
        prize1188count: _this.prize1188count
      }).then(response => {
        if (response.ResultCode == 0) {
          Toast({ message: response.ResultMsg, className: "div-vant-toast" });
          this.choosePrizeZone();
        }
      });
    }
  },
  watch: {
    prize88count(val) {
      this.fontchange(val, 1);
    },
    prize328count(val) {
      this.fontchange(val, 2);
    },
    prize688count(val) {
      this.fontchange(val, 3);
    },
    prize1188count(val) {
      this.fontchange(val, 4);
    },
    surplusamount(val) {
      if (this.surplusamount >= this.prize1188) {
        for (let i = 0; i < this.plusStatus.length; i++) {
          this.plusStatus[i] = true;
        }
      } else if (this.surplusamount >= this.prize688) {
        this.plusStatus[0] = true;
        this.plusStatus[1] = true;
        this.plusStatus[2] = true;
        this.plusStatus[3] = false;
      } else if (this.surplusamount >= this.prize328) {
        this.plusStatus[0] = true;
        this.plusStatus[1] = true;
        this.plusStatus[2] = false;
        this.plusStatus[3] = false;
      } else if (this.surplusamount >= this.prize88) {
        this.plusStatus[0] = true;
        this.plusStatus[1] = false;
        this.plusStatus[2] = false;
        this.plusStatus[3] = false;
      } else {
        for (let i = 0; i < this.plusStatus.length; i++) {
          this.plusStatus[i] = false;
        }
      }
    },
    showActivityOver(val) {
      if (val) {
        document
          .getElementsByTagName("html")[0]
          .style.setProperty("position", "relative");
        document
          .getElementsByTagName("html")[0]
          .style.setProperty("width", "100%");
        document
          .getElementsByTagName("html")[0]
          .style.setProperty("height", "100%");

        document
          .getElementsByTagName("body")[0]
          .style.setProperty("position", "fixed");
        document
          .getElementsByTagName("body")[0]
          .style.setProperty("width", "100%");
        document
          .getElementsByTagName("body")[0]
          .style.setProperty("height", "100%");
        document.getElementsByTagName("body")[0].style.setProperty("top", "0");
        document.getElementsByTagName("body")[0].style.setProperty("left", "0");
      } else {
        document
          .getElementsByTagName("html")[0]
          .style.removeProperty("position");
        document.getElementsByTagName("html")[0].style.removeProperty("width");
        document.getElementsByTagName("html")[0].style.removeProperty("height");

        document
          .getElementsByTagName("body")[0]
          .style.removeProperty("position");
        document.getElementsByTagName("body")[0].style.removeProperty("width");
        document.getElementsByTagName("body")[0].style.removeProperty("height");
        document.getElementsByTagName("body")[0].style.removeProperty("top");
        document.getElementsByTagName("body")[0].style.removeProperty("left");
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "./qixiDay.css";
.div-vant-toast {
  min-width: auto !important;
}
/deep/.van-toast--text {
  width: -webkit-fit-content;
  width: fit-content;
  min-width: 96px;
  min-height: unset;
  padding: 8px 12px;
}
</style>
<style scoped lang='scss'>
@media screen and (max-width: 800px) {
  .div_grid {
    width: 5.87rem;
    height: 6.5rem;
    margin: auto;
    margin-top: 0.5rem;
    .div-flex:first-child {
      height: 3.25rem;
    }
    .div-flex {
      display: flex;
      flex: 1;
      height: 3rem;
      div {
        flex: 1;
        img {
          height: 2.06rem;
          width: 2.14rem;
          margin: auto;
          display: block;
        }
        div {
          display: flex;
          margin-top: 10px;
          margin-left: 0.7rem;
          margin-right: 0.7rem;
          img {
            width: 0.4rem;
            height: 0.4rem;
          }
          b {
            color: #b1b1b1;
            font-size: 0.28rem;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            line-height: 0.4rem;
          }
        }
      }
    }
  }
  .redfont {
    color: #f25064 !important;
  }
  .div-status {
    p {
      position: relative;
      margin: auto;
      line-height: 1.23rem;
      font-size: 13px;
      color: white;
    }
  }
  .p_tips {
    font-size: 12px;
    color: #6e8ed2;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    margin-top: 0.2rem;
    padding-left: 20px;
    max-width: 6.1rem;
    font-weight: bold;
  }
  .div_progress {
    display: flex;
    margin-top: -0.55rem;
    img {
      height: 1.94rem;
      width: 6.1rem;
      margin: auto;
      padding-left: 20px;
      vertical-align: unset;
    }
  }
  button {
    background: url(./assets/app/button.png) no-repeat center/100% 100%;
    width: 4.68rem;
    height: 1.05rem;
    display: flex;
    margin: auto;
    border: none;
    margin-top: -0.1rem;
  }
  button[disabled] {
    background: url(./assets/app/unbutton.png) no-repeat center/100% 100%;
  }
  .p-foot {
    color: #2ca6ab;
    text-align: center;
    font-size: 0.2rem;
    line-height: 0.32rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: -0.8rem;
    font-weight: 500;
    word-break: keep-all;
  }
}
@media screen and (min-width: 800px) {
  .div_grid {
    width: 587px;
    margin: auto;
    margin-top: 50px;
    .div-flex {
      display: flex;
      flex: 1;
      height: 310px;
      div {
        // flex: 1;
        float: left;
        width: 50%;
        text-align: center;
        img {
          height: 206px;
          width: 214px;
          margin: auto;
        }
        div {
          display: flex;
          margin-top: 20px;
          margin-left: auto;
          margin-right: auto;
          float: none;
          img {
            width: 40px;
            height: 40px;
          }
          b {
            color: #b1b1b1;
            font-size: 28px;
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            line-height: 40px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 15px;
            padding-right: 15px;
          }
        }
      }
    }
  }
  .redfont {
    color: #f25064 !important;
  }
  .div-status {
    margin-top: 100px;
    p {
      margin: auto;
      line-height: 123px;
      font-size: 25px;
      color: white;
    }
  }
  .p_tips {
    font-size: 24px;
    color: #6e8ed2;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    padding-left: 20px;
    margin-top: 5px;
    max-width: 610px;
    font-weight: bold;
  }
  .div_progress {
    display: flex;
    margin-top: -55px;
    img {
      height: 194px;
      width: 610px;
      margin: auto;
      padding-left: 20px;
      vertical-align: unset;
    }
  }
  button {
    background: url(./assets/app/button.png) no-repeat center/100% 100%;
    width: 468px;
    height: 105px;
    display: flex;
    margin: auto;
    border: none;
    margin-top: -20px;
  }
  button[disabled] {
    background: url(./assets/app/unbutton.png) no-repeat center/100% 100%;
  }
  .p-foot {
    color: #5dc5c9;
    font-size: 20px;
    text-align: center;
    width: 1200px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 23px;
    margin-bottom: -30px;
    font-weight: 500;
  }
}
</style>



<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK()"></van-nav-bar>
    <div class="head"></div>
    <div class="prize-contain">
      <div>
        <div v-if="token" class="text">
          <span>当月还有</span>&nbsp;
          <span class="num">{{this.prizeNum}}</span>&nbsp;
          <span>次抽奖机会</span>
        </div>
        <div v-else class="text">登录后查看</div>
      </div>
      <ul class="prize-list flex-row-around" v-if="prizeList.length>0">
        <li class="fl list-unit">
          <el-carousel
            height="114px"
            :autoplay="swiperList[0].autoplay"
            direction="vertical"
            indicator-position="none"
            class="swiper"
            ref="swiper0"
            :interval="swiperList[0].interval"
          >
            <el-carousel-item v-for="(item,index) in newPrizeList" :key="index">
              <div
                class="prize-unit"
                :class="{jdek:item.goodstype==2&&item.prizetype==1,jxq:item.goodstype==1&&item.prizetype==2,xjq:item.goodstype==1&&item.prizetype==3,huafei:item.goodstype==3&&item.prizetype==1,lcjq:item.goodstype==1&&item.prizetype==1}"
              >
                <div class="shang">
                  <span class="value">{{item.value}}</span>
                  <span class="peijue">{{item.units}}</span>
                </div>
                <div class="xia">{{item.prizename}}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </li>
        <li class="fl list-unit">
          <el-carousel
            height="114px"
            :autoplay="swiperList[1].autoplay"
            direction="vertical"
            indicator-position="none"
            class="swiper"
            ref="swiper1"
            :interval="swiperList[1].interval"
          >
            <el-carousel-item v-for="(item,index) in newPrizeListTwo" :key="index">
              <div
                class="prize-unit"
                :class="{jdek:item.goodstype==2&&item.prizetype==1,jxq:item.goodstype==1&&item.prizetype==2,xjq:item.goodstype==1&&item.prizetype==3,huafei:item.goodstype==3&&item.prizetype==1,lcjq:item.goodstype==1&&item.prizetype==1}"
              >
                <div class="shang">
                  <span class="value">{{item.value}}</span>
                  <span class="peijue">{{item.units}}</span>
                </div>
                <div class="xia">{{item.prizename}}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </li>
        <li class="fl list-unit">
          <el-carousel
            height="114px"
            :autoplay="swiperList[2].autoplay"
            direction="vertical"
            indicator-position="none"
            class="swiper"
            ref="swiper2"
            :interval="swiperList[2].interval"
          >
            <el-carousel-item v-for="(item,index) in newPrizeListThree" :key="index">
              <div
                class="prize-unit"
                :class="{jdek:item.goodstype==2&&item.prizetype==1,jxq:item.goodstype==1&&item.prizetype==2,xjq:item.goodstype==1&&item.prizetype==3,huafei:item.goodstype==3&&item.prizetype==1,lcjq:item.goodstype==1&&item.prizetype==1}"
              >
                <div class="shang">
                  <span class="value">{{item.value}}</span>
                  <span class="peijue">{{item.units}}</span>
                </div>
                <div class="xia">{{item.prizename}}</div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </li>
      </ul>
      <div class="prize-switch" v-if="prizeSwitch" @click="drawPrize"></div>
      <div v-else class="prize-switch active"></div>
      <div class="myrecord" @click="getRecord">
        <img v-if="!token" class="portrait" src="@/assets/home/cj_ic_tx.png" alt>
        <img v-else-if="!portraitSrc" class="portrait" src="@/assets/home/pic_head.png" alt>
        <img v-else :src="portraitSrc" class="portrait" alt>
        <span v-if="token" style="margin-left:20px;color:#720100;">我的记录</span>
        <span v-else style="margin-left:20px;color:#720100;">点击登录</span>
      </div>
    </div>
    <div class="rule">
      <div @click="openRules" class="rulebtn fr"></div>
    </div>
    <div class="record">
      <div class="record-head"></div>
      <ul class="table-title flex-row-around">
        <li>获奖用户</li>
        <li>获得奖品</li>
        <li>获奖时间</li>
      </ul>
      <div ref="fuel" class="scroll-contain">
        <ul ref="ziel" class="table-body">
          <li
            class="table-unit flex-row-around"
            v-for="(item,index) in prizeRecordList"
            :key="index"
          >
            <div class="table-td">{{item.realname}}</div>
            <div class="table-td">{{item.fullprizename}}</div>
            <div class="table-td">{{item.drawprizetime.slice(0,10)}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="explain">
      <div class="head"></div>
      <ul class="content">
        <li>1、注册用户每月初可自动获得抽奖机会3次；</li>
        <li>2、每成功邀请一位好友注册并实名认证，即可获得抽奖机会3次；</li>
        <li>3、投资用户每月前三笔回款均可相应获得1次抽奖机会。每月最多可获3次回款抽奖机会；</li>
        <li>4、当月总抽奖次数无上限，月末未使用次数自动失效；</li>
        <li>5、所抽中话费由系统自动充值至用户龙驹财行注册手机号，不支持虚拟手机号码充值；一般当日即可到账，如遇系统繁忙可能延迟到账；</li>
        <li>6、平台不定期会对奖项进行调整，活动截止时间以龙驹财行平台公告为准。</li>
      </ul>
    </div>
    <div class="footer">
      <div>
        <span>如有任何疑问请咨询在线客服，或致电</span>
        <span class="phone">4000-119-888</span>
        <span>查询</span>
      </div>
      <div>本活动最终解释权归龙驹财行所有</div>
    </div>
    <van-popup class="popprizecontian" v-model="popPrized" :close-on-click-overlay="false">
      <div class="popprize">
        <div class="text-head">
          <span>恭喜您获得一张</span>
          <span>{{havePrized.prizename}}</span>
          <span>！</span>
        </div>
        <img @click="closePopprize" class="close" src="@/assets/home/prize_close.png" alt>
        <div class="redtext">{{havePrized.value+havePrized.units}}</div>
        <div class="kind">{{havePrized.prizename}}</div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Carousel, CarouselItem } from "element-ui";

import {
  GETPRIZERECORDS,
  GETPORTRAIT,
  GETPRIZELIST,
  GETPRIZENUM,
  DRAWPRIZE
} from "@/api/home";
import { setTimeout } from "timers";

export default {
  components: {
    "el-carousel": Carousel,
    "el-carousel-item": CarouselItem
  },
  data() {
    return {
      prizeSwitch: true,
      token: localStorage.getItem("token"),
      prizeRecordList: [],
      portraitSrc: "",
      prizeNum: 0,
      prizeList: [], //处理过的奖品列表
      swiperList: [
        { autoplay: true, interval: 2000 },
        { autoplay: true, interval: 2000 },
        { autoplay: true, interval: 2000 }
      ],
      sortId: "",
      havePrized: {}, // 抽中的奖品
      popPrized: false,
      newPrizeListThree: [],
      canPrize: true //判断是否在抽奖中的按钮，当在抽奖中则为false，不在抽奖中未true
    };
  },
  computed: {
    newPrizeList() {
      let start = Math.floor(Math.random() * this.prizeList.length);
      let arr = [];
      let selectObj = {};
      console.log(this.prizeList, "");
      this.prizeList.forEach((val, index) => {
        if (index == start) {
          selectObj = val;
        } else {
          arr.unshift(val);
        }
      });
      arr.unshift(selectObj);
      return arr;
    },
    newPrizeListTwo() {
      let start = Math.floor(Math.random() * this.prizeList.length);
      let [arr, arr1, arr2] = [[], [], []];
      let selectObj = {};
      this.prizeList.forEach((val, index) => {
        if (index == start) {
          selectObj = val;
        } else if (index > start) {
          arr1.push(val);
        } else {
          arr2.push(val);
        }
      });
      arr = [...arr1, ...arr2];
      arr.unshift(selectObj);
      return arr;
    }
  },
  methods: {
    closePopprize() {
      this.outofOrder(); //乱序
      this.swiperList = [
        { autoplay: false, interval: 2000 },
        { autoplay: false, interval: 2000 },
        { autoplay: false, interval: 2000 }
      ];
      this.canPrize = true;
      this.getPrizeNum();
      setTimeout(() => {
        this.popPrized = false;
      }, 100);//减少白屏时间
    },
    scroll(fuel, ziel, time = 60) {
      this.$nextTick(function() {
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
    startDraw() {
      this.swiperList.forEach((val, index) => {
        val.autoplay = true;
        if (index == 0) {
          setTimeout(() => {
            val.interval = 450;
          });
        }
        if (index == 1) {
          setTimeout(() => {
            val.interval = 450;
          }, 200);
        }
        if (index == 2) {
          setTimeout(() => {
            val.interval = 450;
          }, 400);
        }
      });
    },
    stopDraw() {
      this.swiperList.forEach((val, index) => {
        val.autoplay = false;
      });
    },
    outofOrder() {
      var [randomOne, randomTwo, randomThree] = [
        Math.floor(Math.random() * this.prizeList.length),
        Math.floor(Math.random() * this.prizeList.length),
        Math.floor(Math.random() * this.prizeList.length)
      ];
      console.log(randomOne, randomTwo, randomThree);
      this.$refs.swiper0.setActiveItem(randomOne);
      this.$refs.swiper1.setActiveItem(randomTwo);
      this.$refs.swiper2.setActiveItem(randomThree);
    },
    drawPrize() {
      // this.$refs.swiper1.setActiveItem(6);
      // return;
      if (!this.canPrize) {
        this.$toast("已经在抽奖中，请勿重复点击");
        return;
      }
      if (!this.token) {
        this.$router.push({ name: "login" });
        return;
      }
      if (this.prizeNum <= 0) {
        this.$toast("您剩余的抽奖机会不足，无法参与抽奖");
        return;
      }
      this.canPrize = false; //表示已经在抽奖中，避免重复抽奖

      //按钮动画效果
      this.prizeSwitch = false;
      setTimeout(() => {
        this.prizeSwitch = true;
      }, 200);
      DRAWPRIZE()
        .then(res => {
          if (res.ResultCode == 0) {
            this.havePrized = {
              prizename: res.Data.prizename,
              units: "元",
              value: res.Data.value
            };
            if (res.Data.goodstype == 1 && res.Data.prizetype == 2) {
              //此处为加息券
              this.havePrized.units = "%";
            }
            this.startDraw(); //开始转动
            setTimeout(() => {
              this.stopDraw();
              setTimeout(() => {
                this.newPrizeList.forEach((val, index) => {
                  if (val.sortid == res.Data.sortid) {
                    this.$refs.swiper0.setActiveItem(index);
                  }
                });
              });

              setTimeout(() => {
                this.newPrizeListTwo.forEach((val, index) => {
                  if (val.sortid == res.Data.sortid) {
                    this.$refs.swiper1.setActiveItem(index);
                  }
                });
              }, 200);
              setTimeout(() => {
                this.newPrizeListThree.forEach((val, index) => {
                  if (val.sortid == res.Data.sortid) {
                    this.$refs.swiper2.setActiveItem(index);
                  }
                });
                setTimeout(() => {
                  this.popPrized = true;
                }, 1000);
              }, 400);
            }, 4000);
          } else {
            this.$toast(res.ResultMsg);
            this.canPrize = true;
          }
        })
        .catch(res => {
          this.$toast("网络请求错误");
          this.canPrize = true;
        });
    },
    openRules() {
      if (!this.token) {
        this.$router.push({ name: "login" });
      } else {
        this.$router.push({ name: "rules" });
      }
    },
    getRecord() {
      if (this.token) {
        this.$router.push({ name: "myRecord" });
      } else {
        this.$router.push({ name: "login" });
      }
    },
    getPrizeRecord() {
      GETPRIZERECORDS({ pagesize: 50 }).then(res => {
        if (res.ResultCode == 0) {
          this.prizeRecordList = res.Data.list;
          this.$nextTick(function() {
            this.scroll("fuel", "ziel");
          });
        } else {
          this.$toast(res.ResultMsg);
        }
      });
    },
    getPortrait() {
      if (this.token) {
        GETPORTRAIT().then(res => {
          if (res.ResultCode == 0) {
            this.portraitSrc = res.Data.headpicurl;
          }
        });
      }
    },
    getPrizeList() {
      GETPRIZELIST().then(res => {
        if (res.ResultCode == 0) {
          this.prizeList = res.Data.list.map((val, index) => {
            let obj = {
              prizetype: val.prizetype,
              goodstype: val.goodstype,
              prizename: val.prizename,
              value: val.value,
              units: "元",
              sortid: val.sortid //用于筛选出index
              // realValue:val.value,//用于获奖的弹窗的金额显示
              // realunits:'元',
            };
            if (val.value >= 1000 && val.value < 10000) {
              obj.value = val.value / 1000;
              obj.units = "千元";
            }
            if (val.value >= 10000) {
              obj.value = val.value / 10000;
              obj.units = "万元";
            }
            if (val.goodstype == 1 && val.prizetype == 2) {
              //此处为加息券
              obj.units = "%";
              // obj.realunits="%"
            }
            return obj;
          });
          var copyarr = this.prizeList.map(val => {
            return val;
          });
          this.newPrizeListThree = copyarr.sort(function(a, b) {
            return a.value - b.value;
          });
        } else {
          this.$toast(res.ResultMsg);
        }
      });
    },
    getPrizeNum() {
      GETPRIZENUM({ pageindex: 1, pagesize: 10 }).then(res => {
        if (res.ResultCode == 0) {
          this.prizeNum = res.Data.canusechancenum;
        }
      });
    }
  },
  mounted() {
    if (this.token) {
      this.getPortrait();
      this.getPrizeNum();
    }
    this.getPrizeRecord();
    this.getPrizeList();
  }
};
</script>
<style lang="scss" scoped>
.page {
  background: #070027;
  padding-bottom: 30px;
}
.head {
  height: 203px;
  background: url(~@/assets/home/prizetitle.png) center / 100% 100%;
}
.prize-contain {
  position: relative;
  margin-top: -43px;
  height: 457px;
  background: url(~@/assets/home/drawingmachime.png) center / 100% 100%;
  .text {
    line-height: 31px;
    position: absolute;
    color: #fdc09b;
    font-size: 15px;
    top: 12px;
    left: 75px;
    width: 225px;
    height: 31px;
    .num {
      color: white;
    }
  }
  .prize-switch {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 70px;
    // top: 280px;
    margin: auto;
    width: 128px;
    height: 106px;
    background: url(~@/assets/home/cj_btn_default.png) no-repeat center
      bottom/contain;
    &.active {
      background: url(~@/assets/home/cj_btn_selected.png) no-repeat center
        bottom / contain;
      // height: 96px;
    }
    .on {
      width: 128px;
      height: 106px;
    }
    .off {
      width: 128px;
      height: 96px;
    }
  }
  .prize-list {
    position: absolute;
    z-index: 1;
    background: white;
    width: 250px;
    top: 136px;
    height: 121px;
    left: 62px;
  }
  .list-unit {
    width: 64px;
    overflow: hidden;
  }

  .prize-unit {
    font-size: 13px;
    position: relative;
    height: 114px;
    color: white;
    .shang {
      position: absolute;
      top: 35px;
      left: 0;
      right: 0;
      margin: auto;
    }
    .value {
      font-size: 23px;
    }
    .peijue {
    }
    .xia {
      position: absolute;
      top: 75px;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
  .jdek {
    background: url(~@/assets/home/jp_eka.png) no-repeat center/64px 95px;
  }
  .lcjq {
    background: url(~@/assets/home/jp_tiyan.png) no-repeat center/64px 95px;
  }
  .jxq {
    background: url(~@/assets/home/jp_jiaxi.png) no-repeat center/64px 95px;
  }
  .xjq {
    background: url(~@/assets/home/jp_xianjin.png) no-repeat center/64px 95px;
  }
  .huafei {
    background: url(~@/assets/home/jp_huafei.png) no-repeat center/64px 95px;
  }
}
.rule {
  height: 32px;
  margin-top: 22px;
  .rulebtn {
    height: 32px;
    width: 115px;
    background: url(~@/assets/home/rules.png) center / 100% 100%;
  }
}
.myrecord {
  position: absolute;
  width: 143px;
  height: 46px;
  background: url(~@/assets/home/drawprizebtn.png) no-repeat center/100% 100%;
  bottom: 9px;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 15px;
  line-height: 43px;
  .portrait {
    position: absolute;
    left: 15px;
    top: 8px;
    width: 24px;
    height: 24px;
    border-radius: 12px;
  }
}
.record {
  width: 350px;
  background: #1a0e50;
  margin: 0 auto 0 auto;
  position: relative;
  margin-top: 75px;
  padding-top: 60px;

  .record-head {
    width: 239px;
    height: 60px;
    background: url(~@/assets/home/cj_ic_jilu.png) center / 100% 100%;
    position: absolute;
    margin: auto;
    left: 0;
    right: 0;
    top: -37px;
  }
}
.table-title {
  color: #ffd71f;
  font-size: 13px;
  li {
    flex: 1;
  }
}
.scroll-contain {
  height: 165px;
  overflow: auto;
  margin-top: 16px;
}
.table-body {
  font-size: 12px;
  color: #ffffff;
  .table-td {
    flex: 1;
  }
  .table-unit {
    padding-top: 21px;
  }
}
.explain {
  margin-top: 38px;
  .head {
    margin: 0 auto;
    width: 126px;
    height: 20px;
    background: url(~@/assets/home/cj_ic_sm.png) no-repeat center/100% 100%;
  }
  .content {
    margin: 17px auto 0 auto;
    line-height: 20px;
    width: 319px;
    font-size: 12px;
    color: white;
    text-align: left;
  }
}
.footer {
  margin-top: 30px;
  line-height: 20px;
  font-size: 11px;
  color: #999999;
  .phone {
    color: white;
  }
}
.swiper {
  height: 114px;
  overflow: hidden;
}

.popprizecontian {
  background: none;
  width: 375px;
  height: 400px;
}
.popprize {
  position: absolute;
  width: 265px;
  height: 235px;
  background: url(~@/assets/home/popprize.png) center / 100% 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  .text-head {
    font-size: 17px;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 24px;
    color: white;
  }
  .redtext {
    font-size: 40px;
    color: #f2322b;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    top: 136px;
  }
  .kind {
    position: absolute;
    color: #010101;
    font-size: 16px;
    left: 0;
    right: 0;
    top: 180px;
    margin: auto;
  }
  .close {
    right: 0;
    position: absolute;
    top: 0;
    width: 30px;
    height: 68px;
    margin-top: -68px;
  }
}
.el-carousel__item {
  height: 114px;
}
</style>

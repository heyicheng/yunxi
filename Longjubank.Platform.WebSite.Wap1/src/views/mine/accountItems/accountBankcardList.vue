<template>
  <div class="container page">
    <van-nav-bar
      :title="$route.meta.title"
      left-arrow
      @click-left="GOBACK"
      :right-text="hasBankcard?'解绑':''"
      @click-right="UnbindCard"
    />
    <div v-if="hasBankcard">
      <div class="bankcard">
        <div class="cardinfo clearfix">
          <div class="fl banklogo">
            <img class="bankicon" :src="bankcardInfo.logo">
          </div>
          <div class="fl bankinfo">
            <p class="bankname">
              {{bankcardInfo.name}}
              <span>借记卡</span>
            </p>
            <p class="cardnum">{{bankcardInfo.number}}</p>
          </div>
          <img class="fastcard" src="@/assets/account/fast_payment.png">
        </div>
        <p class="cardlimit">限额: {{bankcardInfo.singlelimit}}/笔 {{bankcardInfo.daylimit}}/日</p>
      </div>
    </div>
    <div v-else>
      <div class="addCardContainer" @click="addBankcard">
        <p class="addIcon">+</p>
        <p class="addLabel">添加银行卡</p>
        <p class="addHint">充值成功后即可绑定银行卡</p>
      </div>
      <p class="addCardHint">添加银行卡</p>
      <p class="addCardHint">即可享受安全快捷的移动支付体验</p>
      <p class="cardCeiling" @click="showCardCeiling">查看银行限额</p>
    </div>
  </div>
</template>

<script>
import { GetBankcardList, GETMAINTAINSTATUS } from "@/api/account.js";
import {mainTainCode} from '@/api/messageCode'

import { Toast } from "vant";
export default {
  data() {
    return {
      bankcardList: null
    };
  },
  computed: {
    hasBankcard() {
      return this.bankcardList && this.bankcardList.length > 0;
    },
    bankcardInfo() {
      var params = {
        logo: "",
        name: "",
        number: "",
        daylimit: "",
        singlelimit: ""
      };

      if (this.hasBankcard) {
        params.logo = this.bankcardList[0].banklogo;
        params.name = this.bankcardList[0].bankname;
        params.number = "**** **** **** ****";
        if (this.bankcardList[0].bankcardno.length > 4) {
          params.number =
            "**** **** **** " +
            this.bankcardList[0].bankcardno.slice(
              -4,
              this.bankcardList[0].bankcardno.length
            );
        }
        params.daylimit = this.bankcardList[0].daylimit;
        if (params.daylimit >= 10000) {
          params.daylimit = (params.daylimit / 10000).toFixed(0) + "万";
        }
        params.daylimit = params.daylimit + "元";
        params.singlelimit = this.bankcardList[0].singlelimit;
        if (params.singlelimit >= 10000) {
          params.singlelimit = (params.singlelimit / 10000).toFixed(0) + "万";
        }
        params.singlelimit = params.singlelimit + "元";
      }

      return params;
    }
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    UnbindCard() {
      GETMAINTAINSTATUS({
        actionKey: ""
      }).then(res => {
        console.log(res);
        if (mainTainCode.indexOf(res.ResultCode) > -1) {
          //105表示系统维护
          this.$toast({ message: res.ResultMsg, duration: 1500 });
        } else {
          this.$router.push("/bankcardUnbind");
        }
      });
    },
    showCardCeiling() {
      this.$router.push("/cardCeiling");
    },
    addBankcard() {
      this.$router.push("/recharge");
    }
  },
  mounted() {
    Toast.loading({ mask: true });
    GetBankcardList()
      .then(response => {
        if (response.ResultCode != 0) {
          Toast({ message: response.ResultMsg, duration: 1500 });
        } else {
          this.bankcardList = response.Data.bankcardlist;
          Toast.clear();
        }
      })
      .catch(error => {
        Toast({ message: "网络异常", duration: 1500 });
      });
  }
};
</script>

<style scoped lang='scss'>
.container {
  position: fixed;
  background: rgba(248, 248, 248, 1);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  /deep/.van-nav-bar__right .van-nav-bar__text {
    color: rgba(49, 49, 52, 1);
  }
}

.container .bankcard {
  background: linear-gradient(rgba(88, 159, 239, 1), rgba(74, 144, 224, 1));
  width: calc(100% - 30px);
  margin-left: 15px;
  margin-top: 11px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
  .cardlimit {
    text-align: left;
    opacity: 0.5;
    font-size: 11px;
    color: rgba(255, 255, 255, 1);
    margin-left: 16px;
    margin-top: 14px;
  }
}

.container .bankcard .cardinfo {
  margin-top: 19px;
  margin-left: 15px;
  position: relative;
  .banklogo {
    width: 45px;
    height: 45px;
    border-radius: 23px;
    background: white;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .bankicon {
      object-fit: contain;
      width: 70%;
      height: 70%;
    }
  }
  .bankinfo {
    text-align: left;
    .bankname {
      font-size: 16px;
      color: rgba(255, 255, 255, 1);
      margin-left: 11px;
      span {
        opacity: 0.5;
        font-size: 12px;
        color: rgba(255, 255, 255, 1);
        margin-left: 15px;
      }
    }
    .cardnum {
      font-size: 21px;
      color: rgba(255, 255, 255, 1);
      margin-left: 11px;
      margin-top: 19px;
    }
  }
  .fastcard {
    position: absolute;
    top: 3px;
    right: 15px;
    width: 48px;
    height: 12px;
  }
}

.container .addCardContainer {
  margin-left: 15px;
  margin-top: 10px;
  margin-bottom: 50px;
  width: calc(100% - 30px);
  height: 130px;
  background: white;
  border: 1px dashed rgba(230, 230, 230, 1);
  .addIcon {
    margin-top: 20px;
    color: rgba(154, 163, 173, 1);
    font-size: 50px;
  }
  .addLabel {
    margin-top: 10px;
    font-size: 14px;
    color: rgba(49, 49, 52, 1);
  }
  .addHint {
    margin-top: 10px;
    font-size: 12px;
    color: rgba(185, 191, 198, 1);
  }
}

.container .addCardHint {
  line-height: 18px;
  font-size: 14px;
  color: rgba(154, 163, 173, 1);
}

.container .cardCeiling {
  margin-top: 28px;
  font-size: 14px;
  color: rgba(74, 144, 224, 1);
}
</style>

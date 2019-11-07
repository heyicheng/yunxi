<template>
  <div class="creditorListContainer">
    <van-nav-bar :title="$route.meta.title" left-arrow @click-left="GOBACK"/>
    <div class="topContent">
      <p class="investHint">投资金额（元）</p>
      <p class="investNum">{{bidAmount}}</p>
    </div>
    <!-- 债权列表 -->
    <div v-if="creditorList.length > 0" class="listContain">
      <van-list
        class="creditorList"
        :finished="finished"
        v-model="loading"
        @load="onLoad"
        :immediate-check="false"
      >
        <div class="creditorContent" v-for="creditor in creditorList" :key="creditor.id" @click="creditorSelected(creditor.id)">
          <!-- 债权抬头 -->
          <div class="creditorTitle clearfix">
            <img class="fl titleImg" src="@/assets/account/borrow_title.png">
            <p class="fl titleLabel">{{creditor.title}}</p>
          </div>
          <!-- 债权信息 -->
          <div class="creditorDetails clearfix">
            <div class="fl interestrate">
              <p>
                {{ creditor.interestrate }}<span>%</span>
              </p>
              <p>
                <span>日化利率</span></p>
            </div>
            <div class="fl matchday">
              <p>
                {{ creditor.matchday }}<span>天</span>
              </p>
              <p>
                <span>匹配期限</span>
              </p>
            </div>
            <div class="fr matchamount">
              <p class="blueColor">
                {{ creditor.matchamount }}
                <span>元</span>
              </p>
              <p>
                <span>匹配金额</span>
              </p>
            </div>
          </div>
        </div>
      </van-list>
    </div>
    <div v-else>
      <img class="norecord" src="@/assets/account/ac_norecord.png">
      <p class="norecordLabel">暂无记录</p>
    </div>
  </div>
</template>

<script>
import { List } from "vant";
import { MyFinancialBormachListDetail } from "@/api/account.js";
export default {
  data() {
    return {
      pageIndex: 1,
      pageSize: 20,
      finished: false,
      loading: false,
      creditorList: [],
      bidAmount: "0.00"
    };
  },
  components: {
    "van-list": List
  },
  methods: {
    GOBACK() {
      this.$router.go(-1);
    },
    onLoad() {
      this.loadCreditorList();
    },
    loadCreditorList() {
        MyFinancialBormachListDetail(this.pageIndex, this.pageSize, this.$route.params.financialID).then(response => {
            if (response.ResultCode == 0) {
                this.bidAmount = response.Data.bidamount.toFixed(2);
                if (response.Data.allrows === 0) {
                    this.creditorList = []
                } else {
                    for (let index = 0; index < response.Data.finborlist.length; index++) {
                        const bormach = response.Data.finborlist[index];
                        var data = {}
                        data.title = bormach.bortitle
                        data.interestrate = (bormach.interestrate * 100).toFixed(2)
                        data.matchday = bormach.matchday
                        data.matchamount = bormach.matchamount.toFixed(2)
                        data.id = bormach.bororderid

                        this.creditorList.push(data)
                    }
                    this.pageIndex += 1
                    if (response.Data.allrows <= this.creditorList.length) {
                        this.finished = true;
                    }
                }
            }
            this.loading = false
        }).catch(err =>{
            this.loading = false
        })
    },
    creditorSelected(orderid) {
        this.$router.push('/creditorDetail/' + orderid)
    }
  },
  mounted() {
    this.loadCreditorList();
  }
};
</script>

<style scoped lang='scss'>
.creditorListContainer {
  position: fixed;
  width: 100%;
  height: calc(100% - 40px);
  top: 40px;
  background: #f8f8f8;
  display: flex;
  flex-direction: column;
}

.creditorListContainer .topContent {
  width: 100%;
  height: 113px;
  background: #549aea;
  overflow: hidden;
  .investHint {
    margin-top: 25px;
    text-align: center;
    font-size: 16px;
    color: rgba(255, 255, 255, 1);
  }
  .investNum {
    margin-top: 23px;
    font-size: 32px;
    color: rgba(255, 255, 255, 1);
  }
}

.creditorListContainer .listContain {
  position: relative;
  overflow: auto;
  flex: 1;
}

.creditorListContainer .creditorList .creditorContent {
  position: relative;
  margin: 15px;
  background: white;
  overflow: hidden;
  .creditorTitle {
    margin-top: 15px;
    .titleImg {
      margin-left: 15px;
      width: 26px;
      width: 26px;
    }
    .titleLabel {
      font-size: 16px;
      color: #313134;
      line-height: 26px;
      margin-left: 7px;
      margin-bottom: 25px;
    }
  }
  .creditorDetails {
    margin-bottom: 20px;
    p {
      font-size: 20px;
      color: rgba(154, 163, 173, 1);
    }
    p:last-child {
      margin-top: 7px;
    }
    span {
      font-size: 14px;
      color: rgba(154, 163, 173, 1);
    }
    .blueColor {
      color: #549aea;
    }
    .interestrate {
      margin-left: 15px;
      text-align: left;
    }
    .matchday {
      text-align: center;
      margin-left: 20%;
    }
    .matchamount {
      margin-right: 15px;
      text-align: right;
    }
  }
}

.creditorListContainer .norecord {
  margin-top: 70px;
  width: 90px;
  height: 90px;
}
.creditorListContainer .norecordLabel {
  margin-top: 5px;
  color: rgba(154, 163, 173, 1);
  font-size: 15px;
}
</style>

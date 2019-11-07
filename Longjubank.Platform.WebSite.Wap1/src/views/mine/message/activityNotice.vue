<template>
  <van-list
    class="v-list"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多啦~"
    @load="onLoad"
  >
    <div v-for="item in messagelist" :key="item.id">
      <p class="p-time">{{item.createtime.substring(0,16)}}</p>
      <div class="div-item" @click="gotodetail(item.activitymsgstatus,item.urladdress)">
        <div class="div-title" style="text-align: left;margin-bottom: 10px">
          <span class="span-title">{{item.msgtitle}}</span>
          <span v-if="item.activitymsgstatus==0" class="span-tag tag0">未开始</span>
          <span v-else-if="item.activitymsgstatus==1" class="span-tag tag1">进行中</span>
          <span v-else class="span-tag tag2">已结束</span>
        </div>
        <div style="position:relative">
          <img class="img-pic" :src="item.imgurl">
          <p v-if="item.activitymsgstatus==2" class="img-pic mongolia"></p>
          <p class="span-content">{{item.msgtext}}</p>
        </div>
        <div v-if="item.activitymsgstatus==2" class="div-foot">
          <span class="span-detail" style="color:#9AA3AD">活动已结束</span>
        </div>
        <div v-else class="div-foot">
          <span class="span-detail">查看详情</span>
          <img class="img-ic" src="../../../assets/moneyManage/ic_jiaobiao.png">
        </div>
      </div>
    </div>
  </van-list>
</template>
<script>
import { List, Toast } from "vant";
import { GetSysMessageList } from "@/api/message";
import CommonUtils from "@/utils/public.js";
export default {
  components: {
    "van-list": List
  },
  data() {
    return {
      loading: false,
      finished: false,
      messagelist: [],
      allpages: 1,
      pageindex: 0
    };
  },
  methods: {
    onLoad() {
      if (this.pageindex < this.allpages) {
        // 加载状态结束
        this.pageindex++;
        this.loading = false;
        this.getListData();
      } else {
        this.loading = false;
        this.finished = true;
      }
    },
    getListData() {
      const toast1 = Toast.loading({ mask: true, duration: 0 });
      GetSysMessageList(false, 2, this.pageindex)
        .then(Response => {
          toast1.clear();
          if (Response) {
            if (Response.ResultCode == 0) {
              if (this.pageindex == 1) {
                this.messagelist = Response.Data.messagelist;
              } else {
                for (const key in Response.Data.messagelist) {
                  if (Response.Data.messagelist.hasOwnProperty(key)) {
                    const element = Response.Data.messagelist[key];
                    this.messagelist.push(element);
                  }
                }
              }
              console.log(this.messagelist);
              this.allpages = Response.Data.allpages;
            } else {
              Toast(Response.ResultMsg);
            }
          }
        })
        .catch(error => {
          toast1.clear();
        });
    },
    gotodetail(status, url) {
      if (status != 2 && !CommonUtils.isEmpty(url)) {
        this.$router.push({
          name: "activityDetail",
          query: {
            path: url,
            title: "活动详情"
          }
        });
      }
    }
  }
};
</script>
<style>
.v-list {
  background: rgba(248, 248, 248, 1);
}
</style>

<style scoped lang="scss">
.p-time {
  width: 100px;
  background: rgba(199, 199, 199, 1);
  font-size: 11px;
  color: rgba(255, 255, 255, 1);
  line-height: 15px;
  margin: auto;
  padding: 3px;
  border-radius: 3px;
  margin-top: 15px;
  margin-bottom: 10px;
}
.tag0 {
  background: #dce9f9;
  color: #4a90e0;
}
.tag1 {
  background: rgba(255, 233, 204, 1);
  color: rgba(255, 145, 0, 1);
}
.tag2 {
  background: rgba(154, 163, 173, 0.2);
  color: rgba(154, 163, 173, 1);
}

.div-item {
  border-radius: 4px;
  margin: auto;
  width: 345px;
  background: rgba(255, 255, 255, 1);
  overflow: hidden;
  .div-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    .span-title {
      font-size: 16px;
      color: rgba(49, 49, 52, 1);
      // line-height: 18px;
      margin-left: 12px;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: inline-block;
      position: relative;
      top: 50%;
      bottom: 50%;
    }
    .span-tag {
      height: 19px;
      width: 60px;
      font-size: 12px;
      line-height: 16px;
      float: right;
      margin-right: 15px;
      border-radius: 0px 0px 14px 14px;
      text-align: center;
      padding-top: 4px;
    }
  }

  .img-pic {
    height: 128px;
    width: 320px;
    margin: auto;
  }
  .mongolia {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
  .span-content {
    font-size: 12px;
    color: rgba(154, 163, 173, 1);
    line-height: 20px;
    text-align: left;
    margin-left: 14px;
    margin-right: 14px;
    border-bottom: 1px solid #f4f4f4;
    padding-bottom: 8px;
  }
  .div-foot {
    margin-top: 10px;
    .span-detail {
      font-size: 12px;
      color: rgba(51, 51, 51, 1);
      line-height: 18px;
      margin-left: 15px;
      margin-bottom: 15px;
      float: left;
    }
    .img-ic {
      height: 10px;
      width: 6px;
      text-align: right;
      float: right;
      margin-right: 14px;
    }
  }
}
</style>



<template>
  <van-list
    class="v-list"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多啦~"
    @load="onLoad"
  >
    <van-cell
      v-for="item in messagelist"
      :key="item.id"
      :is-link="true"
      @click="getMyMessage(item.id)"
      :value="item.createtime.substring(0,10)"
    >
      <template slot="title">
        <span class="span-text">{{item.msgtitle}}</span>
        <span class="span-tag" v-if="item.isread == 0?true:false">NEW!</span>
      </template>
    </van-cell>
  </van-list>
</template>
<script>
import { List, Cell, Toast } from "vant";
import { GetMyMessageList, GetMyMessage } from "@/api/message";
import { error } from "util";
export default {
  components: {
    "van-list": List,
    "van-cell": Cell
  },
  data() {
    return {
      loading: false,
      finished: false,
      list: [],
      tabName: {
        personal: "个人消息",
        activity: "活动通知",
        Notice: "平台公告"
      },
      messagelist: [],
      allpages: 1,
      pageindex: 0
    };
  },
  props: {
    refresh: Number
  },
  watch: {
    refresh(val, oldVal) {
      if (val > oldVal) {
        this.pageindex = 0;
        this.onLoad();
      }
    }
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
      GetMyMessageList(this.pageindex)
        .then(Response => {
          toast1.clear();
          console.log(Response);
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
    getMyMessage(msgid) {
      GetMyMessage(1, msgid).then(Response => {
        if (Response) {
          if (Response.ResultCode == 0) {
            this.$router.push({
              name: "messageDetail",
              query: {
                title: Response.Data.msgtitle,
                text: Response.Data.msgtext,
                id: Response.Data.id,
                time: Response.Data.createtime,
                url: Response.Data.urladdress
              }
            });
          } else {
            Toast(Response.ResultMsg);
          }
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
/deep/.van-cell:not(:last-child)::after {
  -webkit-transform: scaleY(1);
  transform: scaleY(1);
  top: 0;
}
.van-cell__title {
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  font-size: 16px;
  color: rgba(49, 49, 52, 1);
  line-height: 20px;
  flex: 3 1 1px;
  padding-top: 2px;
}
.van-cell__value {
  width: auto;
  font-size: 12px;
  color: rgba(154, 163, 173, 1);
  margin: auto;
  text-align: right;
  top: 1px;
  flex: 1;
}
.span-tag {
  font-size: 12px;
  font-style: italic;
  color: rgba(255, 145, 0, 1);
  margin-left: 10px;
  display: inline-block;
  overflow: hidden;
}

.van-cell__right-icon {
  font-size: 8px;
}
.icon-back {
  margin-left: 10px;
  width: 6px;
  height: 10px;
  position: relative;
  top: 6px;
}
.span-text {
  max-width: 180px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>


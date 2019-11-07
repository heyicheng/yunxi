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
      @click="getMyMessage(item)"
      :value="item.createtime.substring(0,10)"
    >
      <template slot="title">
        <span class="span-text">{{item.msgtitle}}</span>
        <div class="span-tag">
          <span class="zd" v-if="item.sortid == 0?false:true">置顶</span>
          <span class="new" v-if="(item.isread == 0&&islogin)?true:false">NEW!</span>
        </div>
        <!--  -->
      </template>
    </van-cell>
  </van-list>
</template>
<script>
import { List, Cell, Toast } from "vant";
import { GetSysMessageList, GetMyMessage } from "@/api/message";
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
      messagelist: [],
      allpages: 1,
      pageindex: 0
    };
  },
  props: {
    islogin: Boolean,
    refresh: Number
  },
  watch: {
    refresh(val, oldVal) {
      console.log("new: %s, old: %s", val, oldVal);
      if (val > oldVal) {
        this.pageindex = 0;
        this.onLoad();
      }
    }
  },
  mounted() {
    // this.getListData();
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
      GetSysMessageList(this.islogin, 3, this.pageindex)
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
    getMyMessage(item) {
      this.msgIsRead(item.id);
      this.$router.push({
        name: "messageDetail",
        query: {
          title: item.msgtitle,
          text: item.msgtext,
          id: item.id,
          time: item.createtime,
          url: item.urladdress
        }
      });
    },
    msgIsRead(msgid) {
      if (!this.islogin) {
        return;
      }
      GetMyMessage(3, msgid).then(Response => {
        if (Response) {
          if (Response.ResultCode == 0) {
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
  display: inherit;
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
.span-text {
  max-width: 160px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.span-tag {
  opacity: 1;
  font-size: 12px;
  font-style: italic;
  display: inline;
  text-align: center;
  margin-left: 15px;
}
.new {
  color: rgba(255, 145, 0, 1);
}
.zd {
  color: rgba(74, 144, 226, 1);
  margin-right: 10px;
}
.van-cell__right-icon {
  font-size: 8px;
}
</style>


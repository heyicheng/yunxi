<template>
  <div class="page">
    <van-nav-bar :title="$route.meta.title" @click-right="goToMessage">
      <div slot="right" class="clock">
        <div v-if="hasNewMessage" class="ret-dot"></div>
        <img src="@/assets/home/ic_message.png" class="clock-img" alt>
      </div>
    </van-nav-bar>
    <van-pullrefresh v-model="refreshLoading" @refresh="loadNewsList(false)">
      <van-list
        v-model="listLoading"
        :finished="listFinished"
        finished-text="我是有底线的"
        :immediate-check="false"
        :offset="10"
        @load="loadNewsList(true)"
      >
        <!-- 滚动栏 -->
        <div class="bannerList">
          <van-swipe indicator-color="white" :autoplay="3000" class="bannerListSwipe">
            <van-swipe-item v-for="(item, index) in bannerList" :key="index">
              <img :src="item.imagelogo" @click="bannerClick(item.link)">
            </van-swipe-item>
          </van-swipe>
        </div>
        <!-- 菜单栏 -->
        <div class="menuList clearfix">
          <div
            v-for="item in menuItems"
            :key="item.id"
            class="fl menuitem"
            @click="menuClick(item.id)"
          >
            <img class="menuicon" :src="item.icon">
            <p class="menuname">{{ item.name }}</p>
          </div>
        </div>
        <div class="seperator"/>
        <div class="listTitle clearfix">
          <div class="titleContent">
            <div class="fl leftBorder"/>
            <p class="fl">龙驹新闻</p>
          </div>
          <div class="titleSeperator"/>
        </div>
        <!-- 列表 -->
        <div v-for="news in newsList" :key="news.id" class="newsContent clearfix">
          <div class="clearfix" @click="newsSelect(news.id)">
            <div class="fl leftcontent">
              <p class="newsTitle">{{ news.title}}</p>
              <p class="newsCreateTime">{{ news.createtime}}</p>
            </div>
            <img class="fr rightImage" :src="news.picurl">
          </div>
          <div class="newsSeperator"></div>
        </div>
      </van-list>
    </van-pullrefresh>
  </div>
</template>

<script>
import { Swipe, SwipeItem, List, Toast, PullRefresh } from "vant";
import { GETBANNER } from "@/api/home.js";
import { GetWebNewsList } from "@/api/discover.js";
import { GetMessageCountUtils } from "@/utils/messageUtils.js";

export default {
  data() {
    {
      return {
        hasNewMessage: false,
        refreshLoading: false,
        bannerListLoading: false,
        newsListLoading: false,
        listLoading: false,
        listFinished: false,
        bannerList: [],
        listPageindex: 1,
        listPagesize: 10,
        newsList: [],
        loadingToast: null
      };
    }
  },
  components: {
    "van-list": List,
    "van-pullrefresh": PullRefresh,
    "van-swipe": Swipe,
    "van-swipe-item": SwipeItem
  },
  computed: {
    menuItems() {
      return [
        {
          id: "newguide",
          name: "新手引导",
          icon: require("@/assets/discover/find_ic_newuser.png")
        },
        {
          id: "cooperation",
          name: "合作伙伴",
          icon: require("@/assets/discover/find_ic_partner.png")
        },
        {
          id: "introduce",
          name: "了解龙驹",
          icon: require("@/assets/discover/find_ic_longju.png")
        },
        {
          id: "QA",
          name: "帮助中心",
          icon: require("@/assets/discover/find_ic_help.png")
        }
      ];
    }
  },
  methods: {
    loadBannerList() {
      this.showLoading();
      this.bannerListLoading = true;
      GETBANNER({ type: 4 })
        .then(response => {
          if (response.ResultCode == 0) {
            this.bannerList = response.Data.list;
          } else {
            Toast({ message: response.ResultMsg, duration: 1500 });
          }
          this.bannerListLoading = false;
          this.dismissLoading();
        })
        .catch(error => {
          this.bannerListLoading = false;
          this.dismissLoading();
        });
    },
    loadNewsList(more) {
      if (!more) {
        this.listPageindex = 1;
        this.listPagesize = 10;
        this.listFinished = false;
        this.newsList = [];
      }
      this.showLoading();
      this.newsListLoading = true;
      GetWebNewsList(this.listPageindex, this.listPagesize)
        .then(response => {
          if (response.ResultCode == 0) {
            this.newsList = this.newsList.concat(response.Data.list);
            if (this.newsList.length >= response.Data.allrows) {
              this.listFinished = true;
            }

            this.listPageindex += 1;
          } else {
            Toast({ message: response.ResultMsg, duration: 1500 });
          }
          this.newsListLoading = false;
          this.dismissLoading();
        })
        .catch(error => {
          this.newsListLoading = false;
          this.dismissLoading();
        });
    },
    showLoading() {
      if (this.loadingToast === null) {
        this.loadingToast = Toast.loading({ mask: true, duration: 0 });
      }
    },
    dismissLoading() {
      if (!(this.bannerListLoading || this.newsListLoading)) {
        this.loadingToast.clear();
        this.loadingToast = null;
        this.listLoading = false;
        this.refreshLoading = false;
      }
    },
    menuClick(id) {
      if (id === "newguide") {
        this.$router.push("/userguide");
      } else if (id === "cooperation") {
        this.$router.push("/partner");
      } else if (id === "introduce") {
        this.$router.push("/introduce");
      } else if (id === "QA") {
        this.$router.push("/QAcenter");
      }
    },
    newsSelect(id) {
      this.$router.push({ name: "newsDetail", params: { newsid: id } });
    },
    goToMessage() {
      this.$router.push("/message");
    },
    bannerClick(link) {
      if (this.Global.isEmpty(link)) {
        return
      }
      window.location.href = link;
    }
  },
  mounted() {
    this.loadBannerList();
    this.loadNewsList(false);
    GetMessageCountUtils((personal, activity, system, error) => {
      this.hasNewMessage = personal + system > 0;
    });
  }
};
</script>

<style scoped lang='scss'>
.clock {
  width: 16px;
  height: 18px;
  position: relative;
  .ret-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: rgba(247, 54, 54, 1);
    top: 9px;
    right: 0;
  }
  img {
    width: 100%;
    height: 100%;
  }
}

.bannerList {
  height: 137px;
  .bannerListSwipe {
    height: 100%;
    img {
      width: 100%;
      height: 100%;
    }
  }
}

.menuList {
  height: 102px;
  .menuitem {
    margin: 24px 14px auto 29px;
    .menuicon {
      width: 39px;
      height: 39px;
      object-fit: contain;
    }
    .menuname {
      margin-top: 6px;
      font-size: 12px;
      color: rgba(49, 49, 52, 1);
    }
  }
}

.seperator {
  width: 100%;
  height: 10px;
  background: rgba(250, 250, 250, 1);
}

.listTitle {
  height: 56px;
  overflow: hidden;
  .titleContent {
    height: 55px;
    .leftBorder {
      margin-top: 19px;
      width: 3px;
      height: 17px;
      background: rgba(74, 144, 224, 1);
      border-radius: 1px;
      margin-left: 15px;
    }
    p {
      margin-left: 13px;
      font-size: 17px;
      color: rgba(49, 49, 52, 1);
      font-weight: bold;
      text-align: left;
      line-height: 55px;
    }
  }
  .titleSeperator {
    height: 1px;
    width: 100%;
    background: rgba(237, 237, 237, 1);
  }
}

.newsContent {
  .leftcontent {
    margin-top: 23px;
    margin-left: 15px;
    width: calc(100% - 168px);
    text-align: left;
    .newsTitle {
      font-size: 16px;
      color: rgba(49, 49, 52, 1);
      min-height: 40px;
    }
    .newsCreateTime {
      margin-top: 21px;
      font-size: 12px;
      color: rgba(154, 163, 173, 1);
    }
  }
  .rightImage {
    margin: 23px 15px 19px 38px;
    width: 100px;
    height: 74px;
    object-fit: contain;
  }
  .newsSeperator {
    margin-left: 15px;
    width: calc(100% - 30px);
    height: 1px;
    background: rgba(237, 237, 237, 1);
  }
}
</style>

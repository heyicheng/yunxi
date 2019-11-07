<template>
  <div class="cityContainer page">
    <van-nav-bar :title="navTitle" left-arrow @click-left="GOBACK"/>
    <div class="seperator"></div>
    <div class="listContent">
      <template v-for="(address, index) in currentList">
        <div v-if="index > 0" class="contentSeperator" :key="index"></div>
        <div class="cityContent clearfix" :key="address.cityId" @click="itemClick(index)">
          <p class="fl contentTitle">{{ address.cityName }}</p>
          <img
            v-if="selectedLevel < 2"
            class="fr contentSubpage"
            src="@/assets/moneyManage/ic_jiaobiao.png"
          >
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { SaveLiveCity } from "@/api/account.js";
import { Toast } from "vant";
export default {
  data() {
    return {
      citylist: [],
      selectedLevel: 0, //0为省、1为市、2为区
      provinceIndex: 0,
      cityIndex: 0,
      districtIndex: 0
    };
  },
  computed: {
    currentList() {
      if (this.citylist.length > 0) {
        if (this.selectedLevel === 1) {
          return this.citylist[this.provinceIndex]["city"];
        } else if (this.selectedLevel === 2) {
          return this.citylist[this.provinceIndex]["city"][this.cityIndex][
            "dist"
          ];
        } else {
          return this.citylist;
        }
      } else {
        return this.citylist;
      }
    },
    navTitle() {
      if (this.selectedLevel === 1) {
        return this.citylist[this.provinceIndex]["cityName"];
      } else if (this.selectedLevel === 2) {
        return this.citylist[this.provinceIndex]["city"][this.cityIndex][
          "cityName"
        ];
      } else {
        return this.$route.meta.title;
      }
    }
  },
  methods: {
    GOBACK() {
      if (this.selectedLevel === 0) {
        this.$router.go(-1);
      } else {
        this.selectedLevel -= 1;
      }
    },
    itemClick(index) {
      if (this.selectedLevel === 0) {
        this.provinceIndex = index;
      } else if (this.selectedLevel === 1) {
        this.cityIndex = index;
      } else if (this.selectedLevel === 2) {
        this.districtIndex = index;
        this.citySaved();
        return;
      }
      this.selectedLevel += 1;
    },
    citySaved() {
      Toast.loading({ mask: true, duration: 0 });
      SaveLiveCity(
        this.citylist[this.provinceIndex]["city"][this.cityIndex]["dist"][
          this.districtIndex
        ]["cityId"]
      )
        .then(response => {
          if (response.ResultCode === 0) {
            this.$router.go(-1);
            Toast.clear();
          } else {
            Toast({ message: response.ResultMsg, duration: 1500 });
          }
        })
        .catch(error => {
          Toast.clear();
        });
    }
  },
  mounted() {
    this.citylist = require("./city.json");
  }
};
</script>

<style scoped lang='scss'>
.cityContainer {
  position: fixed;
  background: rgba(248, 248, 248, 1);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.cityContainer .seperator {
  height: 11px;
  flex-shrink: 0;
}

.cityContainer .listContent {
  overflow: scroll;
  overflow-x: hidden;
  overflow-y: auto;
}

.cityContainer .listContent .cityContent {
  background: white;
  .contentTitle {
    font-size: 16px;
    color: rgba(49, 49, 52, 1);
    line-height: 50px;
    margin-left: 15px;
  }
  .contentSubpage {
    margin-right: 15px;
    margin-top: 20px;
    width: 6px;
    height: 10px;
    object-fit: contain;
  }
}

.cityContainer .listContent .contentSeperator {
  background: rgba(237, 237, 237, 1);
  height: 1px;
  margin-left: 15px;
  width: calc(100% - 15px);
}
</style>

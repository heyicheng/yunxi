<template>
<div>
  <!-- <div class="wrapper" ref="wrapper">
    <ul @click="jiajia" class="content">
      <li>{{count}}</li>
      <li>fffasdfasdfasdf74a98s7d498f7a489s74d98f749a87s49d8f749a8sd749fff</li>
      <li>fffff</li>
      <li>fffff</li>
      <li>fffff</li>
      <li>fffff</li>
      <li>fffff</li>
      <li>fffff</li>  
      <li>fffff</li>
      <li>fffff</li>
    </ul>
  </div> -->


  
    <div class="wrapper" ref="wrapper">
      <div style="width:900px;background:red;height:200px;text-align:right" ref="tabcontent">
        <span>usa4s8df8asdif</span>
        <span>usa4s8df8asdif</span>
        <span>usa4s8df8asdif</span>
        <span>usa4s8df8asdif</span>
        <span>usa4s8df8asdif</span>
        <span>usa4s8df8asdif</span>
        <span>usa4s8df8asdif</span>
        <!-- <span>usa4s8df8asdif</span>
        <span>usa4s8df8asdif</span> -->
 
      </div>

    </div>
<div>7777777</div>
<div>88888</div>
</div>


</template>
<script>
import BScroll from "better-scroll";
export default {
  data() {
    return {
      count: 0
    };
  },
  methods: {
    jiajia() {
      this.count++;

      // alert(document.documentElement.offsetHeight )
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   // this.$refs.tabcontent.style.width = 900 + "px";

    //   this.scroll = new BScroll(this.$refs.wrapper, {
    //     // eventPassthrough: "horizontal",
    //     // startY:500
    //     // scrollY:true,
    //     // scrollX:true,
    //     // scrollY: true,
    //     // click: true,
    //     // scrollbar: true,
    //     // click:true,
    //     // freeScroll:true,
    //     // startX: 0,
    //     click: true,
    //     scrollX: true,
    //     // scrollY: false,
    //     // eventPassthrough: "vertical"
    //   });
    // });
  }
};
</script>
<style>
html {
  background: yellow;
}
* {
  margin: 0;
  padding: 0;
}
ul {
  width: 1000px;
}
li {
  list-style: none;
  text-align: left;
  height: 40px;
  /* width: 1000px; */
  background: green;
}
.wrapper {
  width: 500px;
  height: 600px;
  background: fuchsia;
  /* overflow: hidden; */
  overflow: auto;
}
</style>

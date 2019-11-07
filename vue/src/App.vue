<template>
  <div id="app">
    <img src="./assets/logo.png">
    <img src="./assets/pikaqiu.gif">
    <router-view/>
  </div>
</template>

<script>
import sss from 'hechengjun-test'//这个是自己做的npm包
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#P{
  background: firebrick
}
</style>

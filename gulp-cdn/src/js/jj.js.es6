require.config({
  // baseUrl:"./plugins",//这个参数很有趣，如果不写则默认js为根目录，如果写了则默认html所在的为根目录
  paths:{
    axios:'../plugins/axios/axios'
  }
})
// require(['axios'],function(axios){
//   console.log(axios)
// })
define(function(require,exports,module){
  var sss=require('./test')
  console.log(sss)
  // console.log('加载jj.js')
  // // require(['axios'],function(){
  // //   console.log('加载完了axios')
  // // })
  // // console.log(axios)
  // require(['./test'],function(){
  //   console.log('sdjfiaji')
  // })
  // console.log('加载完了jj.js')
})
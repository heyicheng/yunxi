var axios=require('axios')


var Mock = require('mockjs')
// var data=Mock.mock({'num|1-5':'123'})
// console.log(data)

Mock.mock('http://zhadfa.com',{'num|1-5':'123'})
// axios({
//   url:'http://zhadfa.com',
//   method:'post'
// }).then(res=>{
//   console.log(res)
// })

var NODE_ENV=process.env.NODE_ENV
var DOMAIN_NAME=''
var url={}
if(NODE_ENV=='test'){
  DOMAIN_NAME='https://test/'
  rul.img=DOMAIN_NAME+'img'
}else if(NODE_ENV=='production'){
  DOMAIN_NAME='https://prod/'
}
module.exports={
  url,
  port:1234,
  host:'localhost'
}         

    



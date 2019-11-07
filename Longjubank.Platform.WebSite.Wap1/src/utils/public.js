//保留小数点后两位，不进行4舍五入
import {isNull} from 'util'
//禁止ios10 缩放
window.onload=function () {
  document.addEventListener('touchstart',function (event) {
      if(event.touches.length>1){
          event.preventDefault();
      }
  })
  var lastTouchEnd=0;
  document.addEventListener('touchend',function (event) {
      var now=(new Date()).getTime();
      if(now-lastTouchEnd<=300){
          event.preventDefault();
      }
      lastTouchEnd=now;
  },false)
}

export default {
  tofixed2(num) {
    if(num==''){
      num=0
    }
    var newNum = num + ''
    if(newNum.indexOf('.')>-1){

    }else{
      newNum+='.'
    }
    return Number(newNum.substr(0, newNum.indexOf('.') + 3)).toFixed(2)
  },
  isEmpty(obj) {
    return isNull(obj) || obj === undefined || obj === ''
  },
  getItemFromLocalStorage(key) {
    let result = localStorage.getItem(key)

    if (this.isEmpty(result)) {
      return ""
    } else {
      return result
    }
  },
  setItemToLocalStorage(key, value) {
    localStorage.setItem(key, value)
  }
}

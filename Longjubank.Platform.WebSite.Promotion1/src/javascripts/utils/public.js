module.exports={
  //  传入日期格式2019-12-02 12：00：00
  formatTime:function(time,format){
    let chanceTime=time.slice(0,10)
    let realTime=new Date(chanceTime)
    let month=realTime.getMonth()+1; 
    let date=realTime.getDate();

    //==》》8.12
    if(format=='mm.dd'){
      return `${month}.${date}`
    }
    //==>2015-8.2 12:00:00
    if(format=='yyyy-mm-dd hh-mm'){
      return `${time.slice(0,4)}-${month}-${date} ${time.slice(11,16)}`
    }
  }
}
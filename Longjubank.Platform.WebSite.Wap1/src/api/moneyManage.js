import http from './axios'
//理财首页
export function GETMONEYMANAGELIST(data) {
  var params = {
    ActionName:'GetFinancialList_V240',
    MessageType:'Plan',
    data:{ labeltype:1, showindex:-10 , pageindex:1 ,pagesize:1000 }
  }
  return http.normalRequest({
    data: params
  })
}

export function GETOBJECTLIST(data) {
  var params = {
    ActionName:'GetFinancialListByPlanType',
    MessageType:'Plan',
    data
  }
  return http.normalRequest({
    data: params
  })
}

export function GETDETAIL(data) {
  var params = {
    ActionName:'PlanDetailByNo',
    MessageType:'Plan',
    data
  }
  return http.normalRequest({
    data: params
  })
}
export function GETDESCRIPTION(data) {
  var params = {
    ActionName:'GetFinancialPlanDescByFinId',
    MessageType:'Plan',
    data
  }
  return http.normalRequest({
    data: params
  })
}
export function INVESTRECORDS(data) {
  var params = {
    ActionName:'GetOrderFinancialByFinId',
    MessageType:'Plan',
    data
  }
  return http.normalRequest({
    data: params
  })
}

export function GETQUESTIONS(data) {
  var params = {
    ActionName:'PlanDetailQuestionsByNo',
    MessageType:'Plan',
    data
  }
  return http.normalRequest({
    data: params
  })
}
// 获取可用余额
export function GETBALANCE(data={}) {
  var params = {
    ActionName:'GetMyAccount',
    MessageType:'Account',
    data
  }
  return http.normalRequest({
    data: params
  })
}

// 提交订单
export function SUBMITORDER(data={}) {
  var params = {
    ActionName:'CreatOrderFinancialNew',
    MessageType:'Plan',
    data
  }
  return http.normalRequest({
    data: params
  })
}

//提交支付密码
export function SUBMITPASSWORD(data={}) {
  var params = {
    ActionName:'CheckPayPwd',
    MessageType:'Oauth',
    data
  }
  return http.senstiveRequest({
    data: params
  })
}
// 提交密码后支付订单
export function PAYORDER(data={}) {
  var params = {
    ActionName:'ConfirmPay',
    MessageType:'Pay',
    data
  }
  return http.normalRequest({
    data: params
  })
}
// 获得投资详情减免时间配置
export function GETSYSTEMCONFIG(data={}) {
  var params = {
    ActionName:'GetSysConfig',
    MessageType:'SysConfig',
    data
  }
  return http.normalRequest({
    data: params
  })
}


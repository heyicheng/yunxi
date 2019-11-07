import http from './axios'
//获取banner广告
export function GETBANNER(data) {
  var params = {
    ActionName: 'GetBannerList',
    MessageType: 'Advertisement',
    data: data
  }
  return http.normalRequest({
    data: params
  })
}
//获取首页list
export function GETHOMELIST(data) {
  var params = {
    ActionName: 'PlanFirstList_V240',
    MessageType: 'Plan',
    data,
  }
  return http.normalRequest({
    data: params
  })
}

export function GETNOTICE(data) {
  var params = {
    ActionName: 'GetMessageList',
    MessageType: 'PCPushMessage',
    data,
  }
  return http.normalRequest({
    data: params
  })
}
export function GETPRIZERECORDS(data) {
  var params = {
    ActionName: 'GetLotteryPrizeList',
    MessageType: 'Prize',
    data,
  }
  return http.normalRequest({
    data: params
  })
}

export function GETPORTRAIT(data) {
  var params = {
    ActionName: 'GetMyAccount',
    MessageType: 'Account',
    data,
  }
  return http.normalRequest({
    data: params
  })
}

export function GETPRIZELIST(data) {
  var params = {
    ActionName: 'GetGoodsList',
    MessageType: 'Prize',
    data,
  }
  return http.normalRequest({
    data: params
  })
}

export function GETPRIZENUM(data) {
  var params = {
    ActionName: 'GetMyLotteryChanceList',
    MessageType: 'Activity',
    data,
  }
  return http.normalRequest({
    data: params
  })
}


export function GETPERSONURL(data) {
  var params = {
    ActionName: 'GetPersonalUrl',
    MessageType: 'Account',
    data,
  }
  return http.normalRequest({
    data: params
  })
}
export function INVITERECORD(data) {
  var params = {
    ActionName: 'GetMyInviteRecord',
    MessageType: 'Account',
    data,
  }
  return http.normalRequest({
    data: params
  })
}

export function DRAWPRIZE(data={}) {
  var params = {
    ActionName: 'Lottery',
    MessageType: 'Prize',
    data,
  }
  return http.normalRequest({
    data: params
  })
}

export function MYDRAWRECORD(data) {
  var params = {
    ActionName: 'GetMyLotteryChanceList',
    MessageType: 'Activity',
    data,
  }
  return http.normalRequest({
    data: params
  })
}





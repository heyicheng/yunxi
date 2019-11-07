import http from './axios'

export function GetUserAccount() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetMyAccount'
    params['MessageType'] = 'Account'

    return http.normalRequest({ data: params })
}

export function GetUserAccountInfo() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetAccountInfo'
    params['MessageType'] = 'Account'

    return http.normalRequest({ data: params })
}

export function GetCouponsStatus() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetMyMemberPrivilegesList'
    params['MessageType'] = 'MemberPrivileges'

    params['data'] = {
        'mpstatus': 0,
        'pageindex': 0,
        'pagesize': 10000
    }

    return http.normalRequest({ data: params })
}

export function GetCashConfig() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetConfigCashsetting'
    params['MessageType'] = 'Account'

    return http.normalRequest({ data: params })
}

export function CreateCashOrder(amount, priamount) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'CreateCashOrder'
    params['MessageType'] = 'Order'

    params['data'] = {
        amount: amount,
        priamount: priamount
    }

    return http.normalRequest({ data: params })
}

export function AccountCashNew(orderID, type) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'AccountCashNew'
    params['MessageType'] = 'Account'

    params['data'] = {
        cashorderid: orderID,
        cashtype: type
    }

    return http.normalRequest({ data: params })
}

export function GetBankcardList() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetCardList'
    params['MessageType'] = 'Bank'

    params['data'] = {
        pageindex: 1,
        pagesize: 100
    }

    return http.normalRequest({ data: params })
}

export function CreateChargeOrder(amount, bankcardid) {
    var params = {}

    params['ActionName'] = 'CreateOrderCharge'
    params['MessageType'] = 'Order'

    params['data'] = {
        OrderAmount: amount,
        BankCardId: bankcardid,
        ChargeInfo: '充值'
    }

    return http.normalRequest({ data: params })
}

export function AccountCharge(orderID) {
    var params = {}

    params['ActionName'] = 'AccountCharge'
    params['MessageType'] = 'Account'

    params['data'] = {
        chargeorderid: orderID,
    }

    return http.normalRequest({ data: params })
}

export function GetMyOrderFinancialList(pageindex, pageSize, queryType) {
    var params = {}

    params['ActionName'] = 'GetMyOrderFinancialList'
    params['MessageType'] = 'Plan'

    params['data'] = {
        pageindex: pageindex,
        pagesize: pageSize,
        queryType: queryType
    }
    return http.normalRequest({ data: params })
}
/* 开通托管账户 */
export function OpenEscrowAccount() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'OpenEscrowAccount'
    params['MessageType'] = 'Account'

    return http.normalRequest({ data: params })
}
/* 开启自动投标 */
export function OpenAutoBid() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'OpenAutoBid'
    params['MessageType'] = 'Account'
    return http.normalRequest({ data: params })
}

export function GetTradeList(index, size, type) {
    var params = {}

    params['ActionName'] = 'GetBalanceLog'
    params['MessageType'] = 'Account'

    params['data'] = {
        pageindex: index,
        pagesize: size,
        TransType: type
    }
    return http.normalRequest({ data: params })
}
// 优惠券列表
export function GetMyPrivileges(index, size, status) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetMyMemberPrivilegesList'
    params['MessageType'] = 'MemberPrivileges'

    params['data'] = {
        mpstatus: status,
        pageindex: index,
        pagesize: size,
    }

    return http.normalRequest({ data: params })
}
// E卡列表
export function GetMyPrizeinfo(index, size, status) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetMemberPrizeInfoList'
    params['MessageType'] = 'Prize'

    params['data'] = {
        prizestatus: status,
        pageindex: index,
        pagesize: size,
    }

    return http.normalRequest({ data: params })
}
// 查询充值结果
export function GetChargeResult(orderid) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetChargeResult'
    params['MessageType'] = 'Account'

    params['data'] = {
        OrdId: orderid,
    }

    return http.normalRequest({ data: params })
}
// 保存所在城市
export function SaveLiveCity(cityid) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'SaveLiveCity'
    params['MessageType'] = 'Account'

    params['data'] = {
        livecity: cityid
    }

    return http.normalRequest({ data: params })
}
// 保存详细地址
export function SaveLiveAddress(address) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'SaveLiveAddress'
    params['MessageType'] = 'Account'

    params['data'] = {
        liveaddress: address
    }

    return http.normalRequest({ data: params })
}
// 存储
export function BindEmail(email) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'BindEmail'
    params['MessageType'] = 'Account'

    params['data'] = {
        email: email
    }

    return http.normalRequest({ data: params })
}
/**
 * 投资详情
 * @param {number} orderid 
 */
export function MyOrderFinancialDetail(orderid) {
    var params = {
        ActionName: 'MyOrderFinancialDetail',
        MessageType: 'Plan',
        data: { orderid: orderid }
    }
    return http.normalRequest({ data: params })
}
/**
 * 获取投资协议
 * @param {number} orderid 
 */
export function GetInvestmentAgreementUrl(orderid) {
    var params = {
        ActionName: 'GetInvestmentAgreementUrl',
        MessageType: 'Plan',
        data: { orderid: orderid }
    }
    return http.normalRequest({ data: params })
}
// 获得银行卡限额列表
export function GetBankCodeList() {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetBankCodeList'
    params['MessageType'] = 'Bank'

    return http.normalRequest({ data: params })
}
// 意见反馈
export function submitSuggestion(suggestion, phone) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'AddSuggestion'
    params['MessageType'] = 'Suggestion'

    params['data'] = {
        msg: suggestion,
        contact: phone
    }

    return http.normalRequest({ data: params })
}
// 加载债权列表
export function MyFinancialBormachListDetail(pageIndex, pageSize, financialOrderID) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'MyFinancialBormachListDetail'
    params['MessageType'] = 'Plan'

    params['data'] = {
        pageindex: pageIndex,
        pagesize: pageSize,
        FinancialOrderID: financialOrderID
    }

    return http.normalRequest({ data: params })
}
// 加载债权详情
export function MyFinancialBormachDetail(orderid) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'MyFinancialBormachDetail'
    params['MessageType'] = 'Plan'

    params['data'] = {
        bororderid: orderid
    }

    return http.normalRequest({ data: params })
}
// 加载返息列表
export function GetQuarterProfitList(orderid) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'GetQuarterProfitList'
    params['MessageType'] = 'Account'

    params['data'] = {
        orderid: orderid
    }

    return http.normalRequest({ data: params })
}
// 加载投资的体验标
export function GetMyOrderExperience(type) {
    var params = {}
    // 接口方法
    params['ActionName'] = 'MyOrderExperience'
    params['MessageType'] = 'ExperiencePlan'

    params['data'] = {
        querytype: type
    }

    return http.normalRequest({ data: params })
}

export function GETMAINTAINSTATUS(data) {
    var params = {
      ActionName: 'GetDefendStatus',
      MessageType: 'SysConfig',
      data,
    }
    return http.normalRequest({
      data: params
    })
  }


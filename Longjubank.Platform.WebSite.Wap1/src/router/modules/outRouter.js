//此处用于引入  不需要footer的组件

export default [

  {
    path: '/invitepresent',
    component: () => import('@/views/home/invitePresent'),
    name: 'invitePresent',
    meta: {
      title: '邀请有礼'
    }
  },
  {
    path: '/drawprize',
    component: () => import('@/views/home/drawPrize'),
    name: 'drawPrize',
    meta: {
      title: '参与抽奖'
    }
  },
  {
    path: '/objectlist',
    name: 'objectList',
    component: () => import('@/views/moneyManage/objectList.vue'),
    meta: {
      title: ""
    }
  },
  {
    path: '/objectdetail',
    name: 'objectDetail',
    component: () => import('@/views/moneyManage/objectDetail.vue'),
    meta: {
      title: "投资详情"
    }
  },
  {
    path: '/orderdetail',
    name: 'orderDetial',
    component: () => import('@/views/moneyManage/orderDetail.vue'),
    meta: {
      title: "投资金额"
    }
  },
  {
    path: '/modelagreementlist',
    name: 'modelAgreementList',
    component: () => import('@/views/moneyManage/modelAgreementList.vue'),
    meta: {
      title: "合同范本"
    }
  },
  {
    path: '/recharge',
    component: () => import('@/views/mine/accountItems/accountRecharge'),
    name: 'recharge',
    meta: {
      title: '充值'
    }
  },
  {
    path: '/withdraw',
    component: () => import('@/views/mine/accountItems/accountWithdraw'),
    name: 'withdraw',
    meta: {
      title: '余额提现'
    }
  },
  {
    path: '/rechargeCallback',
    component: () => import('@/views/mine/accountItems/accountBalanceCallback'),
    name: 'rechargeCallback',
    meta: {
      title: '充值结果'
    }
  },
  {
    path: '/withdrawCallback',
    component: () => import('@/views/mine/accountItems/accountBalanceCallback'),
    name: 'withdrawCallback',
    meta: {
      title: '余额提现'
    },
  },
  {
    path: '/bankcard',
    component: () => import('@/views/mine/accountItems/accountBankcardList'),
    name: 'bankcard',
    meta: {
      title: '我的银行卡'
    },
  },
  {
    path: '/bankcardUnbind',
    component: () => import('@/views/mine/accountItems/accountBankcardSubpage'),
    name: 'bankcardUnbind',
    meta: {
      title: '我的银行卡'
    },
  },
  {
    path: '/cardCeiling',
    component: () => import('@/views/mine/accountItems/accountBankcardLimit'),
    name: 'cardCeiling',
    meta: {
      title: '银行卡限额'
    },
  },
  {
    path: '/investments',
    component: () => import('@/views/mine/accountItems/accountInvertments'),
    name: 'investments',
    meta: {
      title: '我的投资'
    }
  },
  {
    path: '/investmentDetail/:id',
    component: () => import('@/views/mine/accountItems/accountInvestmentDetails'),
    name: 'investmentDetail',
    meta: {
      title: '投资详情'
    }
  },
  {
    path: '/protocol',
    component: () => import('@/views/mine/accountItems/accountInvestmentProtocol'),
    name: 'protocol',
    meta: {
      title: '投资协议'
    }
  },
  {
    path: '/openhuifu',
    component: () => import('@/components/openEscrow/openhuifu'),
    name: 'openhuifu',
    meta: {
      title: '开通资金托管'
    }
  },
  {
    path: '/opendes',
    component: () => import('@/components/openEscrow/opendes'),
    name: 'opendes',
    meta: {
      title: '开通资金托管'
    }
  },
  {
    path: '/huifuInput',
    component: () => import('@/components/openEscrow/huifuInput'),
    name: 'huifuInput',
    meta: {
      title: '龙驹财行'
    }
  },
  {
    path: '/tradeDetails',
    component: () => import('@/views/mine/accountItems/accountTradeDetails'),
    name: 'tradeDetails',
    meta: {
      title: '交易详情'
    }
  },
  {
    path: '/privilege',
    component: () => import('@/views/mine/accountItems/accountPrivilegeList'),
    name: 'privilege',
    meta: {
      title: '我的特权'
    }
  },
  {
    path: '/userguide',
    component: () => import('@/views/discover/discoverSubpage.vue'),
    name: 'userguide',
    meta: {
      title: '新手引导'
    }
  },
  {
    path: '/partner',
    component: () => import('@/views/discover/discoverSubpage.vue'),
    name: 'partner',
    meta: {
      title: '合作伙伴'
    }
  },
  {
    path: '/introduce',
    component: () => import('@/views/discover/discoverSubpage.vue'),
    name: 'introduce',
    meta: {
      title: '了解龙驹'
    }
  },
  {
    path: '/QAcenter',
    component: () => import('@/views/discover/discoverSubpage.vue'),
    name: 'QAcenter',
    meta: {
      title: '帮助中心'
    }
  },
  {
    path: '/newsDetail/:newsid',
    component: () => import('@/views/discover/discoverSubpage.vue'),
    name: 'newsDetail',
    meta: {
      title: '新闻详情'
    }
  },
  {
    path: '/HuiFu/Callback',
    component: () => import('@@/callback/huifuCallback.vue'),
    name: 'huifucallback',
    meta: {
      title: '汇付天下'
    },
  },
  {
    path: '/feedback',
    component: () => import('@/views/mine/accountItems/accountFeedback'),
    name: 'feedback',
    meta: {
      title: '意见反馈'
    }
  },
  {
    path: '/payment',
    component: () => import('@/views/moneyManage/payment'),
    name: 'payment',
    meta: {
      title: '确认支付'
    }
  },
  {
    path: '/payresult',
    component: () => import('@/views/moneyManage/payResult'),
    name: 'payResult',
    meta: {
      title: '支付结果'
    }
  },
  {
    path: '/rules',
    component: () => import('@/views/home/rules'),
    name: 'rules',
    meta: {
      title: '奖品及规则'
    }
  },
  {
    path: '/myrecord',
    component: () => import('@/views/home/myRecord'),
    name: 'myRecord',
    meta: {
      title: '我的记录'
    }
  },
  {
    path: '/showContent',
    component: () => import('@@/urlContainer/urlContainer'),
    name: 'showContent',
    meta: {
      title: ''
    }
  },
  {
    path: '/newUsers',
    name: 'newUsers',
    component: () => import('@/views/discover/discoverSubpage.vue'),
    meta: {
      title: '新手大礼包'
    }
  },
  {
    path: '/safeGurante',
    name: 'safeGurante',
    component: () => import('@/views/discover/discoverSubpage.vue'),
    meta: {
      title: '龙驹财行安全保障计划'
    }
  },
  {
    path: '/creditorList/:financialID',
    name: 'creditorList',
    component: () => import('@/views/mine/accountItems/accountCreditorList.vue'),
    meta: {
      title: '债权详情'
    }
  },
  {
    path: '/creditorDetail/:orderid',
    name: ' ',
    component: () => import('@/views/mine/accountItems/accountCreditorDetails.vue'),
    meta: {
      title: '债权详情'
    }
  },
  {
    path: '/interestReturn/:financialID',
    name: 'interestReturn',
    component: () => import('@/views/mine/accountItems/accountMoneyReturnList.vue'),
    meta: {
      title: '返息记录'
    }
  },
]

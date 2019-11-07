export default [{
    path: '/moneymanage',
    name: 'moneyManage',
    component: () => import('@/views/moneyManage/index.vue'),
    meta: {
      title: "理财"
    }
  },


  {
    path: '/invest',
    name: 'invest',
    component: () => import('@/views/moneyManage/invest.vue'),
    meta: {
      title: "投资金额"
    }
  }
]

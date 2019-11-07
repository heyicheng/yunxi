export default [
  {
    path: '/myaccount',
    name: 'myAccount',
    component: () => import('@/views/mine/myAccount'),
    meta: {
      title: '账户'
    }
  },
]

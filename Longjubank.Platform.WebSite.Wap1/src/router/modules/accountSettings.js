export default [{
    path: '/accountSettings',
    name: 'accountSettings',
    component: () => import('@/views/mine/accountSettings/accountSettings'),
    meta: {
        title: '账户设置'
    }
},
{
    path: '/citySelected',
    component: () => import('@/views/mine/accountSettings/accountCitySelected'),
    name: 'citySelected',
    meta: {
        title: '所在地区'
    }
},
{
    path: '/address',
    component: () => import('@/views/mine/accountSettings/accountLiveAddress'),
    name: 'address',
    meta: {
        title: '详细地址'
    }
},
{
    path: '/email',
    component: () => import('@/views/mine/accountSettings/accountEmailSetting'),
    name: 'email',
    meta: {
        title: '常用邮箱'
    }
},
{
    path: '/modifyPassword',
    name: 'modifyPassword',
    component: () => import('@/views/mine/accountSettings/modifyPassword'),
    meta: {
        title: '修改登录密码'
    }
},
{
    path: '/modifyPhone',
    name: 'modifyPhone',
    component: () => import('@/views/mine/accountSettings/modifyPhone'),
    meta: {
        title: '验证新手机号'
    }
},
{
    path: '/authorizationPassword',
    name: 'authorizationPassword',
    component: () => import('@/views/mine/accountSettings/authorizationPassword'),
    meta: {
        title: '授权密码'
    }
},
{
    path: '/modifyAuthPassword',
    name: 'modifyAuthPassword',
    component: () => import('@/views/mine/accountSettings/modifyAuthPassword'),
    meta: {
        title: '修改授权密码'
    }
},
{
    path: '/forgetAuthPassword',
    name: 'forgetAuthPassword',
    component: () => import('@/views/mine/accountSettings/forgetAuthPassword'),
    meta: {
        title: '重置授权密码'
    }
},
{
    path: '/settingHead',
    name: 'settingHead',
    component: () => import('@/views/mine/accountSettings/settingHead'),
    meta: {
        title: '设置头像'
    }
},
]
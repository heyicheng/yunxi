export default [{
    path: '/message',
    name: 'message',
    component: () => import('@/views/mine/message/message'),
    meta: {
        title: '消息'
    },
    children:[
        {
            path: '/personMessage',
            name: 'personMessage',
            component: () => import('@/views/mine/message/personMessage'),
        },
        {
            path: '/activityNotice',
            name: 'activityNotice',
            component: () => import('@/views/mine/message/activityNotice'),
        },
        {
            path: '/sysNotification',
            name: 'sysNotification',
            component: () => import('@/views/mine/message/sysNotification'),
        }
    ]
},
{
    path: '/messageDetail',
    name: 'messageDetail',
    component: () => import('@/views/mine/message/messageDetail'),
    meta: {
        title: '消息详情'
    }
},
{
    path: '/activityDetail',
    name: 'activityDetail',
    component: () => import('@/views/mine/message/activityDetail'),
    meta: {
        title: '活动详情'
    }
},
{
    path: '/platformNotification',
    name: 'platformNotification',
    component: () => import('@/views/mine/message/platformNotification'),
    meta: {
        title: '平台公告'
    }
}
]
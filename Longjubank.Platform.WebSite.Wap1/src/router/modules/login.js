import Login from '@/views/login/login'

export default [{
  path: '/login',
  name: 'login',
  component: Login,
  meta: {
    title: "登录"
  },
},
{
  path: '/register',
  name: 'register',
  component: () => import('@/views/login/register'),
  meta: {
    title: '注册'
  }
},
{
  path: '/quickLogin',
  name: 'quickLogin',
  component: () => import('@/views/login/quickLogin'),
  meta: {
    title: "快速登录"
  }
},
{
  path: '/setPassword',
  name: 'setPassword',
  component: () => import('@/views/login/setPassword'),
  meta: {
    title: '',
  }
},
{
  path:'/forgetPassword',
  name:'forgetPassword',
  component:()=>import('@/views/login/forgetPassword'),
  meta:{
    title:'忘记密码'
  }
}
]

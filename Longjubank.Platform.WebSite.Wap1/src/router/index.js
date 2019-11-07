import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import LoginRouter from './modules/login'
import MineRouter from './modules/mine'
import MeneyManageRouter from './modules/moneyManage'
import DiscoverRouter from './modules/discover'
import HomeRouter from './modules/home'
import OutRouter from './modules/outRouter'
import Message from './modules/message'
import AccountSettings from './modules/accountSettings'
Vue.use(Router)
// console.log(process.env)
const router = new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/', component: Index, children: [
        ...HomeRouter,
        ...MeneyManageRouter,
        ...DiscoverRouter,
        ...MineRouter,
      ]
    },
    ...OutRouter,
    ...LoginRouter,
    ...Message,
    ...AccountSettings,

    // {
    //   path: '/',
    //   meta: {
    //     title: 123
    //   },
    //   component: Index,
    // },

    // {
    //   path: '*',
    //   redirect: '/404',
    //   hidden: true
    // },

    // {
    //   path: '/about',
    //   name: 'about',
    //   meta:{title:1987498},
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = '龙驹财行';
  }
  next()
})
router.afterEach((to, from) => {
  window.scrollTo(0, 0); 
})
export default router

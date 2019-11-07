import Vue from 'vue';
import iView from 'iview';
import Router from 'vue-router';
import appRouter from './pageRouters';
import Home from '@pages/Home';
import Welcome from '@components/Home/Welcome';
import Login from '@pages/Login';
import ErrPage from '@pages/404';
import * as $util from '@util/util';
Vue.use(Router);

const routers = [
    // {
    // 	path: '/',
    // 	name: 'index',
    // 	component: index
    // },
    // {
    // 	path: '/cart',
    // 	name: 'Cart',
    // 	component: Cart
    // },
    {
        path: '/',
        name: 'home',
        redirect: '/welcome',
        component: Home,
        meta: {
            title: '首页'
        },
        children: [
            { path: 'welcome', title: 'welcome', name: 'welcome', component: Welcome }
        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '钱保姆后台管理系统'
        },
        component: Login
    },
    ...appRouter,
    {
        path: '*',
        component: ErrPage
    }
];

let router = new Router({
    mode: 'history',
    routes: routers
});
router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    $util.title(to.meta.title);
    let userId = $util.getCookie('userId');
    if (!userId && to.name !== 'login') { // 判断是否已经登录且前往的页面不是登录页
        next({
            name: 'login'
        });
    } else if (userId && to.name === 'login') { // 判断是否已经登录且前往的是登录页
        $util.title();
        next({
            name: 'home'
        });
    } else {
        $util.toDefaultPage([...routers], to.name, router, next,to.path);
    }
});

router.afterEach((to) => {
    // let vm = router.app;

    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
    // $util.getPathNames(vm, to.path);
});


export default router;

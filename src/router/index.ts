import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { appAuthStore } from '@/stores/user';

// Layout
import Layout from '@/layout/layoutDashboard.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      redirect: '/dashboard/index',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: Layout,
      children: [
        // 首頁
        {
          path: 'index',
          component: HomeView,
          meta: {
            title: 'Home',
          },
          name: 'home'
        }
      ]
    },{
      path: '/navigate',
      component: Layout,
      children: [
        {
          // 当 /user/:id/profile 匹配成功
          // UserProfile 将被渲染到 User 的 <router-view> 内部
          path: 'board',
          component: () =>  import('@/views/navigate/navigateBoard.vue'),
          name: 'board',
        }
      ],
    }, // 登入
    {
      path: '/',
      component: () => import('@/views/login/login.vue'),
      meta: {
        title: '登入',
        requiresAuth: false
      },
      name: 'login'
    },
    // 錯誤頁面
    {
      path: '/PageNotFound',
      component: () => import('@/views/errorPage/PageNotFound.vue'),
      meta: {
        title: 'PageNotFound',
        requiresAuth: false
      },
      name: 'notFound'
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/PageNotFound',
      name: 'catchAll'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const user = appAuthStore()
  console.log(user);
  console.log(localStorage.getItem('account'));
  if(localStorage.getItem('account')) next();
  if (to.name !== 'login' && !user.isLogin) next({ name: 'login' })
  else next()
})

export default router

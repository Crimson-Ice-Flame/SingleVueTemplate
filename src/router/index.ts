import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { appAuthStore } from '@/stores/user';

const routes =  [
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
  },
  {
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
  }, 
  {
    path: '/permission',
    component: Layout,
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'account',
        component: () =>  import('@/views/permissionManagement/accountManagement/accountManagement.vue'),
        name: 'account',
      }, {
        path: 'authority',
        component: () =>  import('@/views/permissionManagement/authorityManagement/authorityManagement.vue'),
        name: 'authority',
      },
      // 權限管理 - 新增/編輯/檢視
      {
        path: 'management/:pageType/:id?',
        component: () =>
          import('@/views/permissionManagement/authorityManagement/authorityManagementSet.vue'),
        name: 'management'
      }
    ],
  },
  // 登入
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
];
// Layout
import Layout from '@/layout/layoutDashboard.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token')?.trim();
  if (to.name !== 'login' && isLogin === undefined) next({ name: 'login' })
  else next()
})

export default router

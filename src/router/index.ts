import { createRouter, createWebHashHistory, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { appAuthStore } from '@/stores/user';

export const routes =  [
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    redirect: '/dashboard/index',
    component: Layout,
    children: [
      // 首頁
      {
        path: 'index',
        component: HomeView,
        name: 'Page_Home'
      }
    ]
  },
  {
    path: '/navigate',
    component: Layout,
    name: 'Page_Navigate_Web_Management',
    redirect: '/navigate/report',
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'report',
        component: () =>  import('@/views/navigate/navigateBoard.vue'),
        name: 'Page_Navigate_Web_Report',
      }
    ],
  }, 
  {
    path: '/permission',
    component: Layout,
    name: 'Page_Permission_Management',
    redirect: '/permission/account',
    children: [
      {
        // 当 /user/:id/profile 匹配成功
        // UserProfile 将被渲染到 User 的 <router-view> 内部
        path: 'account',
        component: () =>  import('@/views/permissionManagement/accountManagement/accountManagement.vue'),
        name: 'Page_Account_Management',
      }, {
        path: 'authority',
        component: () =>  import('@/views/permissionManagement/authorityManagement/authorityManagement.vue'),
        name: 'Page_Permission_Group_Management',
      },
      // 權限管理 - 新增/編輯/檢視
      {
        path: 'management/:pageType/:id?',
        component: () =>
          import('@/views/permissionManagement/authorityManagement/authorityManagementSet.vue')
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

export type AddRouteRecordRaw = RouteRecordRaw & {
  children?: any;
};

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

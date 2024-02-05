import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { appAuthStore } from '@/stores/user';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }, // 登入
    {
      path: '/',
      component: () => import('@/views/login/login.vue'),
      meta: {
        title: '登入',
        requiresAuth: false
      },
      name: 'login'
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

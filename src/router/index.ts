import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GlobeLayout from '../views/GlobeLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GlobeLayout
    },
    {
      path: '/vueHome',
      name: 'vueHome',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/workCation',
      name: 'workCation',
      component: () => import('../views/WorkCationView.vue')
    }
  ]
})

export default router

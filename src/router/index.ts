import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import GlobeLayout from '../views/Layout/GlobeLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GlobeLayout,
      children: [
        {
          path: '',
          name: 'VisuallyPage',
          component: () => import('../views/VisuallyView.vue')
        },
        {
          path: '/about',
          name: 'AboutPage',
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/cost',
          name: 'CostPage',
          component: () => import('../views/AboutView.vue')
        },
        {
          path: '/support',
          name: 'SupportPage',
          component: () => import('../views/AboutView.vue')
        }
      ]
    },
    {
      path: '/vueHome',
      name: 'vueHome',
      component: HomeView
    },

    {
      path: '/workCation',
      name: 'workCation',
      component: () => import('../views/WorkCationView.vue')
    }
  ]
})

export default router

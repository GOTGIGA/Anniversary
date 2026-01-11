import { createRouter, createWebHashHistory } from 'vue-router' 
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/',
      name: 'login',
      component: LoginView
    }
  ],
})

export default router
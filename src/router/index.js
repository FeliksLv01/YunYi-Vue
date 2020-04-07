import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../view/Login.vue'
import Home from '../view/Home.vue'
import User from '../view/user/User.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: () => import('../view/Welcome.vue') },
      { path: '/users', component: User }
      // {
      //   path: '/music',
      //   component: () => import('../components/Music.vue')
      // }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

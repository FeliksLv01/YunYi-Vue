import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../view/Login.vue'
import Home from '../view/Home.vue'
import User from '../view/user/User.vue'
import Console from '../view/console/Console.vue'
import Rights from '../view/power/Rights.vue'
import Roles from '../view/power/Roles.vue'
import Upload from '../view/file/Upload.vue'
import FileList from '../view/file/FileList.vue'
import UserInfo from '../view/user/UserInfo.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
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
      {
        path: '/welcome',
        component: () => import('../view/Welcome.vue')
      },
      {
        path: '/users',
        meta: {
          parentTitle: '用户管理',
          title: '用户列表'
        },
        component: User
      },
      {
        path: '/console',
        meta: {
          parentTitle: '控制台', title: '控制台数据'
        },
        component: Console
      },
      {
        path: '/rights',
        meta: {
          parentTitle: '权限管理', title: '权限列表'
        },
        component: Rights
      },
      {
        path: '/roles',
        meta: {
          parentTitle: '权限管理', title: '角色列表'
        },
        component: Roles
      },
      {
        path: '/upload',
        meta: {
          parentTitle: '文件管理', title: '文件上传'
        },
        component: Upload
      },
      {
        path: '/filelist',
        meta: {
          parentTitle: '文件管理', title: '文件列表'
        },
        component: FileList
      },
      {
        path: '/userinfo',
        meta: {
          parentTitle: '个人中心', title: '修改个人信息'
        },
        component: UserInfo
      }
    ]
  },
  {
    path: '/*',
    name: '404',
    component: () => import('../view/error/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next是一个函数，表示放行 next() next('/login')
  if (to.path === '/login') {
    return next()
  }
  // 获取session
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  } else {
    next()
  }
})

export default router

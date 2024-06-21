import router from './router'

import NProgress from 'nprogress' //进度条
import 'nprogress/nprogress.css'
import store from './store'

NProgress.configure({ showSpinner: false })
NProgress.configure({ speed: 500 }); // 设置进度条速度
const whiteList = ['/login', '/register']
NProgress.start()
NProgress.done()
const a = {
  path: '/about',
  name: 'about',
  component: () => import('@/views/AboutView.vue')
}
console.log(a)
router.addRoute(a) // 动态添加可访问路由表
store.dispatch('GenerateRoutes').then(accessRoutes => {
  // 根据roles权限生成可访问的路由表
  router.addRoutes(accessRoutes) // 动态添加可访问路由表
  // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

router.afterEach(() => {
  NProgress.done()
})

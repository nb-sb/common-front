import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Cookies from 'js-cookie'

import './assets/icons' // icon
import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import axios from 'axios'
import store from './store'
Vue.use(VueRouter)
Vue.use(router)
Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.prototype.$axios = axios;
new Vue({
  //将router配置传给Vue实例
  router,
  store,
  render: h => h(App)
}).$mount('#app')
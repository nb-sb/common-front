import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'
const baseURL = '/api'

const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 添加请求拦截器
instance.interceptors.request.use(config => {
  // 在发送请求之前做些什么
  // const token = store.state.user.userInfo.token
  // if (token) {
  //   console.log(token.token)
  //   config.headers.Authorization = token.token
  // }
  return config
}, error => {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(response => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.data.code === '0') {
    return response
  }
  Message.error(response.data.msg || '服务异常')
  return Promise.reject(response.data)
}, error => {

  if (error.response?.status === 401) {
    if (router.currentRoute.path !== '/') {
      Message.error('用户已过期,请重新登录')
    } else {
      Message.error(error.response?.data?.msg || '服务异常')
    }
    router.push('/')
    // return new Promise(() => {});
  }
  //特殊情况
  Message.error(error.response?.data?.msg || '服务异常')
  return Promise.reject(error)// 返回一个包含错误信息的Promise对象
})

export default instance
export { baseURL }
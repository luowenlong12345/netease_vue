import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'
// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
const axios = require('axios')
axios.defaults.baseURL = '/api'
Vue.use(ElementUI)
Vue.prototype.$qs = qs
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
var instance = axios.create({
  baseURL: '',
  timeout: 5000,
  headers: {'Content-Type': 'multipart/form-data'}
})

Vue.prototype.$axios = axios
Vue.prototype.$instance = instance

axios.interceptors.request.use(function (config) {
  if (config.method === 'post') {
    config.data = qs.stringify(config.data)
  }
  return config
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>',
  render: h => h(App)
})

axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  if (response.data.errorCode === 2001) {
    ElementUI.Notification({
      title: '警告',
      message: response.data.errorMsg,
      type: 'warning'
    })
    return router.replace({path: '/login'})
  } else if (response.data.success === false) {
    ElementUI.Notification({
      title: '错误',
      message: response.data.errorMsg,
      type: 'error'
    })
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

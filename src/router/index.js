import Vue from 'vue'
import Router from 'vue-router'
// 导入刚才编写的组件
import AppIndex from '../components/home/AppIndex'
import Login from '../components/Login'
import Register from '../components/Register'
import Test from '../components/Test'
import SellerHome from '../components/SellerHome'
import BuyerHome from '../components/BuyerHome'

Vue.use(Router)

export default new Router({
  routes: [
    // 下面都是固定的写法
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'AppIndex',
      component: AppIndex
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/sellerHome',
      name: 'SellerHome',
      component: SellerHome
    },
    {
      path: '/buyerHome',
      name: 'BuyerHome',
      component: BuyerHome
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    }

  ]
})

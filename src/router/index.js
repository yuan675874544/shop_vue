import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/common/Header'
import Left from '@/components/common/Sidebar'
import Tag from '@/components/common/Tags'
import Home from '@/components/common/Home'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [

    {
      path: '/',
      redirect: '/test'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Test.vue'),
          meta: { title: '系统首页' }
        },{
          path: '/Type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '分类管理' }
        },{
          path: '/Pin',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Pin.vue'),
          meta: { title: '品牌管理' }
        },{
          path: '/Shu',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Shu.vue'),
          meta: { title: '属性管理' }

        },{
          path: '/Shop',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Shop.vue'),
          meta: { title: '商品管理' }
        }
      ]
    }
  ]
})

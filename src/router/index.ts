import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/utils',
    name: 'Utils',
    component: () => import(/* webpackChunkName: "utils" */ '../views/Utils.vue')
  }
]

const router = new VueRouter({
  routes: routes,
  mode: 'history'
})

export default router

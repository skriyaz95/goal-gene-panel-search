import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/views/Home.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: "/:tab?",
    name: "home",
    meta: { i18n: "navigation.home" }, //useful to retrieve locale text in en.json for example

    component: Home,
  },
  {
    path: "/utils/:tab?/:item?",
    name: "utils",
    meta: { i18n: "navigation.utils" },
    component: () =>
      import(/* webpackChunkName: "utils" */ "@/views/Utils.vue"),
  },
  {
    path: "/explore/:tab?/:item?",
    name: "explore",
    meta: { i18n: "navigation.explore" },
    component: () =>
      import(/* webpackChunkName: "explore" */ "@/views/Explore.vue"),
  },
  {
    path: "/help/:tab?",
    name: "help",
    meta: { i18n: "navigation.help" },
    component: () =>
      import(/* webpackChunkName: "explore" */ "@/views/Help.vue"),
  },
  {
    path: "*",
    name: "error",
    meta: { i18n: "navigation.error" },
    component: () =>
      import(/* webpackChunkName: "explore" */ "@/views/Error.vue"),
  },
]

const router = new VueRouter({
  routes: routes,
  mode: "history",
})

export default router

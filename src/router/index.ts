import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/views/Home.vue"
import SimpleSearch from "@/views/SimpleSearch.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: "/:tab?",
    name: "home",
    component: Home,
  },
  {
    path: "/search/simple",
    name: "search",
    component: SimpleSearch,
  },
  {
    path: "/utils/:tab?/:item?",
    name: "utils",
    component: () =>
      import(/* webpackChunkName: "utils" */ "@/views/Utils.vue"),
  },
  {
    path: "/explore/:tab?/:item?",
    name: "explore",
    component: () =>
      import(/* webpackChunkName: "explore" */ "@/views/Explore.vue"),
  },
  {
    path: "/help/:tab?",
    name: "help",
    component: () =>
      import(/* webpackChunkName: "explore" */ "@/views/Help.vue"),
  },
  {
    path: "*",
    name: "error",
    component: () =>
      import(/* webpackChunkName: "explore" */ "@/views/Error.vue"),
  },
]

const router = new VueRouter({
  routes: routes,
  mode: "history",
})

export default router

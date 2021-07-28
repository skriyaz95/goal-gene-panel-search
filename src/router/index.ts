import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/views/Home.vue"
Vue.use(VueRouter)

const routes = [
  {
    path: "/:tab?",
    name: "Home",
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
]

const router = new VueRouter({
  routes: routes,
  mode: "history",
})

// router.beforeEach((to, from, next) => {
//   console.log(to, from)
//   document.title = "GTI " + (i18n.t(to.meta.i18n + ".title.text") || "")
//   next()
// })

export default router

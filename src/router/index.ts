import Vue from "vue"
import VueRouter from "vue-router"
import Home from "@/views/Home.vue"
import Explore from "@/views/Explore.vue"
import i18n from "@/i18n"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Home",
    meta: { i18n: "navigation.home" }, //useful to retrieve locale text in en.json for example

    component: Home,
  },
  {
    path: "/utils",
    name: "Utils",
    meta: { i18n: "navigation.utils" },
    component: () =>
      import(/* webpackChunkName: "utils" */ "@/views/Utils.vue"),
  },
  {
    path: "/explore",
    name: "Explore",
    meta: { i18n: "navigation.explore" },

    component: Explore,
  },
]

const router = new VueRouter({
  routes: routes,
  mode: "history",
})

router.beforeEach((to, from, next) => {
  document.title = "GTI " + (i18n.t(to.meta.i18n + ".title.text") || "")
  next()
})

export default router

import Vue from "vue"
import "./plugins/axios"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import i18n from "./i18n"
import GeneEntry from "@/components/GeneEntry.vue"
import "@/assets/styles.css"

Vue.component("GeneEntry", GeneEntry)

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app")

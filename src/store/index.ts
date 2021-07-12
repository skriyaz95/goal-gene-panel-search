import Vue from "vue"
import Vuex from "vuex"
import state from "@/store/state"
import mutations from "@/store/mutations"
import actions from "@/store/actions"
import getters from "@/store/getters"
import modules from "@/store/modules"

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules,
  strict: true,
})

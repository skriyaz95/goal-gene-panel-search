import Vue from 'vue'
import Vuex from 'vuex'
import { GenePanel, PanelPayload } from "@/types/panel-types";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tempPanels: new Array<GenePanel>()
  },
  mutations: {
    addTempPanel(state, payload: PanelPayload) {
      state.tempPanels.push(payload.panel);
    },
    resetPanels(state) {
      state.tempPanels = [];
    }
  },
  actions: {
  },
  getters: {
    getTempPanels: (state) => {
      return state.tempPanels;
    }
  },
  modules: {
  }
})

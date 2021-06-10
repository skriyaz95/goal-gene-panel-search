import Vue from 'vue'
import Vuex from 'vuex'
import { GenePanel, PanelPayload } from "@/types/panel-types";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tempPanels: new Array<GenePanel>(),
    panels: new Array<GenePanel>()
  },
  mutations: {
    addTempPanel(state, payload: PanelPayload) {
      state.tempPanels.push(payload.panel);
    },
    addPanel(state, payload: PanelPayload) {
      state.panels.push(payload.panel);
    },
    resetTempPanels(state) {
      state.tempPanels = [];
    },
    resetPanels(state) {
      state.panels = [];
    },
  },
  actions: {
  },
  getters: {
    getTempPanels: (state) => {
      return state.tempPanels;
    },
    getPanels: (state) => {
      return state.panels;
    }
  },
  modules: {
  }
})

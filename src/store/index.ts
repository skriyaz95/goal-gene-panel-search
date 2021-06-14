import Vue from 'vue'
import Vuex from 'vuex'
import {Gene, GenePanel, PanelPayload} from "@/types/panel-types";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tempPanels: new Array<GenePanel>(),
    panels: new Array<GenePanel>(),
    userGenes: new Array<Gene>()
  },
  mutations: {
    addTempPanel(state, payload: PanelPayload) {
      state.tempPanels.push(payload.panel);
    },
    addPanel(state, payload: PanelPayload) {
      state.panels.push(payload.panel);
    },
    setUserGenes(state, payload: Gene[]) {
      state.userGenes = payload;
    },
    resetTempPanels(state) {
      state.tempPanels = [];
    },
    resetPanels(state) {
      state.panels = [];
    },
    clearUserGenes(state) {
      state.userGenes = [];
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

import { Gene, PanelPayload, SynonymGene } from "@/types/panel-types"

export default {
  addTempPanel(state: any, payload: PanelPayload) {
    state.tempPanels.push(payload.panel)
  },
  addPanel(state: any, payload: PanelPayload) {
    state.panels.push(payload.panel)
  },
  setUserGenes(state: any, payload: Gene[]) {
    state.userGenes = payload
  },
  resetTempPanels(state: any) {
    state.tempPanels = []
  },
  resetPanels(state: any) {
    state.panels = []
  },
  clearUserGenes(state: any) {
    state.userGenes = []
  },
  updateSynonyms(state: any, payload: SynonymGene[]) {
    state.synonyms = payload
  },
  updateLastSearch(state: any, payload: String) {
    state.lastSearch = payload
  },
}

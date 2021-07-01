import { Gene, GenePanel, PanelPayload, SynonymGene } from "@/types/panel-types"

export default {
  addPanel(state: any, payload: PanelPayload) {
    state.panels.push(payload.panel)
  },
  setUserGenes(state: any, payload: Gene[]) {
    state.userGenes = payload
  },
  resetPanels(state: any) {
    state.panels = []
  },
  updatePanels(state: any, payload: Array<GenePanel>) {
    state.panels = payload
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

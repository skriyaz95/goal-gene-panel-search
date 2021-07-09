import { GenePanelDetails, SynonymGene } from "@/types/panel-types"

export default {
  resetPanels(state: any) {
    state.panels = []
  },
  updatePanels(state: any, payload: Array<GenePanelDetails>) {
    state.panels = payload
  },
  updateSynonyms(state: any, payload: SynonymGene[]) {
    state.synonyms = payload
  },
  updateLastSearch(state: any, payload: String) {
    state.lastSearch = payload
  },
}

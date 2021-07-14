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
  updateLastSearch(state: any, payload: any) {
    state.lastSearch = payload.lastSearch
    state.lastSearches = payload.lastSearches
  },
  updateLastSearches(state: any, payload: any) {
    state.lastSearches = payload
  },
  updateChipOutlined(state: any, payload: boolean) {
    state.uiProps.chipOutlined = payload
  },
}

import {GenePanelDetails, Institution, SynonymGene} from "@/types/panel-types"

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
  updateChipOutlined(state: any, payload: boolean) {
    state.uiProps.chipOutlined = payload
  },
  updateInputNeedsReload(state: any, payload: boolean) {
    state.inputNeedsReload = payload
  },
  updateLastItemExplore(state: any, payload: Number) {
    state.lastItemExplore = payload
  },
  updateLastItemUtils(state: any, payload: Number) {
    state.lastItemUtils = payload
  },
  async updateLastTabHome(state: any, payload: string) {
    state.lastTabHome = payload
  },
  async updateLastTabExplore(state: any, payload: string) {
    state.lastTabExplore = payload
  },
  async updateLastTabUtils(state: any, payload: string) {
    state.lastTabUtils = payload
  },
  updateInstitutions(state: any, payload: Institution[]) {
    state.institutions = payload
  }
}

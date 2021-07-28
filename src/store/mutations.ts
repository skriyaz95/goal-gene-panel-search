import { GenePanelDetails, Institution, SynonymGene } from "@/types/panel-types"

export default {
  resetPanels(state: any) {
    state.panels = []
  },
  updatePanels(state: any, payload: Array<GenePanelDetails>) {
    state.panels = JSON.parse(JSON.stringify(payload))
  },
  updateInstitutions(state: any, payload: Array<Institution>) {
    state.institutions = JSON.parse(JSON.stringify(payload))
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
  updateLastTabHome(state: any, payload: string) {
    state.lastTabHome = payload
  },
  updateLastExplorePath(state: any, payload: any) {
    state.lastExplorePath = payload
  },
  updateLastUtilsPath(state: any, payload: any) {
    state.lastUtilsPath = payload
  },
}

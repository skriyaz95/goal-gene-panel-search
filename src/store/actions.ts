import { Gene, PanelSearchResult, ParsedGenes } from "@/types/panel-types"

export default {
  async setUserGenes(context: any, payload: Gene[]) {
    return new Promise((resolve) => {
      context.commit("setUserGenes", payload)
      resolve(true)
    })
  },
  async updateLastSearch(context: any, payload: String) {
    context.commit("updateLastSearch", payload)
  },
  async setParsedGenes(context: any, payload: ParsedGenes) {
    return new Promise((resolve) => {
      context.commit("setParsedGenes", payload)
      resolve(true)
    })
  },
  async setPanelSearchResult(context: any, payload: PanelSearchResult) {
    return new Promise((resolve) => {
      context.commit("setPanelSearchResult", payload)
      resolve(true)
    })
  },
}

import {Gene, GenePanelDetails, Institution, ParsedGenes} from "@/types/panel-types"
import {
  FormatCompareItemsPayload,
  UserInputPayload,
} from "@/types/payload-types"
import { LastSelection } from "@/types/ui-types"
import $getFindGenesWorker from "@/utils/workers/worker-instance"

export default {
  async cleanUserInput(context: any, payload: UserInputPayload) {
    $getFindGenesWorker().postMessage({
      todo: "cleanUserInput",
      payload: payload,
    })
  },
  /**
   * Keep track of the last searches so they can be recalled
   * Since it happens on blur, make sure the new value is not equal
   * to the previous values
   * @param context
   * @param payload
   */
  async updateLastSearch(context: any, payload: string) {
    return new Promise((resolve) => {
      const lastSearchesInStorage = localStorage.getItem("lastSearches")
      let lastSearches = []
      if (lastSearchesInStorage) {
        lastSearches = JSON.parse(lastSearchesInStorage)
      }
      const cleanPayload = payload.trim().toUpperCase()
      const lastItem =
        lastSearches == 0 ? "" : lastSearches[lastSearches.length - 1]
      if (cleanPayload && cleanPayload !== lastItem.toUpperCase()) {
        //less than 3 -> push
        if (lastSearches.length < 3) {
          lastSearches.push(payload)
        }
        //more than 3 -> rotate
        else {
          const temp1 = lastSearches[1]
          const temp2 = lastSearches[2]
          lastSearches = [temp1, temp2, payload]
        }
      }
      localStorage.setItem("lastSearches", JSON.stringify(lastSearches))
      resolve(lastSearches)
    })
  },
  async parseUserGenes(context: any, payload: Gene[]) {
    $getFindGenesWorker().postMessage({
      todo: "parseUserGenes",
      userGenes: payload,
    })
  },
  async findGenesInAllPanels(context: any, payload: ParsedGenes) {
    $getFindGenesWorker().postMessage({
      todo: "findGenesInAllPanels",
      parsedGenes: payload,
      panels: context.state.panels,
    })
  },
  async updatePanels(context: any, payload: GenePanelDetails[]) {
    context.commit("updatePanels", payload)
  },
  async updateInstitutions(context: any, payload: Institution[]) {
    context.commit("updateInstitutions", payload)
  },
  async formatCompareItems(context: any, payload: FormatCompareItemsPayload) {
    const panelNamesSorted = context.state.panels.map(
      (p: GenePanelDetails) => p.name,
    )
    payload.panelNames = panelNamesSorted
    $getFindGenesWorker().postMessage({
      todo: "formatCompareItems",
      payload: payload,
    })
  },
  async updateChipOutlined(context: any, payload: boolean) {
    context.commit("updateChipOutlined", payload)
  },
  async clearLastSearches(context: any) {
    return new Promise((resolve) => {
      localStorage.removeItem("lastSearches")
      resolve("success")
    })
  },
  async updateInputNeedsReload(context: any, payload: boolean) {
    context.commit("updateInputNeedsReload", payload)
  },
  async updateLastTabHome(context: any, payload: string) {
    context.commit("updateLastTabHome", payload)
  },
  async updateLastExplorePath(context: any, payload: any) {
    context.commit("updateLastExplorePath", payload)
  },
  async updateLastUtilsPath(context: any, payload: any) {
    context.commit("updateLastUtilsPath", payload)
  },
  updateLastSelection(context: any, payload: LastSelection) {
    context.commit("updateLastSelection", payload)
  },
}

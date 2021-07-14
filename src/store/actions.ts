import { Gene, GenePanelDetails, ParsedGenes } from "@/types/panel-types"
import {
  FormatCompareItemsPayload,
  UserInputPayload,
} from "@/types/payload-types"
import $getFindGenesWorker from "@/utils/workers/worker-instance"
import { getCookie, setCookie } from "@/utils/cookies"

export default {
  async cleanUserInput(context: any, payload: UserInputPayload) {
    $getFindGenesWorker().postMessage({
      todo: "cleanUserInput",
      payload: payload,
    })
  },
  async updateLastSearch(context: any, payload: string) {
    const lastSearchOne = getCookie("lastSearchOne")
    const lastSearchTwo = getCookie("lastSearchTwo")
    const lastSearchThree = getCookie("lastSearchThree")
    const miniedPayload = payload.replace(/[;\n\t]+/g, ",")
    if (lastSearchThree) {
      // rotate cookies
      setCookie("lastSearchOne", lastSearchTwo, 365)
      setCookie("lastSearchTwo", lastSearchThree, 365)
      setCookie("lastSearchThree", miniedPayload, 365)
    } else if (lastSearchTwo) {
      setCookie("lastSearchThree", miniedPayload, 365)
    } else if (lastSearchOne) {
      setCookie("lastSearchTwo", miniedPayload, 365)
    } else {
      setCookie("lastSearchOne", miniedPayload, 365)
    }
    context.commit("updateLastSearch", {
      lastSearch: payload,
      lastSearches: [lastSearchOne, lastSearchTwo, lastSearchThree],
    })
  },
  async initLastSearches(context: any) {
    const lastSearchOne = getCookie("lastSearchOne")
    const lastSearchTwo = getCookie("lastSearchTwo")
    const lastSearchThree = getCookie("lastSearchThree")
    const lastSearches = [lastSearchOne, lastSearchTwo, lastSearchThree]
    context.commit("updateLastSearches", lastSearches)
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
}

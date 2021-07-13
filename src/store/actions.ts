import { Gene, GenePanelDetails, ParsedGenes } from "@/types/panel-types"
import { UserInputPayload } from "@/types/payload-types"
import $getFindGenesWorker from "@/utils/workers/worker-instance"
import { getCookie, setCookie } from "@/utils/cookies"

export default {
  async cleanUserInput(context: any, payload: UserInputPayload) {
    $getFindGenesWorker().postMessage({
      init: false,
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
      init: false,
      todo: "parseUserGenes",
      userGenes: payload,
    })
  },
  async findGenesInAllPanels(context: any, payload: ParsedGenes) {
    $getFindGenesWorker().postMessage({
      init: false,
      todo: "findGenesInAllPanels",
      parsedGenes: payload,
      panels: context.state.panels,
    })
  },
  async updatePanels(context: any, payload: GenePanelDetails[]) {
    context.commit("updatePanels", payload)
  },
}

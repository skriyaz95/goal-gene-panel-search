import { Gene, GenePanel, ParsedGenes } from "@/types/panel-types"
import { UserInputPayload } from "@/types/payload-types"
import $getFindGenesWorker from "@/utils/workers/worker-instance"

export default {
  async cleanUserInput(context: any, payload: UserInputPayload) {
    $getFindGenesWorker().postMessage({
      init: false,
      todo: "cleanUserInput",
      payload: payload,
    })
  },
  async updateLastSearch(context: any, payload: String) {
    context.commit("updateLastSearch", payload)
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
  async updatePanels(context: any, payload: GenePanel[]) {
    context.commit("updatePanels", payload)
  },
}

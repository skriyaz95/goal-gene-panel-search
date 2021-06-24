import { Gene, GenePanel } from "@/types/panel-types"
import allGenesData from "@/assets/all_genes.json"
import synonymData from "@/assets/synonyms.json"

export default {
  tempPanels: new Array<GenePanel>(),
  panels: new Array<GenePanel>(),
  userGenes: new Array<Gene>(),
  allGenes: allGenesData,
  synonyms: synonymData,
  lastSearch: String(),
}

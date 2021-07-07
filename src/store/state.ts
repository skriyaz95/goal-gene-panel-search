import {Gene, GenePanel, PanelSearchResult, ParsedGenes} from "@/types/panel-types"
import allGenesData from "@/assets/all_genes.json"
import synonymData from "@/assets/synonyms.json"
import institutionData from "@/assets/institutions.json"

export default {
  panels: new Array<GenePanel>(),
  userGenes: new Array<Gene>(),
  parsedGenes: new ParsedGenes(),
  panelSearchResult : new Array<PanelSearchResult>(),
  allGenes: allGenesData,
  synonyms: synonymData,
  lastSearch: String(),
  institutions: institutionData,
}

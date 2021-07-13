import allGenesData from "@/assets/all_genes.json"
import synonymData from "@/assets/synonyms.json"
import institutionData from "@/assets/institutions.json"
import panels from "@/assets/panels.json"

export default {
  panels: panels,
  allGenes: allGenesData,
  synonyms: synonymData,
  lastSearch: String(),
  institutions: institutionData,
  lastSearches: new Array<String>(),
}

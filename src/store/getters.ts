import {FullGene, Gene, GenePanel, Institution, PanelSearchResult, SynonymGene,} from "@/types/panel-types"

export default {
  getPanels: (state: any) => {
    return state.panels
  },
  getUserGenes: (state: any) => {
    return state.userGenes
  },
  getParsedGenes: (state: any) => {
    return state.parsedGenes
  },
  getUserGenesSorted: (state: any) => {
    return state.userGenes.sort((a: Gene, b: Gene) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
  },
  getPanelSearchResult: (state: any) => {
    return state.panelSearchResult
  },
  getAllGenes: (state: any) => {
    return state.allGenes
  },
  getAllGeneMap: (state: any) => {
    const allGeneMap = new Map<String, FullGene>()
    state.allGenes.forEach((gene: FullGene) => {
      allGeneMap.set(gene.symbol, gene)
    })
    return allGeneMap
  },
  getSynonyms: (state: any) => {
    return state.synonyms
  },
  getSynonymMap: (state: any) => {
    const allSynonymMap = new Map<String, SynonymGene>()
    state.synonyms.forEach((synonym: SynonymGene) => {
      allSynonymMap.set(synonym.synonym, synonym)
    })
    return allSynonymMap
  },
  getInstitutionMap: (state: any) => {
    const allInstitutions = new Map<String, Institution>()
    state.institutions.forEach((institution: Institution) => {
      institution.panels.forEach((panel: string) => {
        allInstitutions.set(panel.toUpperCase(), institution)
      })
    })
    return allInstitutions
  },
  getLastSearch: (state: any) => {
    return state.lastSearch
  },
}

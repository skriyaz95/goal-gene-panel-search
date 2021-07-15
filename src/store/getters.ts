import { GenePanelDetails, Institution } from "@/types/panel-types"

export default {
  getPanels: (state: any) => {
    return state.panels
  },
  getUserGenes: (state: any) => {
    return state.userGenes
  },
  // getParsedGenes: (state: any) => {
  //   return state.parsedGenes
  // },
  // getUserGenesSorted: (state: any) => {
  //   return [...state.userGenes].sort((a: Gene, b: Gene) => {
  //     if (a.name < b.name) {
  //       return -1
  //     }
  //     if (a.name > b.name) {
  //       return 1
  //     }
  //     return 0
  //   })
  // },
  getPanelSearchResult: (state: any) => {
    return state.panelSearchResult
  },
  getInstitutionsByPanel: (state: any) => {
    const allInstitutions = new Map<String, Institution>()
    state.institutions.forEach((institution: Institution) => {
      institution.panels.forEach((panel: string) => {
        allInstitutions.set(panel, institution)
      })
    })
    return allInstitutions
  },
  //not use for now
  // getInstitutionsByName: (state: any) => {
  //   const allInstitutions = new Map<String, Institution>()
  //   state.institutions.forEach((institution: Institution) => {
  //     allInstitutions.set(institution.name, institution)
  //   })
  //   return allInstitutions
  // },
  //not use for now
  // getInstitutionDropDownItems: (state: any) => {
  //   const institutionDropDownItems = new Array<{}>()
  //   state.institutions.forEach((institution: Institution) => {
  //     institutionDropDownItems.push(institution.name)
  //   })
  //   return institutionDropDownItems.sort()
  // },
  getInstitutionsSorted: (state: any) => {
    return [...state.institutions].sort((a: Institution, b: Institution) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    })
  },
  getInstitutions: (state: any): Array<Institution> => {
    return state.institutions
  },
  getPanelsSorted: (state: any) => {
    return [...state.panels].sort(
      (a: GenePanelDetails, b: GenePanelDetails) => {
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }
        return 0
      },
    )
  },
  getChipOutlined: (state: any) => {
    return state.uiProps.chipOutlined
  },
  getInputNeedsReload: (state: any) => {
    return state.inputNeedsReload
  },
  getPanelsByInstitution: (state: any) => {
    const panels = new Map<String, String[]>()
    state.institutions.forEach((i: Institution) => panels.set(i.name, i.panels))
    return panels
  },
  // getPanelsByName: (state: any) => {
  //   const allPanels = new Map<String, GenePanel>()
  //   state.panels.forEach((panel: GenePanel) => {
  //     allPanels.set(panel.name, panel)
  //   })
  //   return allPanels
  // },
}

import {Gene, GenePanel, PanelSearchResult, FullGene, SynonymGene} from "@/types/panel-types";

export default {
    getTempPanels: (state: any) => {
        return state.tempPanels
    },
    getPanels: (state: any) => {
        return state.panels
    },
    getUserGenes: (state: any) => {
        return state.userGenes
    },
    getUserGenesSorted: (state: any) => {
        return state.userGenes.sort((a: Gene,b:Gene) => {
           if (a.name < b.name) {
               return -1;
           }
           if (a.name > b.name) {
               return 1;
           }
           return 0;
        })
    },
    getUserGenesInPanels: (state: any, getters: any) => {
        const result = new Array<PanelSearchResult>()
        state.panels.forEach((panel: GenePanel) => {
            const genes = getters.getUserGenesInSelectedPanel(panel);
            if (genes.genesInPanel.length > 0 || genes.genesNotInPanel.length > 0) {
                result.push(new PanelSearchResult(panel.name.toUpperCase(), genes.genesInPanel, genes.genesNotInPanel));
            }
        })
        return result
    },
    getUserGenesInSelectedPanel: (state: any) => (panel: GenePanel) => {
        const genesInPanel = new Array<Gene>();
        const genesNotInPanel = new Array<Gene>();
        const panelGenesSet = new Set(panel.genes.map((gene: Gene) => gene.name.toUpperCase()));
        state.userGenes.forEach((userGene: Gene) => {
            if (panelGenesSet.has(userGene.name)) {
                genesInPanel.push(new Gene(userGene.name));
            } else {
                genesNotInPanel.push(new Gene(userGene.name));
            }
        })
        return {
            "genesInPanel": genesInPanel,
            "genesNotInPanel": genesNotInPanel
        }
    },
    getAllGenes: (state: any) => {
        return state.allGenes;
    },
    getAllGeneMap: (state: any) => {
        const allGeneMap = new Map<String, FullGene>()
        state.allGenes.forEach((gene: FullGene) => {
            allGeneMap.set(gene.symbol, gene)
        });
        return allGeneMap
    },
    getSynonyms: (state: any) => {
        return state.synonyms
    },
    getSynonymMap: (state: any) => {
        const allSynonymMap = new Map<String, SynonymGene>()
        state.synonyms.forEach((synonym: SynonymGene) => {
            allSynonymMap.set(synonym.synonym, synonym)
        });
        return allSynonymMap
    },
}

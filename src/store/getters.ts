import {Gene, GenePanel, PanelSearchResult} from "@/types/panel-types";

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
    }
}

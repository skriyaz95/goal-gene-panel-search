import {Gene, GenePanel} from "@/types/panel-types";

export default {
    getTempPanels: (state: any) => {
        return state.tempPanels
    },
    getPanels: (state: any) => {
        return state.panels
    },
    getUserGenesInPanels: (state: any, getters: any) => {
        const result = new Array<GenePanel>()
        state.panels.forEach((panel: GenePanel) => {
            const genesInPanel = getters.getUserGenesInSelectedPanel(panel);
            if (genesInPanel.length > 0) {
                result.push(new GenePanel(panel.name, genesInPanel));
            }
        })
        return result
    },
    getUserGenesInSelectedPanel: (state: any) => (panel: GenePanel) => {
        const genesInPanel = new Array<Gene>();
        const panelGenesSet = new Set(panel.genes.map((gene: Gene) => gene.name));
        state.userGenes.forEach((userGene: Gene) => {
            if (panelGenesSet.has(userGene.name)) {
                genesInPanel.push(new Gene(userGene.name));
            }
        })
        return genesInPanel
    }
}

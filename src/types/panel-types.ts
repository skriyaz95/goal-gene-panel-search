export class GenePanel {
    name: string;
    genes: Gene[];

    constructor(name: string, genes: Gene[]) {
      this.name = name;
      this.genes = genes;
    }
  }

export class PanelSearchResult {
    name: string;
    genesInPanel: Gene[];
    genesNotInPanel: Gene[];

    constructor(name: string, genesInPanel: Gene[], genesNotInPanel: Gene[]) {
        this.name = name;
        this.genesInPanel = genesInPanel;
        this.genesNotInPanel = genesNotInPanel;
    }
}

  export class Gene {
    name: string;

    constructor(name: string) {
      this.name = name;
    }
  }

  /** payload object to commit to the Vuex store
   * It's best to commit a payload object rather than the panel directly
  */
  export class PanelPayload {
    panel: GenePanel;

    constructor(panel: GenePanel) {
      this.panel = panel;
    }
  }

  export class PanelResultFormattedRow {
      name: string
      countGenesInPanel: number
      countGenesNotInPanel: number
      genesInPanel: string[]
      genesNotInPanel: string[]

      constructor(name: string, countGenesInPanel: number, countGenesNotInPanel: number, genesInPanel: string[], genesNotInPanel: string[]) {
          this.name = name;
          this.countGenesInPanel = countGenesInPanel;
          this.countGenesNotInPanel = countGenesNotInPanel;
          this.genesInPanel = genesInPanel;
          this.genesNotInPanel = genesNotInPanel;
      }
  }

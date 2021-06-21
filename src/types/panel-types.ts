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

  /**
   * Represents genes with symbol, db ids, and list of synonyms
   * For example when parsing a gene_info file
   */
  export class FullGene {
    symbol!: string
    hgncId!: string
    synonyms!: string[]
    loci: string
    ensemblId: string

    constructor(symbol: string, hgncId: string, synonyms: string[], loci: string,
      ensemblId: string) {
      this.symbol = symbol;
      this.hgncId = hgncId;
      this.synonyms = synonyms;
      this.loci = loci;
      this.ensemblId = ensemblId
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

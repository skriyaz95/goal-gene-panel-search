export class GenePanel {
    name: string;
    genes: Gene[];

    constructor(name: string, genes: Gene[]) {
      this.name = name;
      this.genes = genes;
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
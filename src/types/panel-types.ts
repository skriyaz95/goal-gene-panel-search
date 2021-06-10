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
  
  export class PanelPayload {
    panel: GenePanel;
  
    constructor(panel: GenePanel) {
      this.panel = panel;
    }
  }
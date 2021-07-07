export class Institution {
  name: string
  phone: string
  email: string
  website: string
  panels: string[]

  constructor(
    name: string,
    phone: string,
    email: string,
    website: string,
    panels: string[],
  ) {
    this.name = name
    this.phone = phone
    this.email = email
    this.website = website
    this.panels = panels
  }
}

export class GenePanel {
  name: string
  genes: Gene[]

  constructor(name: string, genes: Gene[]) {
    this.name = name
    this.genes = genes
  }
}

export class PanelSearchResult {
  name: string
  genesInPanel: Gene[]
  genesNotInPanel: Gene[]

  constructor(name: string, genesInPanel: Gene[], genesNotInPanel: Gene[]) {
    this.name = name
    this.genesInPanel = genesInPanel
    this.genesNotInPanel = genesNotInPanel
  }
}

export class Gene {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

/**
 * Class returned by a worker that identifies the genes found and
 * categorises it in 3 states (notFound, synonyms and symbols) (see ParsedGenes)
 * For now, we don't need a FullGene (except for synonyms to link back to the symbol )
 * but if we need ids or location information, we might want to return a realGene for
 * all states
 */
export class ParsedGene {
  gene: Gene
  state!: string
  realGene!: FullGene //only synonyms would have a realGene value

  constructor(gene: Gene) {
    this.gene = gene
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

  constructor(
    symbol: string,
    hgncId: string,
    synonyms: string[],
    loci: string,
    ensemblId: string,
  ) {
    this.symbol = symbol
    this.hgncId = hgncId
    this.synonyms = synonyms
    this.loci = loci
    this.ensemblId = ensemblId
  }
}

/**
 * Represents synonyms and the FullGene they are synonyms of
 * It's a reverse lookup way of finding a gene by synonym
 * For example when parsing a gene_info file
 */
export class SynonymGene {
  synonym!: string
  gene!: FullGene

  constructor(synonym: string, gene: FullGene) {
    this.synonym = synonym
    this.gene = gene
  }
}

/** payload object to commit to the Vuex store
 * It's best to commit a payload object rather than the panel directly
 */
export class PanelPayload {
  panel: GenePanel

  constructor(panel: GenePanel) {
    this.panel = panel
  }
}

export class PanelResultFormattedRow {
  name: string
  countGenesInPanel: number
  countGenesNotInPanel: number
  genesInPanel: string[]
  genesNotInPanel: string[]
  institution: Institution

  constructor(
    name: string,
    countGenesInPanel: number,
    countGenesNotInPanel: number,
    genesInPanel: string[],
    genesNotInPanel: string[],
    institution: Institution,
  ) {
    this.name = name
    this.countGenesInPanel = countGenesInPanel
    this.countGenesNotInPanel = countGenesNotInPanel
    this.genesInPanel = genesInPanel
    this.genesNotInPanel = genesNotInPanel
    this.institution = institution
  }
}

/**
 * Store the user input, once parsed into a ParsedGenes class
 * This will help passing the object back from the worker
 * and manipulate each category (symbol, synonym, notfound)
 * separately
 */
export class ParsedGenes {
  symbolFoundGenes = new Array<ParsedGene>()
  synonymFoundGenes = new Array<ParsedGene>()
  notFoundGenes = new Array<ParsedGene>()
}

/**
 * A temporary panel while it's being built
 */
export class PanelBuilder {
  panelName!: string
  parsedGenes!: ParsedGenes
  institutionName!: string

  constructor() {
    this.institutionName = ""
  }
}

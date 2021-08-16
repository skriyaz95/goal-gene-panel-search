import { ListItem } from "@/types/ui-types"

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

// export class GenePanel {
//   name: string
//   genes: Gene[]

//   constructor(name: string, genes: Gene[]) {
//     this.name = name
//     this.genes = genes
//   }
// }

export class GenePanelDetails {
  name: string
  genes: Gene[] //all gene symbols for fast search
  symbolsOnly: Gene[]
  synonymsOnly: SynonymGene[]
  notFound: Gene[]
  sourceFile: string

  constructor(
    name: string,
    genes: Gene[],
    parsedGenes: ParsedGenes,
    sourceFile: string,
  ) {
    this.name = name
    this.genes = genes
    this.symbolsOnly = parsedGenes.symbolFoundGenes.map((pg) => pg.gene)
    this.synonymsOnly = parsedGenes.synonymFoundGenes.map(
      (pg) => new SynonymGene(pg.gene.name, pg.realGene),
    )
    this.notFound = parsedGenes.notFoundGenes.map((pg) => pg.gene)
    this.sourceFile = sourceFile
  }
}

export class PanelSearchResult {
  name: string
  genesInPanel: ParsedGene[]
  genesNotInPanel: ParsedGene[]
  panelSymbolToSymbolMatch: string[]
  panelSynonymToSynonymMatch: string[]
  panelSymbolToSynonymMatch: SynonymGene[]
  panelSynonymToSymbolMatch: SynonymGene[]

  constructor(
    name: string,
    genesInPanel: ParsedGene[],
    genesNotInPanel: ParsedGene[],
    panelSymbolToSymbolMatch: string[],
    panelSynonymToSynonymMatch: string[],
    panelSymbolToSynonymMatch: SynonymGene[],
    panelSynonymToSymbolMatch: SynonymGene[],
  ) {
    this.name = name
    this.genesInPanel = genesInPanel
    this.genesNotInPanel = genesNotInPanel
    this.panelSymbolToSymbolMatch = panelSymbolToSymbolMatch
    this.panelSynonymToSynonymMatch = panelSynonymToSynonymMatch
    this.panelSymbolToSynonymMatch = panelSymbolToSynonymMatch
    this.panelSynonymToSymbolMatch = panelSynonymToSymbolMatch
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
  state!: string | undefined
  realGene!: FullGene | string | undefined //only synonyms would have a realGene value

  constructor(gene: Gene, state?: string, realGene?: FullGene) {
    this.gene = gene
    this.state = state ? state : undefined
    this.realGene = realGene ? realGene : undefined
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
  gene!: FullGene | string | undefined //use string when the full gene is not needed

  constructor(synonym: string, gene: FullGene | string | undefined) {
    this.synonym = synonym
    this.gene = gene
  }
}

export class PanelResultFormattedRow {
  name: string
  panelGenes: PanelGenes
  institution: ListItem | null
  constructor(
    name: string,
    panelGenes: PanelGenes,
    institution: ListItem | null,
  ) {
    this.name = name
    this.panelGenes = panelGenes
    this.institution = institution
  }
}

export class PanelGenes {
  genesInPanel: ParsedGene[]
  genesNotInPanel: ParsedGene[]

  constructor(genesInPanel: ParsedGene[], genesNotInPanel: ParsedGene[]) {
    this.genesInPanel = genesInPanel;
    this.genesNotInPanel = genesNotInPanel;
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
  panelFileName!: string

  constructor() {
    this.institutionName = ""
  }
}

import { PanelSearchResult, ParsedGenes, GenePanelDetails } from "./panel-types"

export class UserInputPayload {
  userinput: string
  validSeparators: RegExp

  constructor(userinput: string, validSeparators: RegExp) {
    this.userinput = userinput
    this.validSeparators = validSeparators
  }
}

export class FormatCompareItemsPayload {
  parsedGenes: ParsedGenes
  panelSearchResults: Array<PanelSearchResult>
  panelNames!: GenePanelDetails[]

  constructor(
    parsedGenes: ParsedGenes,
    panelSearchResults: Array<PanelSearchResult>,
  ) {
    this.parsedGenes = parsedGenes
    this.panelSearchResults = panelSearchResults
    this.panelNames = []
  }
}

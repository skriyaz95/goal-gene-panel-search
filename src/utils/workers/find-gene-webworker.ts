import { FullGene, Gene, ParsedGene, SynonymGene } from "@/types/panel-types"

const ctx: Worker = self as any
let allGeneMap = new Map<string, FullGene>()
let synonymMap = new Map<string, SynonymGene>()

function findAllGenes(userGenes: Array<Gene>): Array<ParsedGene> {
  const parsedGenes = new Array<ParsedGene>()
  for (let i = 0; i < userGenes.length; i++) {
    const userGene = userGenes[i]
    const parsedGene = new ParsedGene(userGene)
    applyState(allGeneMap, synonymMap, userGene, parsedGene)
    parsedGenes.push(parsedGene)
  }
  return parsedGenes
}

function applyState(
  allGeneMap: Map<string, FullGene>,
  synonymMap: Map<string, SynonymGene>,
  gene: Gene,
  parsedGene: ParsedGene,
) {
  //look by exact match
  if (allGeneMap.has(gene.name)) {
    const fullGene = allGeneMap.get(gene.name)
    if (fullGene && fullGene.symbol == gene.name) {
      //exact match
      parsedGene.state = "symbol"
      return parsedGene
    }
  } else if (synonymMap.has(gene.name)) {
    //synonym
    // var fullGene: FullGene = this.synonymMap.get(gene.name).gene
    parsedGene.state = "synonym"
    return parsedGene
  }
  return parsedGene
}

addEventListener("message", (event) => {
  if (event.data.init) {
    allGeneMap = event.data.allGeneMap
    synonymMap = event.data.synonymMap
  } else {
    const parsedGenes = findAllGenes(event.data.userGenes)
    ctx.postMessage({ parsedGenes })
  }
})

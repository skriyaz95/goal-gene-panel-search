import {
  FullGene,
  Gene,
  ParsedGene,
  SynonymGene,
  ParsedGenes,
} from "@/types/panel-types"

const ctx: Worker = self as any
let allGeneMap = new Map<string, FullGene>()
let synonymMap = new Map<string, SynonymGene>()

const stateSymbol = "symbol"
const stateSynonym = "synonym"
const stateNotFound = "notfound"

function findAllGenes(userGenes: Array<Gene>): ParsedGenes {
  const parsedGenes = new ParsedGenes()
  for (let i = 0; i < userGenes.length; i++) {
    const userGene = userGenes[i]
    const parsedGene = applyState(userGene)
    if (parsedGene.state === stateSymbol) {
      parsedGenes.symbolFoundGenes.push(parsedGene)
    } else if (parsedGene.state === stateSynonym) {
      parsedGenes.synonymFoundGenes.push(parsedGene)
    } else {
      parsedGenes.notFoundGenes.push(parsedGene)
    }
  }
  console.log(parsedGenes)
  return parsedGenes
}

function applyState(userGene: Gene) {
  const parsedGene = new ParsedGene(userGene)
  //look by exact match
  if (allGeneMap.has(userGene.name)) {
    // const fullGene = allGeneMap.get(userGene.name)
    // if (fullGene && fullGene.symbol == userGene.name) {
    //exact match
    parsedGene.state = stateSymbol
    return parsedGene
    // }
  } else if (synonymMap.has(userGene.name)) {
    //synonym
    // var fullGene: FullGene = this.synonymMap.get(gene.name).gene
    parsedGene.state = stateSynonym
    return parsedGene
  }
  parsedGene.state = stateNotFound
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

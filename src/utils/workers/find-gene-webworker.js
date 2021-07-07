import {ParsedGene, ParsedGenes} from "@/types/panel-types"
import {Gene, PanelSearchResult} from "../../types/panel-types";

const ctx = self
let allGeneMap = new Map()
let synonymMap = new Map()

const stateSymbol = "symbol"
const stateSynonym = "synonym"
const stateNotFound = "notfound"

function findAllGenes(userGenes) {
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
  return parsedGenes
}

function applyState(userGene) {
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
    var fullGene = synonymMap.get(userGene.name).gene
    parsedGene.state = stateSynonym
    parsedGene.realGene = fullGene
    return parsedGene
  }
  parsedGene.state = stateNotFound
  return parsedGene
}

function findGenesInAllPanels(genesList, panels) {
  let result = [];
  panels.forEach((panel) => {
    const genes = findGenesInSelectedPanel(genesList, panel)
    if (genes.genesInPanel.length > 0 || genes.genesNotInPanel.length > 0) {
      result.push(
        new PanelSearchResult(
          panel.name,
          genes.genesInPanel,
          genes.genesNotInPanel,
        ),
      )
    }
  })
  return result
}

function findGenesInSelectedPanel(genesList, panel) {
  const genesInPanel = []
  const genesNotInPanel = []
  const panelGenesSet = new Set(
    panel.genes.map(gene => gene.name.toUpperCase()),
  )
  genesList.forEach(gene => {
    if (panelGenesSet.has(gene)) {
      genesInPanel.push(new Gene(gene))
    } else {
      genesNotInPanel.push(new Gene(gene))
    }
  })
  return {
    genesInPanel: genesInPanel,
    genesNotInPanel: genesNotInPanel,
  }
}

function findAllSymbols(parsedGenes) {
  const genesList = new Set();
  parsedGenes.symbolFoundGenes.forEach(parsedGene => {
    genesList.add(parsedGene.gene.name.toUpperCase());
  })

  parsedGenes.synonymFoundGenes.forEach(parsedGene => {
    genesList.add(parsedGene.realGene.symbol.toUpperCase());
  })

  return genesList;
}

//dispatch other listeners base on some properties like init
/**
 * eg. ParseInput.vue listens for the workder with this:
 * $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'findAllGenes') {
        this.formattedGenes = event.data.parsedGenes
      }
    }
 and posts a message to the workder with this
 $getFindGenesWorker().postMessage({
        init: false,
        todo: 'findAllGenes',
        userGenes: this.userGenes,
      })
 'findAllGenes' is a way to only process messages that the component
 cares about.
 ctx.postMessage needs to return a todo parameters with the same string
 that was sent in the todo argument from the component: 'findAllGenes'
 in this case
 */
addEventListener("message", (event) => {
  if (event.data.init) {
    allGeneMap = event.data.allGeneMap
    synonymMap = event.data.synonymMap
  } else if (event.data.todo == "findAllGenes") {
    const parsedGenes = findAllGenes(event.data.userGenes)
    ctx.postMessage({parsedGenes, todo: "findAllGenes"})
  } else if (event.data.todo == "findGenesInAllPanels") {
    const allSymbols = findAllSymbols(event.data.parsedGenes)
    const genesInAllPanels = findGenesInAllPanels(allSymbols, event.data.panels);
    ctx.postMessage({
      parsedGenes: event.data.parsedGenes,
      todo: "findGenesInAllPanels",
      genesInAllPanels: genesInAllPanels,
    })
  } else if (event.data.todo == "findPanelGenes") {
    const parsedGenes = findAllGenes(event.data.userGenes)
    ctx.postMessage({
      parsedGenes,
      todo: "findPanelGenes",
      panelName: event.data.panelName,
    })
  }
})

import {
  ParsedGene,
  ParsedGenes,
  Gene,
  PanelSearchResult,
  SynonymGene,
} from "@/types/panel-types"

import allGenesData from "@/assets/all_genes.json"
import synonymData from "@/assets/synonyms.json"
import { TableHeader, GeneState } from "@/types/ui-types"

const ctx = self
let allGeneMap = new Map()
let synonymMap = new Map()
allGenesData.forEach((gene) => {
  allGeneMap.set(gene.symbol, gene)
})
synonymData.forEach((synonym) => {
  synonymMap.set(synonym.synonym, synonym)
})

function cleanUserInput(userinput, validSeparators) {
  const genes = userinput.toUpperCase().split(validSeparators)
  const uniqGenes = Array.from(new Set(genes)) //remove duplicates
  const userGenesList = []
  for (const symbol of uniqGenes) {
    if (symbol && symbol != "") {
      userGenesList.push(new Gene(symbol))
    }
  }
  return userGenesList
}

function parseUserGenes(userGenes) {
  const parsedGenes = new ParsedGenes()
  for (let i = 0; i < userGenes.length; i++) {
    const userGene = userGenes[i]
    const parsedGene = applyState(userGene)
    if (parsedGene.state === GeneState.SYMBOL) {
      parsedGenes.symbolFoundGenes.push(parsedGene)
    } else if (parsedGene.state === GeneState.SYNONYM) {
      parsedGenes.synonymFoundGenes.push(parsedGene)
    } else if (parsedGene.state === GeneState.FUSION) {
      parsedGenes.fusionFoundGenes.push(parsedGene)
    } else if (parsedGene.state === GeneState.INTRON) {
      parsedGenes.intronFoundGenes.push(parsedGene)
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
    parsedGene.state = GeneState.SYMBOL
    return parsedGene
    // }
  } else if (synonymMap.has(userGene.name)) {
    //synonym
    var fullGene = synonymMap.get(userGene.name).gene
    parsedGene.state = GeneState.SYNONYM
    parsedGene.realGene = fullGene
    return parsedGene
  } else if (userGene.name.indexOf("_FUSION") > -1) {
    //fusion
    const fusionGene = userGene.name.split("_FUSION")[0]
    if (allGeneMap.has(fusionGene)) {
      parsedGene.state = GeneState.FUSION
      return parsedGene
    }
  } else if (userGene.name.indexOf("_INTRON") > -1) {
    //intron
    const intronGene = userGene.name.split("_INTRON")[0]
    if (allGeneMap.has(intronGene)) {
      parsedGene.state = GeneState.INTRON
      return parsedGene
    }
  }
  parsedGene.state = GeneState.NOT_FOUND
  return parsedGene
}

function findGenesInAllPanels(allMatches, panels, parsedGenes) {
  let result = []
  panels.forEach((panel) => {
    const genes = findGenesInSelectedPanel(allMatches, panel, parsedGenes)
    if (genes.genesInPanel.length > 0 || genes.genesNotInPanel.length > 0) {
      result.push(
        new PanelSearchResult(
          panel.name,
          genes.genesInPanel,
          genes.genesNotInPanel,
          genes.panelSymbolToSymbolMatch,
          genes.panelSynonymToSynonymMatch,
          genes.panelSymbolToSynonymMatch,
          genes.panelSynonymToSymbolMatch,
          genes.panelFusionToFusionMatch,
          genes.panelIntronToIntronMatch,
        ),
      )
    }
  })
  return result
}

function findGenesInSelectedPanel(allMatches, panel, parsedGenes) {
  const genesInPanel = []
  const genesNotInPanel = []
  const panelGenesSet = new Set(
    panel.genes.map((gene) => gene.name.toUpperCase()),
  )
  //keep track of which is symbol and which is synonym
  const panelSymbolToSymbolMatch = []
  const panelSynonymToSynonymMatch = []
  const panelSymbolToSynonymMatch = []
  const panelSynonymToSymbolMatch = []
  const panelFusionToFusionMatch = []
  const panelIntronToIntronMatch = []
  //
  allMatches.geneSet.forEach((gene) => {
    const geneObj = new Gene(gene)
    if (panelGenesSet.has(gene)) {
      genesInPanel.push(geneObj)
    } else {
      genesNotInPanel.push(geneObj)
    }
  })
  //look for symbols to symbol match and symbol to synonym match
  const symbolsInPanel = new Set(panel.symbolsOnly.map((g) => g.name))
  const synonymsInPanelArray = panel.synonymsOnly.map((g) => g.synonym)
  parsedGenes.symbolFoundGenes.forEach((parsedGene) => {
    if (symbolsInPanel.has(parsedGene.gene.name)) {
      panelSymbolToSymbolMatch.push(parsedGene.gene.name)
    }
    //user entered a symbol, look for synonyms in panel
    const possibleSynonyms = new Set(
      allGeneMap.get(parsedGene.gene.name).synonyms,
    )
    for (let i = 0; i < synonymsInPanelArray.length; i++) {
      const s = synonymsInPanelArray[i]
      if (possibleSynonyms.has(s)) {
        const synonym = new SynonymGene(s, parsedGene.gene.name)
        panelSymbolToSynonymMatch.push(synonym) // use the synonym name to display it in compare panels
        break
      }
    }
  })
  //look for synonyms to synonym match
  const synonymsInPanel = new Set(synonymsInPanelArray)
  parsedGenes.synonymFoundGenes.forEach((parsedGene) => {
    if (synonymsInPanel.has(parsedGene.gene.name)) {
      panelSynonymToSynonymMatch.push(parsedGene.gene.name)
    }
    //user entered a synonym, look for symbols in panel
    if (symbolsInPanel.has(parsedGene.realGene.symbol)) {
      const synonym = new SynonymGene(
        parsedGene.realGene.symbol,
        parsedGene.gene.name,
      )
      panelSynonymToSymbolMatch.push(synonym)
    }
  })
  //look for fusion to fusion match
  //need to separate the _FUSION part
  const fusionsInPanel = new Set(
    panel.fusionsOnly.map((g) => splitFusion(g.name)),
  )
  parsedGenes.fusionFoundGenes.forEach((parsedGene) => {
    if (fusionsInPanel.has(splitFusion(parsedGene.gene.name))) {
      panelFusionToFusionMatch.push(parsedGene.gene.name)
    }
  })
  //look for intron to intron match
  //need to separate the _INTRON part eb. _INTRON1 _INTRON2 etc.
  const intronsInPanel = new Set(
    panel.intronsOnly.map((g) => splitIntron(g.name)),
  )
  parsedGenes.intronFoundGenes.forEach((parsedGene) => {
    if (intronsInPanel.has(splitIntron(parsedGene.gene.name))) {
      panelIntronToIntronMatch.push(parsedGene.gene.name)
    }
  })
  return {
    genesInPanel,
    genesNotInPanel,
    panelSymbolToSymbolMatch,
    panelSynonymToSynonymMatch,
    panelSymbolToSynonymMatch,
    panelSynonymToSymbolMatch,
    panelFusionToFusionMatch,
    panelIntronToIntronMatch,
  }
}

function splitIntron(intron) {
  return intron.split("_INTRON")[0]
}

function splitFusion(fusion) {
  return fusion.split("_FUSION")[0]
}

function findAllMatches(parsedGenes) {
  const geneSet = new Set()
  const symbolSet = new Set()
  const synonymSet = new Set()
  const fusionSet = new Set()
  const intronSet = new Set()
  parsedGenes.symbolFoundGenes.forEach((parsedGene) => {
    const name = parsedGene.gene.name.toUpperCase()
    geneSet.add(name)
    symbolSet.add(name)
  })

  parsedGenes.synonymFoundGenes.forEach((parsedGene) => {
    const name = parsedGene.realGene.symbol.toUpperCase()
    geneSet.add(name)
    synonymSet.add(parsedGene.gene.name.toUpperCase())
  })

  parsedGenes.fusionFoundGenes.forEach((parsedGene) => {
    const name = parsedGene.gene.name.toUpperCase()
    geneSet.add(name)
    fusionSet.add(name)
  })

  parsedGenes.intronFoundGenes.forEach((parsedGene) => {
    const name = parsedGene.gene.name.toUpperCase()
    geneSet.add(name)
    intronSet.add(name)
  })

  return { geneSet, symbolSet, synonymSet, fusionSet, intronSet }
}

function buildCompareHeaders(payload) {
  const h = []
  payload.panelNames.forEach((p) => h.push(new TableHeader(p, true)))
  h.sort((a, b) => {
    const aUp = a.text.toUpperCase()
    const bUp = b.text.toUpperCase()
    if (aUp < bUp) {
      return -1
    }
    if (aUp > bUp) {
      return 1
    }
    return 0
  })
  h.splice(0, 0, {
    text: "Gene",
    value: "gene",
    visible: true,
  })
  return h
}

function formatCompareItems(payload) {
  const headers = buildCompareHeaders(payload)
  const panelSearchResultsMap = new Map()
  payload.panelSearchResults.forEach((p) =>
    panelSearchResultsMap.set(p.name, p),
  )
  const rows = []
  const allFound = payload.parsedGenes.symbolFoundGenes.concat(
    payload.parsedGenes.synonymFoundGenes,
    payload.parsedGenes.fusionFoundGenes,
    payload.parsedGenes.intronFoundGenes,
  )
  for (let g = 0; g < allFound.length; g++) {
    const row = {}
    row.geneId = allFound[g].gene.name
    const parsedGene = JSON.parse(JSON.stringify(allFound[g]))
    row.gene = parsedGene
    for (let h = 0; h < headers.length; h++) {
      const value = headers[h].value
      const parsedGeneForPanel = new ParsedGene(
        JSON.parse(JSON.stringify(allFound[g].gene)),
      )
      if (value !== "gene") {
        row[value] = parsedGeneForPanel
      }
      const panel = panelSearchResultsMap.get(value)
      if (!panel) {
        continue
      }
      let found = false
      if (panel.panelSymbolToSymbolMatch.length > 0) {
        const symbolSet = new Set(panel.panelSymbolToSymbolMatch)
        if (symbolSet.has(row.geneId)) {
          parsedGeneForPanel.state = GeneState.SYMBOL
          found = true
        }
      }
      if (panel.panelSynonymToSynonymMatch.length > 0) {
        const synonymSet = new Set(panel.panelSynonymToSynonymMatch)
        if (synonymSet.has(row.geneId)) {
          parsedGeneForPanel.state = GeneState.SYNONYM
          found = true
        }
      }
      if (panel.panelSymbolToSynonymMatch.length > 0) {
        for (let i = 0; i < panel.panelSymbolToSynonymMatch.length; i++) {
          const s = panel.panelSymbolToSynonymMatch[i]
          if (s.gene == row.geneId) {
            parsedGeneForPanel.state = GeneState.SYMBOL_TO_SYNONYM
            parsedGeneForPanel.gene.name = s.synonym
            parsedGeneForPanel.realGene = s.gene
            found = true
            break
          }
        }
      }
      if (panel.panelSynonymToSymbolMatch.length > 0) {
        for (let i = 0; i < panel.panelSynonymToSymbolMatch.length; i++) {
          const s = panel.panelSynonymToSymbolMatch[i]
          if (s.gene == row.geneId) {
            parsedGeneForPanel.state = GeneState.SYNONYM_TO_SYMBOL
            parsedGeneForPanel.gene.name = s.synonym
            parsedGeneForPanel.realGene = s.gene
            found = true
            break
          }
        }
      }
      if (panel.panelFusionToFusionMatch.length > 0) {
        const symbolSet = new Set(panel.panelFusionToFusionMatch)
        if (symbolSet.has(row.geneId)) {
          parsedGeneForPanel.state = GeneState.FUSION
          found = true
        }
      }
      if (panel.panelIntronToIntronMatch.length > 0) {
        const symbolSet = new Set(panel.panelIntronToIntronMatch)
        if (symbolSet.has(row.geneId)) {
          parsedGeneForPanel.state = GeneState.INTRON
          found = true
        }
      }
      if (!found) {
        parsedGeneForPanel.state = GeneState.NOT_FOUND
      }
    }
    rows.push(row)
  }
  return { items: rows, headers: headers }
}

//dispatch other listeners base on some properties like init
/**
 * eg. ParseInput.vue listens for the workder with this:
 * $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'parseUserGenes') {
        this.formattedGenes = event.data.parsedGenes
      }
    }
 and posts a message to the workder with this
 $getFindGenesWorker().postMessage({
        todo: 'parseUserGenes',
        userGenes: this.userGenes,
      })
 'parseUserGenes' is a way to only process messages that the component
 cares about.
 ctx.postMessage needs to return a todo parameters with the same string
 that was sent in the todo argument from the component: 'parseUserGenes'
 in this case
 */
addEventListener("message", (event) => {
  if (event.data.init) {
    // allGeneMap = event.data.allGeneMap
    // synonymMap = event.data.synonymMap
  } else if (event.data.todo == "cleanUserInput") {
    const userGeneList = cleanUserInput(
      event.data.payload.userinput,
      event.data.payload.validSeparators,
    )
    ctx.postMessage({ userGeneList, todo: "cleanUserInput" })
  } else if (event.data.todo == "parseUserGenes") {
    const parsedGenes = parseUserGenes(event.data.userGenes)
    ctx.postMessage({ parsedGenes, todo: "parseUserGenes" })
  } else if (event.data.todo == "findGenesInAllPanels") {
    const allMatches = findAllMatches(event.data.parsedGenes)
    const genesInAllPanels = findGenesInAllPanels(
      allMatches,
      event.data.panels,
      event.data.parsedGenes,
    )
    ctx.postMessage({
      todo: "findGenesInAllPanels",
      genesInAllPanels: genesInAllPanels,
    })
  } else if (event.data.todo == "findPanelGenes") {
    const parsedGenes = parseUserGenes(event.data.userGenes)
    ctx.postMessage({
      parsedGenes,
      todo: "findPanelGenes",
      panelName: event.data.panelName,
      panelFileName: event.data.panelFileName,
    })
  } else if (event.data.todo == "formatCompareItems") {
    const { items, headers } = formatCompareItems(event.data.payload)
    ctx.postMessage({
      items,
      headers,
      todo: "formatCompareItems",
    })
  }
})

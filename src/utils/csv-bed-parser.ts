import { Gene } from "@/types/panel-types"

export function getPanelGenes(allRows: string[], extension: string): Gene[] {
  const uniqueRows = parseCSV(allRows)
  const uniqueRowsArray = Array.from(uniqueRows)
  const panelGenes: Gene[] = []
  for (let j = 0; j < uniqueRowsArray.length; j++) {
    const geneSymbol = uniqueRowsArray[j]
    if (!geneSymbol || geneSymbol.length == 0 || geneSymbol == "SNP") {
      continue
    }
    panelGenes.push({
      name: geneSymbol.toUpperCase(),
    })
  }
  return panelGenes
}
export function parseCSV(allRows: string[]) {
  const uniqueRows = new Set<string>()
  for (let j = 1; j < allRows.length; j++) {
    //skip header row
    const row = allRows[j]
    if (!row || row.length == 0) {
      continue
    }
    const rowItems = row.split(",")
    if (rowItems && rowItems[0]) {
      uniqueRows.add(rowItems[0].trim())
    }
    uniqueRows.add(rowItems[0].trim())
  }
  return uniqueRows
}
export function parseBED(allRows: string[]) {
  const uniqueRows = new Set<string>()
  for (let j = 0; j < allRows.length; j++) {
    const row = allRows[j]
    if (!row || row.length == 0) {
      continue
    }
    const rowItems = row.split("\t")
    if (rowItems && rowItems[3]) {
      //GNB1:GNB1_chr1:1718769-1718876:275744_14961302_GNB1_chr1:1718769-1718876_1
      const gene = rowItems[3].split(":")[0]
      if (gene) {
        uniqueRows.add(gene.trim())
      }
    }
  }
  return uniqueRows
}

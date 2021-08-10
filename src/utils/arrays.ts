import { ListItem } from "@/types/ui-types"

export function listItemSorter(a: ListItem, b: ListItem) {
  const aString = a.item.name.toUpperCase()
  const bString = b.item.name.toUpperCase()
  if (aString < bString) {
    return -1
  }
  if (aString > bString) {
    return 1
  }
  return 0
}

/**
 * Transpose an array of arrays.
 * Handle uneven arrays (rowLength != columnsLength)
 * @param anArray the array to transpose
 * @returns the transposed array
 */
export function transpose(anArray: any[]): any[] {
  let maxRows = anArray[0].length //find which column is the longest
  for (let i = 1; i < anArray.length; i++) {
    const newMax = anArray[i].length
    if (newMax > maxRows) {
      maxRows = newMax
    }
  }
  const dupArray: any[] = JSON.parse(JSON.stringify(anArray))
  for (let a = 0; a < anArray.length; a++) {
    for (let j = 0; j < maxRows; j++) {
      if (!anArray[a][j]) {
        dupArray[a].push("")
      }
    }
  }
  //now array is a square matrix
  return dupArray[0].map((_: any, colIndex: number) =>
    dupArray.map((row) => row[colIndex]),
  )
}

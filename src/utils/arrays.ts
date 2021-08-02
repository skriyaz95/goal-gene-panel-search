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

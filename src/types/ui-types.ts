/**
 * Used in PanelCompare v-chip active state
 */
import { GenePanelDetails, Institution } from "@/types/panel-types"

export class ActiveState {
  active: boolean
  id: string

  constructor(id: string, active: boolean) {
    this.active = active
    this.id = id
  }
}

export class TableHeader {
  visible: boolean
  text: string
  value: string

  constructor(text: string, visible: boolean) {
    this.text = text
    this.visible = visible
    this.value = text
  }
}

export class LastSelection {
  pageTab: string
  tab: string
  item: number
  path: string

  constructor(page: string, tab: string, item: number) {
    this.pageTab = page + tab
    this.tab = tab
    this.item = item
    this.path = "/" + page + "/" + tab + "/" + item
  }
}

export class ListItem {
  item: Institution | GenePanelDetails
  valid: boolean

  constructor(item: Institution | GenePanelDetails, valid: boolean) {
    this.item = item
    this.valid = valid
  }
}

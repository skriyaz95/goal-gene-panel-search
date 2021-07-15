/**
 * Used in PanelCompare v-chip active state
 */
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

import { GeneState } from "@/types/ui-types"

export function formatStateColor(state: string | undefined) {
  if (
    state === GeneState.SYMBOL ||
    state === GeneState.FUSION ||
    state === GeneState.INTRON
  ) {
    return "success"
  }
  if (
    state === GeneState.SYNONYM ||
    state === GeneState.SYMBOL_TO_SYNONYM ||
    state === GeneState.SYNONYM_TO_SYMBOL
  ) {
    return "warning"
  }
  if (state === GeneState.NOT_FOUND) {
    return "blue-grey lighten-3"
  }
  return "error" //INVALID
}

export function formatStateIcon(state: string | undefined) {
  if (
    state === GeneState.SYMBOL ||
    state === GeneState.SYNONYM_TO_SYMBOL ||
    state === GeneState.FUSION ||
    state === GeneState.INTRON
  ) {
    return "mdi-check"
  }
  return "mdi-approximately-equal"
}

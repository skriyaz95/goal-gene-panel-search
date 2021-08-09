import { GeneState } from "@/types/ui-types"

export function formatStateColor(state: string) {
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
  return "error"
}

export function formatStateIcon(state: string) {
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

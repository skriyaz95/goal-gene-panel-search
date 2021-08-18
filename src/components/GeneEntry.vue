/**
A visual representation of a gene entry
Changes shape and color based on the entry type (synonym, symbol, fusion, etc.)
Components should maxime the use of this component to harmonize the display of genes
across the app
 */
<template>
  <v-chip
    :outlined="chipOutlined"
    :dark="isFusion"
    :class="[isFusion ? 'fusionBackground' : '', 'ma-1']"
    :color="formatColor"
    :label="formatShape"
    :gradient="['#f72047', '#ffd200', '#1feaea']"
  >
    <div class="d-flex align-center">
      <v-icon v-if="icon" left v-text="formatIcon"> </v-icon>
      {{ geneName }}
      <span v-if="synonym">
        <v-icon class="ml-1">mdi-arrow-right-bold</v-icon>
        {{ realGeneName }}
        <slot name="realGene"> </slot>
      </span>
    </div>
  </v-chip>
</template>

<script lang="ts">
import { FullGene, Gene, ParsedGene } from '@/types/panel-types'
import { GeneState } from '@/types/ui-types'
import {
  formatStateColor,
  formatStateIcon,
  formatStateShape,
} from '@/utils/formatting'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'GeneEntry',
  props: {
    parsedGene: {
      type: Object,
      default: () => new ParsedGene(new Gene(''), undefined, undefined),
    },
    icon: Boolean,
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
    synonym() {
      return (this.parsedGene as ParsedGene).state === GeneState.SYNONYM
    },
    formatShape() {
      return formatStateShape((this.parsedGene as ParsedGene).state)
    },
    geneName() {
      const gene = (this.parsedGene as ParsedGene).gene
        ? (this.parsedGene as ParsedGene).gene.name
        : (this.parsedGene as ParsedGene as any).name
      return gene
    },
    realGeneName() {
      const gene = (this.parsedGene as ParsedGene).realGene
        ? ((this.parsedGene as ParsedGene).realGene as FullGene).symbol
        : '?'
      return gene
    },
    formatColor() {
      return formatStateColor((this.parsedGene as ParsedGene).state)
    },
    formatIcon() {
      return formatStateIcon((this.parsedGene as ParsedGene).state)
    },
    isFusion() {
      return (this.parsedGene as ParsedGene).state === GeneState.FUSION
    },
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>


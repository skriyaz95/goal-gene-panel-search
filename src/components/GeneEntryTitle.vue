/**
A visual representation of a gene entry title
Changes shape and color based on the entry type (synonym, symbol, fusion, etc.)
Components should maxime the use of this component to harmonize the display of genes
across the app
 */
<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-chip
        :outlined="chipOutlined"
        v-on="on"
        :dark="isFusion"
        :class="[isFusion ? 'fusion-background' : '', 'ma-1']"
        :color="formatColor"
        :label="formatShape"
      >
        <div class="d-flex align-center">
          {{ title }} ({{ $tc('count.gene', $n(count)) }})
        </div>
      </v-chip>
    </template>
    <span>
      {{ tooltip }}
    </span>
  </v-tooltip>
</template>

<script lang="ts">
import { GeneState } from '@/types/ui-types'
import {
  formatStateColor,
  formatStateIcon,
  formatStateShape,
} from '@/utils/formatting'
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'GeneEntryTitle',
  props: {
    state: String,
    count: Number,
    tooltip: String,
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
    formatShape() {
      return formatStateShape(this.state)
    },
    title() {
      switch (this.state) {
        case GeneState.INVALID:
          return this.$t('parsedInput.invalid.text')
        case GeneState.SYNONYM:
          return this.$t('parsedInput.synonyms.text')
        case GeneState.SYMBOL:
          return this.$t('parsedInput.symbols.text')
        case GeneState.FUSION:
          return this.$t('parsedInput.fusions.text')
        case GeneState.INTRON:
          return this.$t('parsedInput.introns.text')
      }
      return ''
    },
    formatColor() {
      return formatStateColor(this.state)
    },
    formatIcon() {
      return formatStateIcon(this.state)
    },
    isFusion() {
      return this.state === GeneState.FUSION
    },
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>

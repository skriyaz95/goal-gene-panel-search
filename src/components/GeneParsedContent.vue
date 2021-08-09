/* eslint-disable vue/html-indent */
<template>
  <div>
    <parsed-list-item
      v-if="showGenes[0]"
      :color="notFoundColor"
      :items="parsedGenes.notFoundGenes"
      :title="$t('parsedInput.notFound.text')"
      class="pb-2"
      :showLargeSets="showLargeSets"
    />
    <parsed-list-item
      v-if="showGenes[1]"
      :color="synonymColor"
      :items="parsedGenes.synonymFoundGenes"
      :title="$t('parsedInput.synonyms.text')"
      :synonym="true"
      class="pb-2"
      :showLargeSets="showLargeSets"
    />
    <parsed-list-item
      v-if="showGenes[2]"
      :color="symbolColor"
      :items="parsedGenes.symbolFoundGenes"
      :title="$t('parsedInput.symbols.text')"
      :showLargeSets="showLargeSets"
    />
    <parsed-list-item
      v-if="showGenes[3]"
      :color="fusionColor"
      :items="parsedGenes.fusionFoundGenes"
      :title="$t('parsedInput.fusions.text')"
      :showLargeSets="showLargeSets"
    />
    <parsed-list-item
      v-if="showGenes[4]"
      :color="intronColor"
      :items="parsedGenes.intronFoundGenes"
      :title="$t('parsedInput.introns.text')"
      :showLargeSets="showLargeSets"
    />
  </div>
</template>

<script lang="ts">
import { ParsedGenes } from '@/types/panel-types'
import Vue from 'vue'
import ParsedListItem from '@/components/home/ParsedListItem.vue'
import { formatStateColor } from '@/utils/formatting'
import { GeneState } from '@/types/ui-types'

export default Vue.extend({
  name: 'GeneParseContent',
  components: { ParsedListItem },
  props: {
    showGenes: Array,
    parsedGenes: ParsedGenes,
    showLargeSets: Boolean,
  },
  data: () => ({}),
  methods: {},
  computed: {
    notFoundColor() {
      return formatStateColor(GeneState.NOT_FOUND)
    },
    symbolColor() {
      return formatStateColor(GeneState.SYMBOL)
    },
    synonymColor() {
      return formatStateColor(GeneState.SYNONYM)
    },
    fusionColor() {
      return formatStateColor(GeneState.FUSION)
    },
    intronColor() {
      return formatStateColor(GeneState.INTRON)
    },
  },
  mounted() {},
})
</script>

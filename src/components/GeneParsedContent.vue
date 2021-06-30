/* eslint-disable vue/html-indent */
<template>
  <div>
    <parsed-list-item
      v-if="showGenes[0]"
      color="error"
      :items="parsedGenes.notFoundGenes"
      :title="$t('parseInput.notFound.text')"
      class="pb-2"
    />
    <parsed-list-item
      v-if="showGenes[1]"
      color="warning"
      :items="parsedGenes.synonymFoundGenes"
      :title="$t('parseInput.synonyms.text')"
      :synonym="true"
      class="pb-2"
    />
    <parsed-list-item
      v-if="showGenes[2]"
      color="success"
      :items="parsedGenes.symbolFoundGenes"
      :title="$t('parseInput.symbols.text')"
    />
  </div>
</template>

<script lang="ts">
import { ParsedGenes } from '@/types/panel-types'
import Vue from 'vue'
import ParsedListItem from '@/components/home/ParsedListItem.vue'

export default Vue.extend({
  name: 'GeneParseContent',
  components: { ParsedListItem },
  props: {
    showGenes: Array,
    parsedGenes: ParsedGenes,
  },
  data: () => ({}),
  methods: {},
  computed: {},
  mounted() {},
})
</script>

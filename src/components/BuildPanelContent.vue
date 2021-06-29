/* eslint-disable vue/html-indent */
<template>
  <div>
    <parsed-list-item
      v-if="showGenes[0]"
      color="error"
      :items="panel[1].notFoundGenes"
      :title="$t('parseInput.notFound.text')"
      class="pb-2"
    />
    <parsed-list-item
      v-if="showGenes[1]"
      color="warning"
      :items="panel[1].synonymFoundGenes"
      :title="$t('parseInput.synonyms.text')"
      :synonym="true"
      class="pb-2"
    />
    <parsed-list-item
      v-if="showGenes[2]"
      color="success"
      :items="panel[1].symbolFoundGenes"
      :title="$t('parseInput.symbols.text')"
    />
  </div>
</template>

<script lang="ts">
import { ParsedGenes } from '@/types/panel-types'
import Vue from 'vue'
import ParsedListItem from '@/components/home/ParsedListItem.vue'

export default Vue.extend({
  name: 'BuildPanelContent',
  components: { ParsedListItem },
  props: {
    showGenes: () => [Boolean, Boolean, Boolean],
    panel: () => [String, ParsedGenes],
  },
  data: () => ({}),
  methods: {},
  computed: {},
  mounted() {},
})
</script>

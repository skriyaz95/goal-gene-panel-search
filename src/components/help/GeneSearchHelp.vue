/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div class="pb-2">
      <b>{{ $t('userInput.geneSearch') }}</b>
      <span v-if="simpleSearch">
        {{ $t('help.geneSearch.simple.part1a') }}
      </span>
      <span v-else>
        {{ $t('help.geneSearch.part1a') }}
        {{ $t('help.geneSearch.part1b') }}
      </span>
    </div>
    <div>
      {{ $t('help.geneSearch.part2a') }}
      {{ $t('help.geneSearch.part2b') }}
      <b>{{ $t('parsedInput.title.text') }}</b>
      {{ $t('help.geneSearch.part2c') }}
    </div>
    <div class="pt-2">{{ $t('help.geneSearch.part3') }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'GeneSearchHelp',
  props: {
    simpleSearch: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>

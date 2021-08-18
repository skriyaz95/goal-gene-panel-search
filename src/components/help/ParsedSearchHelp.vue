/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div class="pb-2">
      {{ $t('help.parsedInput.part1a') }}
      <b>{{ $t('userInput.gene-list') }}</b>
      {{ $t('help.parsedInput.part1b') }}
    </div>
    <div class="pb-2">{{ $t('help.parsedInput.part2') }}</div>
    <div class="pl-2">- {{ $t('parsedInput.invalid.tooltip') }}</div>
    <div class="pl-2">- {{ $t('parsedInput.synonyms.tooltip') }}</div>
    <div class="pl-2">- {{ $t('parsedInput.symbols.tooltip') }}</div>
    <div class="pl-2">- {{ $t('parsedInput.fusions.tooltip') }}</div>
    <div class="pl-2 pb-2">- {{ $t('parsedInput.introns.tooltip') }}</div>
    <div>
      {{ $t('help.parsedInput.part3a') }}
      <b>{{ $t('panel-result.result.name') }}</b>
      {{ $t('help.parsedInput.part3b') }}
      <b>{{ $t('parsedInput.invalid.text') }}</b>
      {{ $t('help.parsedInput.part3c') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ParsedSearchHelp',
  props: {},
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>

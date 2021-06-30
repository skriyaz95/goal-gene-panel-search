/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div class="pb-2">
      <b>{{ $t('panel-result.result.name') }}</b>
      {{ $t('help.panelResults.part1a') }}<br />
      {{ $t('help.panelResults.part1b') }}
      <b>{{ $t('parsedInput.title.text') }}</b>
    </div>
    <div>{{ $t('help.panelResults.part2a') }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PanelResultsHelp',
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>

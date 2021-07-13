/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div class="pb-2">
      <b>{{ $t('panelCompare.title.text') }}</b>
      {{ $t('help.panelCompare.part1a') }}
    </div>
    <div>{{ $t('help.panelCompare.part2') }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'PanelCompareHelp',
  props: {},
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    formatState(state: string) {
      if (state == 'symbol') {
        return 'success'
      }
      if (state == 'synonym') {
        return 'warning'
      }
      return 'error'
    },
  },
})
</script>

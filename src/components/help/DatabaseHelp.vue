/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div class="pb-2">
      {{ $t('help.database.purpose') }}
    </div>
    <div class="pb-2">{{ $t('help.database.howTo.part1') }}</div>
    <div>{{ $t('help.database.howTo.part2') }}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DatabaseHelp',
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>

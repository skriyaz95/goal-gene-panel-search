/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div>
      {{ $t('help.institutionExplore.purpose') }}
    </div>
    <div class="pt-2" v-if="editable">
      {{ $t('help.institutionExplore.edit') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'InstitutionExploreHelp',
  props: {
    editable: { type: Boolean, default: false },
  },
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>

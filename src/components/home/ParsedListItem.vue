<template>
  <div>
    <div>{{ title }}:</div>
    <div v-if="showChips()">
      <v-chip
        v-for="gene in items"
        :key="gene.gene.name"
        class="ma-1"
        :color="color"
      >
        {{ gene.gene.name }}
      </v-chip>
    </div>
    <div v-else>
      {{ $t('parseInput.tooMany.text') }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ParsedListItem',
  props: {
    color: String,
    items: Array,
    title: String,
  },
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    showChips() {
      return this.items.length < 1000
    },
  },
})
</script>

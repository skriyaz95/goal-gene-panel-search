<template>
  <div class="text-left">
    <span class="body-1 font-weight-bold">{{ title }}:</span>
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
    <span v-else>
      {{ $t('parseInput.tooMany.text') }}
    </span>
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
      return this.items.length < 500
    },
  },
})
</script>

<template>
  <div class="text-left">
    <span class="body-1 font-weight-bold">{{ title }}:</span>
    <div v-if="showChips()">
      <div class="pl-2" v-if="synonym">
        <div v-html="$t('parseInput.synonyms.details')"></div>
        {{ $t('parseInput.synonyms.examplePart1') }}
        {{ items[0].gene.name }}
        {{ $t('parseInput.synonyms.examplePart2') }}
        {{ items[0].realGene.symbol }}
      </div>
      <v-chip
        v-for="gene in items"
        :key="gene.gene.name"
        class="ma-1"
        :color="color"
      >
        <div class="d-flex align-center">
          {{ gene.gene.name }}
          <span v-if="synonym">
            <v-icon class="ml-1">mdi-arrow-right-bold</v-icon>
            {{ gene.realGene.symbol }}
          </span>
        </div>
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
    synonym: Boolean,
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

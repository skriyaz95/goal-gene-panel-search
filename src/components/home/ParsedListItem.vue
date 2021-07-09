<template>
  <div class="text-left">
    <span class="body-1 font-weight-bold">
      {{ title }}:
      <v-tooltip bottom v-if="!hidable">
        <template v-slot:activator="{ on }">
          <v-btn @click="visible = !visible" icon v-on="on">
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('button.showHide.tooltip') }}</span>
      </v-tooltip>
    </span>
    <v-fade-transition>
      <div v-if="showChips()">
        <div class="pl-2" v-if="synonym">
          <div v-html="$t('parsedInput.synonyms.details')"></div>
          {{ $t('parsedInput.synonyms.examplePart1') }}
          {{ items[0].gene.name }}
          {{ $t('parsedInput.synonyms.examplePart2') }}
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
        <span v-if="visible">
          {{ $t('parsedInput.tooMany.text') }}
        </span>
      </span>
    </v-fade-transition>
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
    hidable: Boolean,
    showLargeSets: Boolean,
  },
  data: () => ({
    visible: true,
  }),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    showChips() {
      return (this.showLargeSets || this.items.length < 500) && this.visible
    },
  },
})
</script>

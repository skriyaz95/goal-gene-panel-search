/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div class="pb-2">
      <b>{{ $t('panelResult.dialog.title') }}</b>
      {{ $t('help.panelResult.part1a') }}
      <b>{{ $t('parsedInput.title.text') }}</b>
      {{ $t('help.panelResult.part1b') }}
    </div>
    <div class="pb-2">
      {{ $t('help.panelResult.part2') }}
    </div>
    <div>{{ $t('help.panelCompare.example') }}:</div>
    <v-simple-table light>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('panelResult.table.headers.gene.header') }}
            </th>
            <th class="text-left">
              {{ $t('panelResult.table.headers.explanation.text') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>
              <gene-entry
                :icon="false"
                :parsedGene="item.geneSearch"
              ></gene-entry>
            </td>
            <td>
              {{ $t('panelResult.table.headers.gene.text') }}

              {{ item.explain1 }} {{ item.explain2 }}
              <b>{{ parsedSearch }}</b>
              {{ item.explain3 }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GeneState } from '@/types/ui-types'
import { FullGene, Gene, ParsedGene } from '@/types/panel-types'

export default Vue.extend({
  name: 'PanelResultsDialogHelp',
  props: {},
  data: () => ({}),
  computed: {
    items() {
      const it = []
      it.push({
        geneSearch: new ParsedGene(new Gene('TP53'), GeneState.SYMBOL),
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      it.push({
        geneSearch: new ParsedGene(
          new Gene('BRAF1'),
          GeneState.SYNONYM,
          new FullGene('BRAF', '', [], '', '')
        ),
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.synonymInput'),
      })
      it.push({
        geneSearch: new ParsedGene(new Gene('ALK_FUSION'), GeneState.FUSION),
        explain1: this.$t('help.panelResult.part3.anyMatch'),
        explain2: this.$t('help.panelResult.part3.fusionMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      it.push({
        geneSearch: new ParsedGene(new Gene('BCL6_INTRON1'), GeneState.INTRON),
        explain1: this.$t('help.panelResult.part3.anyMatch'),
        explain2: this.$t('help.panelResult.part3.intronMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      it.push({
        geneSearch: new ParsedGene(new Gene('ABL1'), GeneState.NOT_FOUND),
        explain1: '',
        explain2: this.$t('help.panelCompare.part3.noMatch'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      return it
    },
    parsedSearch() {
      return this.$t('parsedInput.title.text')
    },
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    showChip(item: ParsedGene) {
      return item.state !== GeneState.NOT_FOUND
    },
  },
})
</script>

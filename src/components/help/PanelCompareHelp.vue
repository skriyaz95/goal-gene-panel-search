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
      <b>{{ $t('parsedInput.title.text') }}</b>
      {{ $t('help.panelCompare.part1b') }}
    </div>
    <div class="pb-2">
      {{ $t('help.panelCompare.part2') }}
    </div>
    <div>{{ $t('help.panelCompare.example') }}:</div>
    <v-simple-table light>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('panelCompare.table.headers.gene.text') }}
            </th>
            <th class="text-left">
              {{ $t('panelCompare.table.headers.panel.text') }}
            </th>
            <th class="text-left">
              {{ $t('panelCompare.table.headers.explanation.text') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>
              <gene-entry icon :parsedGene="item.geneSearch"></gene-entry>
            </td>
            <td>
              <gene-entry
                icon
                :parsedGene="item.panelGene"
                v-if="showChip(item.panelGene)"
              ></gene-entry>
            </td>
            <td>
              {{ $t('panelCompare.table.headers.panel.text') }}

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
  name: 'PanelCompareHelp',
  props: {},
  data: () => ({}),
  computed: {
    items() {
      const it = []
      it.push({
        geneSearch: new ParsedGene(new Gene('TP53'), GeneState.SYMBOL),
        panelGene: new ParsedGene(new Gene('TP53'), GeneState.SYMBOL),
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      it.push({
        geneSearch: new ParsedGene(new Gene('TENT5C'), GeneState.SYMBOL),
        panelGene: new ParsedGene(
          new Gene('FAM46C'),
          GeneState.SYMBOL_TO_SYNONYM
        ),
        explain1: this.$t('help.panelCompare.part3.anyMatch'),
        explain2: this.$t('help.panelCompare.part3.synonymMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      it.push({
        geneSearch: new ParsedGene(
          new Gene('BRAF1'),
          GeneState.SYNONYM,
          new FullGene('BRAF', '', [], '', '')
        ),
        panelGene: new ParsedGene(
          new Gene('BRAF'),
          GeneState.SYNONYM_TO_SYMBOL
        ),
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.synonyminput'),
      })
      it.push({
        geneSearch: new ParsedGene(
          new Gene('KRAS1'),
          GeneState.SYNONYM,
          new FullGene('KRAS', '', [], '', '')
        ),
        panelGene: new ParsedGene(
          new Gene('KRAS2'),
          GeneState.SYNONYM,
          new FullGene('KRAS', '', [], '', '')
        ),
        explain1: this.$t('help.panelCompare.part3.anyMatch'),
        explain2: this.$t('help.panelCompare.part3.synonymMatching'),
        explain3: this.$t('help.panelCompare.part3.synonyminput'),
      })
      it.push({
        gene: new Gene('BRCA1'),
        panel: '',
        geneSearch: new ParsedGene(new Gene('BRCA1'), GeneState.SYMBOL),
        panelGene: new ParsedGene(new Gene('BRCA1'), GeneState.NOT_FOUND),
        explain1: this.$t('help.panelCompare.part3.noMatch'),
        explain2: '',
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

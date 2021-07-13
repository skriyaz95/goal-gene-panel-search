<template>
  <div>
    <v-card outlined>
      <v-card-title>
        {{ $t('panelCompare.title.text') }}
        <v-spacer></v-spacer>
        <help-button @action="handleHelp()" :active="help">
          <template v-slot:content>
            <span>
              {{ $t('button.showHide.tooltip') }}
              {{ $t('button.help.text') }}
            </span>
          </template>
        </help-button>
      </v-card-title>
      <v-card-text>
        <info-alert :active="help">
          <template v-slot:content>
            <panel-compare-help />
          </template>
        </info-alert>
        <v-data-table
          :headers="headers"
          :items="items"
          item-key="geneId"
          sort-by="gene"
        >
          <template v-if="items.length > 0" v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.geneId">
                <td v-for="header in headers" :key="header.value">
                  <v-chip
                    v-if="showChip(item, header)"
                    :color="formatState(item, header)"
                  >
                    <div class="d-flex align-center">
                      {{ geneName(item, header) }}
                    </div>
                  </v-chip>
                  <!-- <span v-else-if="header.value === 'gene'">
                    {{ item.gene }}
                  </span> -->
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import {
  GenePanelDetails,
  PanelCompareRow,
  PanelSearchResult,
  ParsedGene,
  ParsedGenes,
  SynonymGene,
} from '@/types/panel-types'
import PanelCompareHelp from '@/components/help/PanelCompareHelp.vue'

export default Vue.extend({
  components: {
    HelpButton,
    InfoAlert,
    PanelCompareHelp,
  },
  name: 'PanelCompare',
  props: {
    help: {
      type: Boolean,
      default: false,
    },
    parsedGenes: {
      type: ParsedGenes,
    },
    panelSearchResults: {
      type: Array,
      default: () => new Array<PanelSearchResult>(),
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      panels: 'getPanelsSorted',
    }),
    items(): Array<PanelCompareRow> {
      //TODO move formatting to a worker
      const rows = new Array<PanelCompareRow>()
      const allFound = this.parsedGenes.symbolFoundGenes.concat(
        this.parsedGenes.synonymFoundGenes
      )
      for (let g = 0; g < allFound.length; g++) {
        const row: any = {}
        row.geneId = allFound[g].gene.name
        const parsedGene = JSON.parse(JSON.stringify(allFound[g]))
        row.gene = parsedGene
        for (let h = 0; h < this.headers.length; h++) {
          const value = this.headers[h].value
          const parsedGeneForPanel = new ParsedGene(
            JSON.parse(JSON.stringify(allFound[g].gene))
          )
          if (value !== 'gene') {
            row[value] = parsedGeneForPanel
          }
          const panel = this.panelSearchResultsMap.get(value)
          if (!panel) {
            continue
          }
          let found = false
          if (panel.panelSymbolToSymbolMatch.length > 0) {
            const symbolSet = new Set(panel.panelSymbolToSymbolMatch)
            if (symbolSet.has(row.geneId)) {
              parsedGeneForPanel.state = 'symbol'
              found = true
            }
          }
          if (panel.panelSynonymToSynonymMatch.length > 0) {
            const synonymSet = new Set(panel.panelSynonymToSynonymMatch)
            if (synonymSet.has(row.geneId)) {
              parsedGeneForPanel.state = 'synonym'
              found = true
            }
          }
          if (panel.panelSymbolToSynonymMatch.length > 0) {
            for (let i = 0; i < panel.panelSymbolToSynonymMatch.length; i++) {
              const s: SynonymGene = panel.panelSymbolToSynonymMatch[i]
              if (s.gene == row.geneId) {
                parsedGeneForPanel.state = 'symbolToSynonym'
                parsedGeneForPanel.gene.name = s.synonym
                parsedGeneForPanel.realGene = s.gene
                found = true
                break
              }
            }
          }
          if (panel.panelSynonymToSymbolMatch.length > 0) {
            for (let i = 0; i < panel.panelSynonymToSymbolMatch.length; i++) {
              const s: SynonymGene = panel.panelSynonymToSymbolMatch[i]
              if (s.gene == row.geneId) {
                parsedGeneForPanel.state = 'synonymToSymbol'
                parsedGeneForPanel.gene.name = s.synonym
                parsedGeneForPanel.realGene = s.gene
                found = true
                break
              }
            }
          }
          if (!found) {
            parsedGeneForPanel.state = 'notFound'
          }
        }
        rows.push(row)
      }
      return rows
    },
    panelNames(): [] {
      return this.panels.map((p: GenePanelDetails) => p.name)
    },
    headers(): any[] {
      const h = [
        {
          text: this.$t('panelCompare.table.headers.gene.text'),
          value: 'gene',
        },
      ]
      this.panelNames.forEach((p: string) =>
        h.push({
          text: p,
          value: p,
        })
      )
      return h
    },
    panelSearchResultsMap(): Map<string, PanelSearchResult> {
      const byName = new Map<string, PanelSearchResult>()
      this.panelSearchResults.forEach((p) =>
        byName.set((p as PanelSearchResult).name, p as PanelSearchResult)
      )
      return byName
    },
  },
  watch: {},
  methods: {
    handleHelp() {
      this.$emit('help')
    },
    geneName(item: any, header: any) {
      return item[header.value].gene.name
    },
    showChip(item: any, header: any) {
      const label: string = header.value
      // console.log(item[label])
      return item[label] && item[label].state !== 'notFound'
    },
    formatState(item: any, header: any) {
      const label: string = header.value
      if (item[label].state === 'symbol') {
        return 'success'
      }
      if (
        item[label].state === 'synonym' ||
        item[label].state === 'symbolToSynonym' ||
        item[label].state === 'synonymToSymbol'
      ) {
        return 'warning'
      }
      return 'error'
    },
  },
})
</script>

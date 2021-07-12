<template>
  <div>
    <v-card outlined>
      <v-card-title>
        {{ $t('panelCompare.title.text') }}
        <v-spacer></v-spacer>
        <help-button @action="handleHelp()" :active="help">
          <template v-slot:content>
            <panel-results-help />
          </template>
        </help-button>
      </v-card-title>
      <v-card-text>
        <info-alert :active="help">
          <template v-slot:content>
            <panel-results-help />
          </template>
        </info-alert>
        <v-data-table
          :headers="headers"
          :items="items"
          item-key="gene"
          sort-by="gene"
        >
          <template v-if="items.length > 0" v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.gene">
                <td v-for="header in headers" :key="header.value">
                  <v-chip v-if="showChip(item, header)">
                    <div class="d-flex align-center">
                      {{ geneName(item, header) }}
                      <span v-if="item[header.value].state === 'synonym'">
                        <v-icon class="ml-1">mdi-arrow-right-bold</v-icon>
                        {{ item[header.value].realGene.symbol }}
                      </span>
                    </div>
                  </v-chip>
                  <span v-else-if="header.value === 'gene'">
                    {{ item.gene }}
                  </span>
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
  FullGene,
  GenePanelDetails,
  PanelCompareRow,
  PanelSearchResult,
  ParsedGene,
  ParsedGenes,
  // ParsedGene,
} from '@/types/panel-types'
import PanelResultsHelp from '@/components/help/PanelResultsHelp.vue'

export default Vue.extend({
  components: {
    HelpButton,
    InfoAlert,
    PanelResultsHelp,
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
      const rows = new Array<PanelCompareRow>()
      const allFound = this.parsedGenes.symbolFoundGenes.concat(
        this.parsedGenes.synonymFoundGenes
      )
      for (let g = 0; g < allFound.length; g++) {
        const row: any = {}
        row.gene = allFound[g].gene.name
        for (let h = 0; h < this.headers.length; h++) {
          const value = this.headers[h].value
          if (value === 'gene') {
            continue
          }
          const panel = this.panelSearchResultsMap.get(value)
          if (panel && panel.genesInPanel) {
            const parsedGene = new ParsedGene(allFound[g].gene)
            row[value] = parsedGene
            const symbolSet = new Set(
              panel.panelSymbols.map((gene) => gene.name.toUpperCase())
            )
            if (symbolSet.has(row.gene)) {
              parsedGene.state = 'symbol'
              continue
            }
            const synonymSet = new Set(
              panel.panelSynonyms.map((gene) => gene.name.toUpperCase())
            )
            const realGene: FullGene | undefined = allFound[g].realGene
            if (realGene && synonymSet.has(realGene.symbol)) {
              parsedGene.state = 'synonym'
              parsedGene.realGene = allFound[g].realGene
              continue
            }
            parsedGene.state = 'notFound'
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
      return label != 'gene' && item[label] && item[label].state != 'notFound'
    },
  },
})
</script>

<template>
  <div>
    <v-card outlined>
      <v-card-title>
        {{ $t('panelCompare.title.text') }}
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :disabled="!items || items.length == 0"
              icon
              @click="downloadComparePanels"
            >
              <v-icon>mdi-download </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('button.download.tooltip') }}</span>
        </v-tooltip>
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
        <v-card outlined class="darker-border">
          <v-card-title>
            {{ $t('panelCompare.table.tools.text') }}:
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <span class="body-1">
                  {{ $t('panelCompare.table.institutions.text') }}:
                </span>
                <v-chip
                  class="ma-1"
                  filter
                  v-for="(institution, index) in visibleInstitutions"
                  :key="index"
                  active-class="primary lighten-1"
                  :input-value="institution.active"
                  @click="toggleInstitution(institution)"
                >
                  {{ institution.id }}
                </v-chip>
              </v-col>
            </v-row>
            <v-text-field
              v-model="search"
              :label="$t('panelCompare.table.search.text')"
              clearable
              prepend-icon="mdi-magnify"
            >
            </v-text-field>
          </v-card-text>
        </v-card>
        <resizable-page>
          <template v-slot:table="tableProps">
            <v-data-table
              :height="tableProps.tableHeight"
              :headers="filteredHeaders"
              :items="items"
              item-key="geneId"
              sort-by="gene"
              :custom-sort="customSort"
              :custom-filter="customFilter"
              :search="search"
              fixed-header
              class="fixed-column"
            >
              <template v-if="items.length > 0" v-slot:body="{ items }">
                <tbody>
                  <tr v-for="item in items" :key="item.geneId">
                    <td v-for="header in filteredHeaders" :key="header.value">
                      <template v-if="getMatches(item, header).length > 1">
                        <v-expansion-panels
                          flat
                          class="dense transparent"
                          accordion
                        >
                          <v-expansion-panel class="transparent">
                            <v-expansion-panel-header class="transparent">
                              {{
                                $tc(
                                  'count.gene',
                                  $n(getMatches(item, header).length)
                                )
                              }}
                            </v-expansion-panel-header>
                            <v-expansion-panel-content class="transparent">
                              <template
                                v-for="(match, index) in getMatches(
                                  item,
                                  header
                                )"
                              >
                                <gene-entry
                                  v-if="showChip(match)"
                                  :key="index"
                                  :parsedGene="match"
                                  icon
                                >
                                </gene-entry>
                              </template>
                            </v-expansion-panel-content>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </template>
                      <template v-else>
                        <template
                          v-for="(match, index) in getMatches(item, header)"
                        >
                          <gene-entry
                            v-if="showChip(match)"
                            :key="index"
                            :parsedGene="match"
                            icon
                          ></gene-entry>
                        </template>
                      </template>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-data-table>
          </template>
        </resizable-page>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import PanelCompareHelp from '@/components/help/PanelCompareHelp.vue'
import { ActiveState, GeneState, TableHeader } from '@/types/ui-types'
import download from '@/utils/download'
import Papa from 'papaparse'
import { Gene, ParsedGene } from '@/types/panel-types'
// import { transpose } from '@/utils/arrays'
import ResizablePage from '@/components/ResizablePage.vue'

export default Vue.extend({
  components: {
    HelpButton,
    InfoAlert,
    PanelCompareHelp,
    ResizablePage,
  },
  name: 'PanelCompare',
  props: {
    help: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    visibleInstitutions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      validSeparators: /[ ,;\s]+/,
      search: '',
    }
  },
  computed: {
    filteredHeaders(): Array<TableHeader> {
      const fHeaders = new Array<TableHeader>()
      for (let i = 0; i < this.headers.length; i++) {
        const header = this.headers[i] as TableHeader
        if (header.visible) {
          fHeaders.push(header)
        }
      }
      return fHeaders
    },
  },
  watch: {},
  methods: {
    handleHelp() {
      this.$emit('help')
    },
    showChip(match: ParsedGene) {
      return match && match.state !== GeneState.NOT_FOUND
    },
    getMatches(item: any, header: any): ParsedGene[] {
      const label: string = header.value
      return item[label] as ParsedGene[]
    },
    customSort(items: any[], sortBy: string[], sortDesc: boolean[]): any[] {
      items.sort((a: any, b: any) => {
        if (!sortBy[0]) {
          return 0
        }
        const aItem = a[sortBy[0]][0].gene.name
        const bItem = b[sortBy[0]][0].gene.name
        const desc = sortDesc[0]
        if (aItem > bItem) {
          return desc ? 1 : -1
        }
        if (aItem < bItem) {
          return desc ? -1 : 1
        }
        return 0
      })
      return items
    },
    customFilter(value: any, search: string | null): boolean {
      if (value && search) {
        const searchItems = search.split(this.validSeparators)
        const cellValue = value.gene.name.toUpperCase()
        for (let i = 0; i < searchItems.length; i++) {
          const searchItem = searchItems[i].toUpperCase()
          if (cellValue.indexOf(searchItem) > -1) {
            return true
          }
        }
        return false
      }
      return true
    },
    toggleInstitution(institution: ActiveState) {
      this.$emit('toggleInstitution', institution)
    },
    downloadComparePanels() {
      //use filteredHeaders to remove geneId and hidden columns
      const csvHeaders = this.filteredHeaders.map((h) => h.text).slice()
      csvHeaders.splice(1, 0, 'HGNC')
      const filteredHeaderValues = this.filteredHeaders
        .map((h) => h.value)
        .slice()
      filteredHeaderValues.splice(1, 0, 'HGNC')
      const csvItems = []
      for (let j = 0; j < this.items.length; j++) {
        const row = []
        for (let i = 0; i < filteredHeaderValues.length; i++) {
          const h = filteredHeaderValues[i]
          let result = null
          if (h === 'HGNC') {
            //use Gene Search to output HGNC symbol value in 2nd column
            const firstCol = this.filteredHeaders[0].value
            const currentParsedGene = (this.items as any)[j][firstCol][0]
            result = [new ParsedGene(currentParsedGene.gene)]
            result[0].state = GeneState.SYMBOL
            if (
              currentParsedGene.state === GeneState.SYNONYM ||
              currentParsedGene.state === GeneState.FUSION ||
              currentParsedGene.state === GeneState.INTRON
            ) {
              result[0].gene = new Gene(currentParsedGene.realGene.symbol)
            }
          } else {
            result = (this.items as any)[j][h]
          }
          //skip invalid results
          if (result && result.length > 0) {
            const genes: string[] = []
            result.forEach((r: ParsedGene) => {
              if (r && r.state === GeneState.NOT_FOUND) {
                genes.push('')
              } else {
                const geneName = r.gene.name
                genes.push(geneName)
              }
            })
            row.push(genes.join(' '))
          }
        }
        csvItems.push(row)
      }
      const csv = Papa.unparse({
        fields: csvHeaders,
        data: csvItems,
      })
      download('compare_panels.csv', csv, 'text/csv')
    },
    resize() {
      const elt: any = this.$refs.resizablePage
      if (elt !== undefined) {
        elt.onResize()
      }
    },
  },
  mounted() {},
})
</script>

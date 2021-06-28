/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card outlined>
          <v-card-text>
            <div class="mb-1 mt-1">
              {{ $t('buildPanels.existingPanels.text') }}
            </div>
            <v-chip
              v-for="panel in panels"
              :key="panel.name"
              text-color="black"
              class="ma-2 secondary"
            >
              {{ panel.name }} ({{ $tc('count.gene', $n(panel.genes.length)) }})
            </v-chip>
            <div class="mb-1 mt-1">
              {{ $t('buildPanels.rawPanels.text') }}
            </div>
            <v-chip
              v-for="panelName in panelFileNames"
              :key="panelName"
              class="ma-2 primary"
            >
              {{ panelName }}
            </v-chip>
          </v-card-text>
          <v-card-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="primary" v-on="on" @click="buildPanels">
                  {{ $t('button.buildPanels.text') }}
                </v-btn>
              </template>
              <span>{{ $t('button.buildPanels.tooltip') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="primary ml-2"
                  :disabled="isEmptyPanels()"
                  v-on="on"
                  @click="downloadAllPanels"
                >
                  {{ $t('button.saveAllPanels.text') }}
                </v-btn>
              </template>
              <span>{{ $t('button.saveAllPanels.tooltip') }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card outlined class="mb-2">
          <v-card-text>
            <span v-html="$t('buildPanels.help.text')" />
          </v-card-text>
        </v-card>
        <v-card v-if="tempParsedGenes.length > 0" outlined>
          <v-expansion-panels flat focusable>
            <v-expansion-panel v-for="panel in tempParsedGenes" :key="panel[0]">
              <v-expansion-panel-header disable-icon-rotate>
                <v-row align="center">
                  <v-col cols="6" lg="3">
                    <v-text-field
                      v-model="panel[0]"
                      :label="$t('buildPanels.panelName.text')"
                      hide-details
                      dense
                      @click.stop=""
                    />
                  </v-col>
                  <v-col cols="6" lg="9">
                    <v-fade-transition>
                      <span class="ml-3">
                        <v-tooltip
                          bottom
                          v-if="showGenes(panel[1].notFoundGenes)"
                        >
                          <template v-slot:activator="{ on }">
                            <v-chip color="error" class="ml-1 mr-1" v-on="on">
                              <v-icon left> mdi-alert-circle-outline </v-icon>
                              ({{
                                $tc(
                                  'count.gene',
                                  $n(panel[1].notFoundGenes.length)
                                )
                              }})
                            </v-chip>
                          </template>
                          <span>{{ $t('parseInput.notFound.tooltip') }}</span>
                        </v-tooltip>
                        <v-tooltip
                          bottom
                          v-if="showGenes(panel[1].synonymFoundGenes)"
                        >
                          <template v-slot:activator="{ on }">
                            <v-chip color="warning" class="ml-1 mr-1" v-on="on">
                              <v-icon left> mdi-approximately-equal </v-icon>
                              ({{
                                $tc(
                                  'count.gene',
                                  $n(panel[1].synonymFoundGenes.length)
                                )
                              }})
                            </v-chip>
                          </template>
                          <span>{{ $t('parseInput.synonyms.tooltip') }}</span>
                        </v-tooltip>
                        <v-tooltip
                          bottom
                          v-if="showGenes(panel[1].symbolFoundGenes)"
                        >
                          <template v-slot:activator="{ on }">
                            <v-chip color="success" class="ml-1 mr-1" v-on="on">
                              <v-icon left> mdi-check </v-icon>
                              ({{
                                $tc(
                                  'count.gene',
                                  $n(panel[1].symbolFoundGenes.length)
                                )
                              }})
                            </v-chip>
                          </template>
                          <span>{{ $t('parseInput.symbols.tooltip') }}</span>
                        </v-tooltip>
                      </span>
                    </v-fade-transition>
                  </v-col>
                </v-row>

                <template v-slot:actions>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <span v-on="on">
                        <v-btn
                          icon
                          @click.stop="downloadPanel(panel)"
                          :disabled="!onlySymbolsOrSynonyms(panel[1])"
                        >
                          <v-icon>mdi-content-save</v-icon>
                        </v-btn>
                      </span>
                    </template>
                    <span v-if="onlySymbolsOrSynonyms(panel[1])">{{
                      $t('button.saveOnePanel.tooltip')
                    }}</span>
                    <span v-else>{{
                      $t('button.cannotSaveOnePanel.tooltip')
                    }}</span>
                  </v-tooltip>
                  <v-icon> mdi-chevron-down </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-fade-transition>
                  <div>
                    <parsed-list-item
                      v-if="showGenes(panel[1].notFoundGenes)"
                      color="error"
                      :items="panel[1].notFoundGenes"
                      :title="$t('parseInput.notFound.text')"
                    />
                    <parsed-list-item
                      v-if="showGenes(panel[1].synonymFoundGenes)"
                      color="warning"
                      :items="panel[1].synonymFoundGenes"
                      :title="$t('parseInput.synonyms.text')"
                      :synonym="true"
                    />
                    <parsed-list-item
                      v-if="showGenes(panel[1].symbolFoundGenes)"
                      color="success"
                      :items="panel[1].symbolFoundGenes"
                      :title="$t('parseInput.symbols.text')"
                    />
                  </div>
                </v-fade-transition>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { Gene, GenePanel, ParsedGene, ParsedGenes } from '@/types/panel-types'
import download from '@/utils/download'
import { formatObjetToJson } from '@/utils/download'
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import ParsedListItem from '@/components/home/ParsedListItem.vue'

export default Vue.extend({
  components: { ParsedListItem },
  name: 'BuildPanel',

  data: () => ({
    rawDir: 'raw_panels/',
    sourceDir: 'source_panels/',
    panelFileNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
    tempParsedGenes: new Array<[string, ParsedGenes]>(),
    tempPanels: new Array<GenePanel>(),
  }),
  methods: {
    buildPanels() {
      this.tempPanels = new Array<GenePanel>()
      for (var i = 0; i < this.panelFileNames.length; i++) {
        var path = this.publicPath + this.rawDir + this.panelFileNames[i]
        axios
          .get(path, {
            params: {},
          })
          .then((response) => {
            const responseURLItems = response.request.responseURL.split('/')
            const panelFileName = responseURLItems[responseURLItems.length - 1]
            const extension = /\.csv$/.test(panelFileName) ? '.csv' : '.bed'
            const panelName = panelFileName.replace(extension, '')
            const allRows = response.data.split(/\r?\n|\r/)
            //remove dups
            const uniqueRows =
              extension == '.csv'
                ? this.parseCSV(allRows)
                : this.parseBED(allRows)
            const uniqueRowsArray = Array.from(uniqueRows)
            const panelGenes: Gene[] = []
            for (let j = 0; j < uniqueRowsArray.length; j++) {
              const geneSymbol = uniqueRowsArray[j]
              if (!geneSymbol || geneSymbol.length == 0) {
                continue
              }
              panelGenes.push({
                name: geneSymbol.toUpperCase(),
              })
            }
            this.formatGenes(panelGenes, panelName)
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    parseCSV(allRows: string[]) {
      const uniqueRows = new Set<string>()
      for (let j = 1; j < allRows.length; j++) {
        //skip header row
        const row = allRows[j]
        if (!row || row.length == 0) {
          continue
        }
        const rowItems = row.split(',')
        if (rowItems && rowItems[0]) {
          uniqueRows.add(rowItems[0].trim())
        }
        uniqueRows.add(rowItems[0].trim())
      }
      return uniqueRows
    },
    parseBED(allRows: string[]) {
      const uniqueRows = new Set<string>()
      for (let j = 0; j < allRows.length; j++) {
        const row = allRows[j]
        if (!row || row.length == 0) {
          continue
        }
        const rowItems = row.split('\t')
        if (rowItems && rowItems[3]) {
          uniqueRows.add(rowItems[3].trim())
        }
      }
      return uniqueRows
    },
    formatGenes(panelGenes: Gene[], panelName: String) {
      $getFindGenesWorker().postMessage({
        init: false,
        todo: 'findPanelGenes',
        userGenes: panelGenes,
        panelName: panelName,
      })
    },
    formatPanel(panel: GenePanel, pretty: boolean) {
      return formatObjetToJson(panel, pretty)
    },
    downloadPanel(panel: [string, ParsedGenes]) {
      const genes = panel[1].symbolFoundGenes.map((pg) => pg.gene)
      genes.push(
        ...panel[1].synonymFoundGenes.map((pg) => new Gene(pg.realGene.symbol))
      )
      const content = this.formatPanel(new GenePanel(panel[0], genes), false)
      const filename = panel[0].replaceAll(/[ ]+/g, '_') + '.json'
      download(filename, content, 'text/json')
    },
    downloadAllPanels() {
      for (var i = 0; i < this.tempParsedGenes.length; i++) {
        if (this.onlySymbolsOrSynonyms(this.tempParsedGenes[i][1])) {
          this.downloadPanel(this.tempParsedGenes[i])
        }
      }
    },
    isEmptyPanels() {
      return !this.tempParsedGenes || this.tempParsedGenes.length == 0
    },
    listPanelFiles(r: any) {
      this.panelFileNames = []
      r.keys().forEach((key: any) => this.panelFileNames.push(key))
    },
    showGenes(genes: Array<ParsedGene>): boolean {
      // console.log(genes)
      // return true
      return genes.length > 0
    },
    onlySymbols(parsedGenes: ParsedGenes) {
      return (
        parsedGenes.notFoundGenes.length == 0 &&
        parsedGenes.synonymFoundGenes.length == 0
      )
    },
    onlySymbolsOrSynonyms(parsedGenes: ParsedGenes) {
      return parsedGenes.notFoundGenes.length == 0
    },
  },
  computed: {
    ...mapGetters({
      panels: 'getPanels',
    }),
  },
  mounted() {
    this.listPanelFiles(
      require.context('../../public/raw_panels/', false, /\.csv$|\.bed$/)
    )
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'findPanelGenes') {
        this.tempParsedGenes.push([
          event.data.panelName,
          event.data.parsedGenes,
        ])
      }
    }
  },
})
</script>

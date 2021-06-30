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
            <v-expansion-panel
              v-for="panelBuilder in tempParsedGenes"
              :key="panelBuilder.panelName"
            >
              <v-expansion-panel-header disable-icon-rotate>
                <build-panel-header
                  :parsed-genes="panelBuilder.parsedGenes"
                  :panel-name="panelBuilder.panelName"
                  :show-not-found="
                    showGenes(panelBuilder.parsedGenes.notFoundGenes)
                  "
                  :show-synonym="
                    showGenes(panelBuilder.parsedGenes.synonymFoundGenes)
                  "
                  :show-symbol="
                    showGenes(panelBuilder.parsedGenes.symbolFoundGenes)
                  "
                  @update-panel-name="updatePanelName($event, panelBuilder)"
                />

                <template v-slot:actions>
                  <v-row align="center" justify="end">
                    <v-col class="flex-grow-1 flex-shrink-0">
                      <v-autocomplete
                        full-width
                        dense
                        hide-details
                        :items="institutionItems"
                        v-model="panelBuilder.institutionName"
                        :label="$t('buildPanels.selectInstitution.text')"
                        @click.native.stop
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col class="flex-grow-0 flex-shrink-1">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <span v-on="on">
                            <v-btn icon @click.stop="downloadPanel(panel)">
                              <v-icon>mdi-content-save</v-icon>
                            </v-btn>
                          </span>
                        </template>
                        <span
                          v-if="onlySymbolsOrSynonyms(panelBuilder.parsedGenes)"
                        >
                          {{ $t('button.saveOnePanel.tooltip') }}
                        </span>
                        <span v-else>{{
                          $t('button.saveWarning.tooltip')
                        }}</span>
                      </v-tooltip>
                    </v-col>
                    <v-col class="flex-grow-0 flex-shrink-1">
                      <v-icon> mdi-chevron-down </v-icon>
                    </v-col>
                  </v-row>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-fade-transition>
                  <gene-parsed-content
                    :show-genes="[
                      showGenes(panelBuilder.parsedGenes.notFoundGenes),
                      showGenes(panelBuilder.parsedGenes.synonymFoundGenes),
                      showGenes(panelBuilder.parsedGenes.symbolFoundGenes),
                    ]"
                    :parsed-genes="panelBuilder.parsedGenes"
                  />
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
import {
  Gene,
  GenePanel,
  Institution,
  PanelBuilder,
  ParsedGene,
  ParsedGenes,
} from '@/types/panel-types'
import download from '@/utils/download'
import { formatObjetToJson } from '@/utils/download'
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import BuildPanelHeader from '@/components/BuildPanelHeader.vue'
import GeneParsedContent from '@/components/GeneParsedContent.vue'

export default Vue.extend({
  components: { BuildPanelHeader, GeneParsedContent },
  name: 'BuildPanel',

  data: () => ({
    rawDir: 'raw_panels/',
    sourceDir: 'source_panels/',
    panelFileNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
    tempParsedGenes: new Array<PanelBuilder>(),
  }),
  methods: {
    buildPanels() {
      this.tempParsedGenes = new Array<PanelBuilder>()
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
              if (
                !geneSymbol ||
                geneSymbol.length == 0 ||
                geneSymbol == 'SNP'
              ) {
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
          //GNB1:GNB1_chr1:1718769-1718876:275744_14961302_GNB1_chr1:1718769-1718876_1
          const gene = rowItems[3].split(':')[0]
          if (gene) {
            uniqueRows.add(gene.trim())
          }
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
    downloadPanel(panelBuilder: PanelBuilder) {
      //make sure there are no dups after adding synonyms
      const uniqGenes = new Set<string>(
        panelBuilder.parsedGenes.symbolFoundGenes.map((pg) => pg.gene.name)
      )
      const synonymsConverted = panelBuilder.parsedGenes.synonymFoundGenes.map(
        (pg) => pg.realGene.symbol
      )
      synonymsConverted.forEach((s) => uniqGenes.add(s))

      const genes = Array.from(uniqGenes).map((s) => new Gene(s))
      const content = this.formatPanel(
        new GenePanel(panelBuilder.panelName, genes),
        false
      )
      const filename = panelBuilder.panelName.replaceAll(/[ ]+/g, '_') + '.json'
      download(filename, content, 'text/json')
    },
    downloadAllPanels() {
      for (var i = 0; i < this.tempParsedGenes.length; i++) {
        this.downloadPanel(this.tempParsedGenes[i])
      }
      this.downloadInstitutions()
    },
    downloadInstitutions() {
      const institutionMapCopy = new Map<string, Institution>()
      this.institutionsByName.forEach((value: Institution, key: string) => {
        const newInstitution = new Institution(
          value.name,
          value.phone,
          value.email,
          value.website,
          []
        )
        institutionMapCopy.set(key, newInstitution)
      })
      for (var i = 0; i < this.tempParsedGenes.length; i++) {
        const name = this.tempParsedGenes[i].institutionName
        const institution: Institution | undefined =
          institutionMapCopy.get(name)
        if (institution) {
          institution.panels.push(this.tempParsedGenes[i].panelName)
        }
      }
      const newInstitutions = Array.from(institutionMapCopy.values())
      download(
        'institutions.json',
        formatObjetToJson(newInstitutions, false),
        'text/json'
      )
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
    updatePanelName(newValue: string, panelBuilder: PanelBuilder) {
      panelBuilder.panelName = newValue
    },
  },
  computed: {
    ...mapGetters({
      panels: 'getPanels',
      institutionMap: 'getInstitutionMap',
      institutionItems: 'getInstitutionDropDownItems',
      institutionsByName: 'getInstitutionsByName',
    }),
  },
  mounted() {
    this.listPanelFiles(
      require.context('../../public/raw_panels/', false, /\.csv$|\.bed$/)
    )
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'findPanelGenes') {
        const parsedGenes = new ParsedGenes()
        parsedGenes.notFoundGenes = event.data.parsedGenes.notFoundGenes
        parsedGenes.synonymFoundGenes = event.data.parsedGenes.synonymFoundGenes
        parsedGenes.symbolFoundGenes = event.data.parsedGenes.symbolFoundGenes
        const panelBuilder = new PanelBuilder()
        ;(panelBuilder.panelName = event.data.panelName),
          (panelBuilder.parsedGenes = parsedGenes)
        this.tempParsedGenes.push(panelBuilder)
      }
    }
  },
})
</script>

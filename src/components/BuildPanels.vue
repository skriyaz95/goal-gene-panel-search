/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card outlined>
          <v-card-title>
            {{ $t('buildPanels.existingPanels.text') }}
          </v-card-title>
          <v-card-text>
            <v-chip
              :outlined="chipOutlined"
              v-for="panel in panels"
              :key="panel.name"
              text-color="black"
              class="ma-2 secondary"
            >
              {{ panel.name }} ({{ $tc('count.gene', $n(panel.genes.length)) }})
            </v-chip>
          </v-card-text>
          <v-card-title>
            {{ $t('buildPanels.rawPanels.text') }}
          </v-card-title>

          <v-card-text>
            <v-chip
              :outlined="chipOutlined"
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
                <v-btn
                  class="primary"
                  v-on="on"
                  @click="buildPanels"
                  :disabled="loading"
                >
                  {{ $t('button.buildPanels.text') }}
                </v-btn>
              </template>
              <span>{{ $t('button.buildPanels.tooltip') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="primary ml-2"
                  :disabled="isEmptyPanels() || loading"
                  v-on="on"
                  @click="downloadAllPanels"
                >
                  {{ $t('button.saveAllPanels.text') }}
                </v-btn>
              </template>
              <span>{{ $t('button.saveAllPanels.tooltip') }}</span>
            </v-tooltip>
            <v-progress-linear
              class="ml-2"
              v-model="progress"
              :active="loading"
            >
            </v-progress-linear>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card :outlined="chipOutlined" class="mb-2">
          <v-card-text>
            <span v-html="$t('buildPanels.help.text')" />
          </v-card-text>
        </v-card>
        <v-card v-if="tempParsedGenes.length > 0" :outlined="chipOutlined">
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
                  <!-- //removed from now
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
                  </v-row> -->
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
                    <span v-else>{{ $t('button.saveWarning.tooltip') }}</span>
                  </v-tooltip>
                  <v-icon> mdi-chevron-down </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="pa-2">
                  {{ $t('buildPanels.sourceFile.text') }}:
                  {{ panelBuilder.panelFileName }}
                </div>
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
import { mapGetters, mapActions } from 'vuex'
import {
  FullGene,
  Gene,
  GenePanelDetails,
  // Institution,
  PanelBuilder,
  ParsedGene,
  ParsedGenes,
} from '@/types/panel-types'
import download, { formatObjetToJson } from '@/utils/download'
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
    started: false,
    progress: 0,
  }),
  methods: {
    ...mapActions(['updatePanels']),
    buildPanels() {
      this.started = true
      this.progress = 0
      this.tempParsedGenes = new Array<PanelBuilder>()
      for (var i = 0; i < this.panelFileNames.length; i++) {
        var path = this.publicPath + this.rawDir + this.panelFileNames[i]
        axios
          .get(path, {
            params: {},
          })
          .then((response) => {
            this.started = false
            this.progress += 100 / this.panelFileNames.length
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
            this.formatGenes(panelGenes, panelName, panelFileName)
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
    formatGenes(panelGenes: Gene[], panelName: String, panelFileName: string) {
      $getFindGenesWorker().postMessage({
        init: false,
        todo: 'findPanelGenes',
        userGenes: panelGenes,
        panelName: panelName,
        panelFileName: panelFileName,
      })
    },
    formatPanel(panel: GenePanelDetails, pretty: boolean) {
      return formatObjetToJson(panel, pretty)
    },
    downloadPanel(genePanel: GenePanelDetails) {
      const content = this.formatPanel(genePanel, false)
      const filename = genePanel.name.replaceAll(/[ ]+/g, '_') + '.json'
      download(filename, content, 'text/json')
    },
    downloadPanelsAsOne(genePanelsToSave: GenePanelDetails[]) {
      const content = formatObjetToJson(genePanelsToSave, false)
      const filename = 'panels.json'
      download(filename, content, 'text/json')
    },
    buildGenePanelObject(panelBuilder: PanelBuilder): GenePanelDetails {
      //make sure there are no dups after adding synonyms
      const uniqGenes = new Set<string>(
        panelBuilder.parsedGenes.symbolFoundGenes.map((pg) => pg.gene.name)
      )
      const synonymsConverted = panelBuilder.parsedGenes.synonymFoundGenes.map(
        (pg) =>
          pg.realGene === undefined ? '' : (pg.realGene as FullGene).symbol
      )
      synonymsConverted.forEach((s) => uniqGenes.add(s))

      const genes = Array.from(uniqGenes).map((s) => new Gene(s))
      const genePanel = new GenePanelDetails(
        panelBuilder.panelName,
        genes,
        panelBuilder.parsedGenes,
        panelBuilder.panelFileName
      )
      return genePanel
    },
    downloadAllPanels() {
      const genePanelsToSave = new Array<GenePanelDetails>()
      for (var i = 0; i < this.tempParsedGenes.length; i++) {
        const genePanel = this.buildGenePanelObject(this.tempParsedGenes[i])
        genePanelsToSave.push(genePanel)
        // this.downloadPanel(genePanel)
      }
      this.updatePanels(genePanelsToSave)
      this.downloadPanelsAsOne(genePanelsToSave)
      //removed from now
      // this.downloadInstitutions()
    },
    //removed from now
    // downloadInstitutions() {
    //   const institutionsByPanelCopy = new Map<string, Institution>()
    //   this.institutionsByName.forEach((value: Institution, key: string) => {
    //     const newInstitution = new Institution(
    //       value.name,
    //       value.phone,
    //       value.email,
    //       value.website,
    //       []
    //     )
    //     institutionsByPanelCopy.set(key, newInstitution)
    //   })
    //   for (var i = 0; i < this.tempParsedGenes.length; i++) {
    //     const name = this.tempParsedGenes[i].institutionName
    //     const institution: Institution | undefined =
    //       institutionsByPanelCopy.get(name)
    //     if (institution) {
    //       institution.panels.push(this.tempParsedGenes[i].panelName)
    //     }
    //   }
    //   const newInstitutions = Array.from(institutionsByPanelCopy.values())
    //   download(
    //     'institutions.json',
    //     formatObjetToJson(newInstitutions, false),
    //     'text/json'
    //   )
    // },
    isEmptyPanels() {
      return !this.tempParsedGenes || this.tempParsedGenes.length == 0
    },
    listPanelFiles(r: any) {
      this.panelFileNames = []
      r.keys().forEach((key: any) => this.panelFileNames.push(key))
    },
    showGenes(genes: Array<ParsedGene>): boolean {
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
      chipOutlined: 'getChipOutlined',
      //removed from now
      // institutionsByPanel: 'getInstitutionsByPanel',
      // institutionItems: 'getInstitutionDropDownItems',
      // institutionsByName: 'getInstitutionsByName',
    }),
    loading(): boolean {
      return (
        this.started ||
        (this.tempParsedGenes.length > 0 &&
          this.tempParsedGenes.length != this.panelFileNames.length)
      )
    },
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
          (panelBuilder.parsedGenes = parsedGenes),
          (panelBuilder.panelFileName = event.data.panelFileName)
        this.tempParsedGenes.push(panelBuilder)
      }
    }
  },
})
</script>

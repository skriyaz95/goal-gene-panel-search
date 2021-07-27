/* eslint-disable vue/html-indent */
<template>
  <div>
    <main-content-template inner>
      <template v-slot:left-col>
        <list-template
          :value="value"
          @input="handleInput($event)"
          @change="handleChange($event)"
          :itemsSorted="tempPanelSorted"
          :editable="editable"
          @delete="deletePanel($event)"
          dropDownLabel="buildPanels.selectPanel.text"
        >
          <template v-slot:title>
            {{ $t('explore.panels.list.text') }}:
          </template>
          <template v-slot:info>
            <info-alert :active="info">
              <template v-slot:content>
                <div class="pb-2">
                  {{ $t('buildPanels.info.part1') }}
                </div>
                <div>
                  {{ $t('buildPanels.info.part2') }}
                </div>
              </template>
            </info-alert>
          </template>
          <template v-slot:actions v-if="editable">
            <v-file-input
              v-model="panelFile"
              accept=".bed,.csv"
              :label="$t('buildPanels.new.tooltip')"
              prepend-icon="mdi-paperclip"
              @change="handleFileUpload"
              :error-messages="errorMessage"
            />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="primary ml-2"
                  :disabled="!validPanels()"
                  v-on="on"
                  @click="saveAll()"
                >
                  {{ $t('buildPanels.saveAll.text') }}
                </v-btn>
              </template>
              <span> {{ $t('buildPanels.saveAll.tooltip') }}</span>
            </v-tooltip>
          </template>
        </list-template>
      </template>
      <template v-slot:right-col>
        <v-card outlined class="mb-2">
          <v-card-text>
            <panel-details
              :panel="getCurrentPanel()"
              :institution="currentInstitution"
              :editable="editable"
              @name-changed="updateTempPanels"
              :show-read-only-panels="showReadOnlyPanels"
            />
          </v-card-text>
          <v-card-actions v-if="editable" class="px-4">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn color="error" v-on="on" @click="deletePanel()">
                  {{ $t('buildInstitutions.delete.text') }}
                  <v-spacer></v-spacer>
                  <v-icon right>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buildInstitutions.delete.tooltip') }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </template>
    </main-content-template>
  </div>
</template>

<script lang="ts">
import {
  FullGene,
  Gene,
  GenePanelDetails,
  PanelBuilder,
  ParsedGenes,
} from '@/types/panel-types'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import PanelDetails from '@/components/explore/PanelDetails.vue'
import download, { formatObjetToJson } from '@/utils/download'
import ListTemplate from '@/components/explore/ListTemplate.vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import InfoAlert from '@/components/help/InfoAlert.vue'

export default Vue.extend({
  components: { PanelDetails, ListTemplate, MainContentTemplate, InfoAlert },
  name: 'BuildExplorePanels',
  props: {
    editable: Boolean,
    showReadOnlyPanels: Boolean,
    value: { type: String, default: '0' },
  },
  data: () => ({
    previousIndex: 0, //to prevent undefined error when clicking on the same panel twice
    tempPanelSorted: new Array<GenePanelDetails>(),
    currentInstitution: 'test',
    panelFile: null,
    info: false,
    errorMessage: '',
  }),
  methods: {
    ...mapActions(['updatePanels']),
    handleFileUpload() {
      this.errorMessage = ''
      if (!this.panelFile) {
        return
      }
      var fr = new FileReader()
      // verify that panel doesn't already exist
      const fileName = (this.panelFile as any).name
      if (this.fileAlreadyExists(fileName)) {
        this.errorMessage = this.$t('buildPanels.duplicate.text') as string
        return
      }
      fr.readAsText(this.panelFile as any)
      fr.onload = () => {
        this.parseContent(fileName, fr.result as string)
      }
    },
    fileAlreadyExists(fileName: string) {
      return (
        this.tempPanelSorted
          .map((panel: GenePanelDetails) => panel.sourceFile)
          .indexOf(fileName) > -1
      )
    },
    validPanels() {
      //TODO validate form
      return true
    },
    saveAll() {
      this.info = true
      this.updatePanels(this.tempPanelSorted)
      download(
        'panels.json',
        formatObjetToJson(this.tempPanelSorted, false),
        'text/json'
      )
    },
    getCurrentPanel(): GenePanelDetails | null {
      const currentPanel = this.tempPanelSorted[Number.parseInt(this.value)]
      this.currentInstitution = this.getInstitutionfromPanel(currentPanel)
      return currentPanel
    },
    updateTempPanelsFromStore() {
      this.tempPanelSorted = JSON.parse(JSON.stringify(this.panels))
    },
    updateTempPanels(name: string) {
      this.tempPanelSorted.sort(this.sortPanelsByName)
      for (let i = 0; i < this.tempPanelSorted.length; i++) {
        if (this.tempPanelSorted[i].name === name) {
          this.$emit('update', i)
          break
        }
      }
      this.info = true
    },
    deletePanel(index: number) {
      if (index != null) {
        this.tempPanelSorted.splice(index, 1)
      } else {
        this.tempPanelSorted.splice(Number.parseInt(this.value), 1)
      }
      this.info = true
    },
    sortPanelsByName(a: GenePanelDetails, b: GenePanelDetails) {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    },
    handleChange($event: any) {
      this.$emit('change', $event)
    },
    handleInput($event: any) {
      this.$emit('input', $event)
    },
    getInstitutionfromPanel(panel: GenePanelDetails) {
      if (this.institutions && panel && panel.name) {
        for (let i = 0; i < this.institutions.length; i++) {
          if (
            this.institutions[i].panels &&
            this.institutions[i].panels.indexOf(panel.name) > -1
          ) {
            return this.institutions[i].name
          }
        }
      }
      return ''
    },
    formatGenes(panelGenes: Gene[], panelName: String, panelFileName: string) {
      $getFindGenesWorker().postMessage({
        todo: 'findPanelGenes',
        userGenes: panelGenes,
        panelName: panelName,
        panelFileName: panelFileName,
      })
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
    parseContent(fileName: string, content: string) {
      const extension = /\.csv$/.test(fileName) ? '.csv' : '.bed'
      const panelName = fileName.replace(extension, '')
      const allRows = content.split(/\r?\n|\r/)
      const rowItems = allRows[0].split('\t')
      if (extension == '.csv') {
        if (rowItems.length < 1) {
          alert(this.$t('buildPanels.validation.csv-file-not-valid'))
          return
        }
      } else {
        if (rowItems.length < 4) {
          alert(this.$t('buildPanels.validation.bed-file-not-valid'))
          return
        }
      }
      const panelBuilder = new PanelBuilder()
      panelBuilder.panelName = panelName
      panelBuilder.panelFileName = fileName
      const genes = this.getPanelGenes(allRows, extension)
      this.formatGenes(
        genes,
        panelBuilder.panelName,
        panelBuilder.panelFileName
      )
    },
    getPanelGenes(allRows: string[], extension: string): Gene[] {
      const uniqueRows =
        extension == '.csv' ? this.parseCSV(allRows) : this.parseBED(allRows)
      const uniqueRowsArray = Array.from(uniqueRows)
      const panelGenes: Gene[] = []
      for (let j = 0; j < uniqueRowsArray.length; j++) {
        const geneSymbol = uniqueRowsArray[j]
        if (!geneSymbol || geneSymbol.length == 0 || geneSymbol == 'SNP') {
          continue
        }
        panelGenes.push({
          name: geneSymbol.toUpperCase(),
        })
      }
      return panelGenes
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
  },
  computed: {
    ...mapGetters({
      panels: 'getPanels',
      lastItem: 'getLastItemExplore',
      institutions: 'getInstitutions',
    }),
  },
  mounted() {
    this.updateTempPanelsFromStore()
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
        const panel = this.buildGenePanelObject(panelBuilder)
        this.tempPanelSorted.push(panel)
        this.updateTempPanels(panel.name)
        this.panelFile = null
        this.info = true
      }
    }
  },
})
</script>

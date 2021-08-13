/* eslint-disable vue/html-indent */
<template>
  <div>
    <main-content-template inner>
      <template v-slot:left-col>
        <list-template
          :itemsSorted="tempPanelSorted"
          :editable="editable"
          @delete="deletePanel($event)"
          dropDownLabel="buildPanels.selectPanel.text"
          icon="mdi-dna"
        >
          <template v-slot:title>
            {{ $t('explore.panels.list.text') }}:
            <v-spacer></v-spacer>
            <help-button @action="handleHelp()" :active="help">
              <template v-slot:content>
                <span>
                  {{ $t('button.showHide.tooltip') }}
                  {{ $t('button.help.text') }}
                </span>
              </template>
            </help-button>
          </template>
          <template v-slot:info>
            <info-alert :active="help">
              <template v-slot:content>
                <panel-explore-help :editable="editable" />
              </template>
            </info-alert>
            <info-alert v-if="editable" :active="info || help">
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
                  <v-icon right>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span> {{ $t('buildPanels.saveAll.tooltip') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="warning ml-2" v-on="on" @click="resetAll()">
                  {{ $t('buildPanels.resetAll.text') }}
                  <v-icon right>mdi-reload</v-icon>
                </v-btn>
              </template>
              <span>
                {{ $t('buildPanels.resetAll.tooltip.part1') }}<br />
                {{ $t('buildPanels.resetAll.tooltip.part2') }}</span
              >
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
import HelpButton from '@/components/help/HelpButton.vue'
import PanelExploreHelp from '../help/PanelExploreHelp.vue'
import { ListItem } from '@/types/ui-types'
import { listItemSorter } from '@/utils/arrays'
import { getPanelGenes } from '@/utils/csv-bed-parser'

export default Vue.extend({
  components: {
    PanelDetails,
    ListTemplate,
    MainContentTemplate,
    InfoAlert,
    PanelExploreHelp,
    HelpButton,
  },
  name: 'BuildExplorePanels',
  props: {
    editable: Boolean,
    showReadOnlyPanels: Boolean,
  },
  data: () => ({
    previousIndex: 0, //to prevent undefined error when clicking on the same panel twice
    tempPanelSorted: new Array<ListItem>(),
    currentInstitution: 'test',
    panelFile: null,
    info: false,
    errorMessage: '',
    help: false,
  }),
  methods: {
    ...mapActions(['updatePanels', 'resetPanels']),
    handleHelp() {
      this.$emit('help')
      this.help = !this.help
    },
    handleFileUpload() {
      this.errorMessage = ''
      if (!this.panelFile) {
        return
      }
      var fr = new FileReader()
      // verify that panel doesn't already exist
      const fileName = (this.panelFile as any).name
      if (!fileName.match(/.(csv|bed)$/i)) {
        this.errorMessage = this.$t(
          'buildPanels.validation.accepted-files'
        ) as string
        return
      }
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
          .map((panel: ListItem) => (panel.item as GenePanelDetails).sourceFile)
          .indexOf(fileName) > -1
      )
    },
    validPanels() {
      //TODO validate form
      return true
    },
    saveAll() {
      this.info = true
      const panels = this.tempPanelSorted.map(
        (listItem: ListItem) => listItem.item
      )
      //temp fix for old panels
      for (let i = 0; i < panels.length; i++) {
        const panel = panels[i] as GenePanelDetails
        if (!panel.fusionsOnly) {
          panel.fusionsOnly = []
        }
        if (!panel.intronsOnly) {
          panel.intronsOnly = []
        }
      }
      this.updatePanels(panels)
      download('panels.json', formatObjetToJson(panels, false), 'text/json')
    },
    getCurrentPanel(): ListItem | null {
      const currentPanel = this.tempPanelSorted[this.item]
      this.currentInstitution = this.getInstitutionfromPanel(currentPanel)
      return currentPanel
    },
    updateTempPanelsFromStore() {
      this.tempPanelSorted = JSON.parse(JSON.stringify(this.panels)).map(
        (panel: GenePanelDetails) => new ListItem(panel, true)
      )
      this.tempPanelSorted.sort(listItemSorter)
    },
    updateTempPanels(name: string) {
      this.tempPanelSorted.sort(listItemSorter)
      for (let i = 0; i < this.tempPanelSorted.length; i++) {
        if ((this.tempPanelSorted[i].item as GenePanelDetails).name === name) {
          const item = i.toString()
          if (item !== this.$route.params.item) {
            this.$router.replace({ params: { ...this.$route.params, item } })
          }
          break
        }
      }
      this.info = true
    },
    deletePanel(index: number) {
      if (index != null) {
        this.tempPanelSorted.splice(index, 1)
      } else {
        this.tempPanelSorted.splice(this.item, 1)
      }
      this.info = true
    },
    getInstitutionfromPanel(panel: ListItem) {
      if (
        this.institutions &&
        panel &&
        panel.item &&
        (panel.item as GenePanelDetails).name
      ) {
        for (let i = 0; i < this.institutions.length; i++) {
          if (
            this.institutions[i].panels &&
            this.institutions[i].panels.indexOf(
              (panel.item as GenePanelDetails).name
            ) > -1
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
          this.errorMessage = this.$t(
            'buildPanels.validation.csv-file-not-valid'
          ) as string
          return
        }
      } else {
        if (rowItems.length < 4) {
          this.errorMessage = this.$t(
            'buildPanels.validation.bed-file-not-valid'
          ) as string
          return
        }
      }
      const panelBuilder = new PanelBuilder()
      panelBuilder.panelName = panelName
      panelBuilder.panelFileName = fileName
      const genes = getPanelGenes(allRows, extension)
      this.formatGenes(
        genes,
        panelBuilder.panelName,
        panelBuilder.panelFileName
      )
    },
    resetAll() {
      this.resetPanels().then(() => {
        this.updateTempPanelsFromStore()
      })
    },
  },
  computed: {
    ...mapGetters({
      panels: 'getPanels',
      institutions: 'getInstitutions',
    }),
    item(): number {
      return Number.parseInt(this.$route.params.item)
    },
  },
  mounted() {
    this.updateTempPanelsFromStore()
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'findPanelGenes') {
        const parsedGenes = new ParsedGenes()
        parsedGenes.notFoundGenes = event.data.parsedGenes.notFoundGenes
        parsedGenes.synonymFoundGenes = event.data.parsedGenes.synonymFoundGenes
        parsedGenes.symbolFoundGenes = event.data.parsedGenes.symbolFoundGenes
        parsedGenes.fusionFoundGenes = event.data.parsedGenes.fusionFoundGenes
        parsedGenes.intronFoundGenes = event.data.parsedGenes.intronFoundGenes
        const panelBuilder = new PanelBuilder()
        ;(panelBuilder.panelName = event.data.panelName),
          (panelBuilder.parsedGenes = parsedGenes),
          (panelBuilder.panelFileName = event.data.panelFileName)
        const panel = this.buildGenePanelObject(panelBuilder)
        this.tempPanelSorted.push(new ListItem(panel, true))
        this.updateTempPanels(panel.name)
        this.panelFile = null
        this.info = true
      }
    }
  },
})
</script>

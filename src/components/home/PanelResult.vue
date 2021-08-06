<template>
  <div>
    <dialog-template
      max-width="800px"
      v-model="institutionDialog"
      @closing="institutionDialog = false"
    >
      <template v-slot:title>
        {{ $t('panel-result.dialog.title-institution-details') }}
      </template>
      <template v-slot:content>
        <institution-details :institution="currentInstitution" />
      </template>
    </dialog-template>
    <dialog-template
      max-width="800px"
      v-model="showDialog"
      @closing="showDialog = false"
    >
      <template v-slot:title>
        <span v-if="geneType === 'genesInPanel'">
          {{ $t('panel-result.dialog.title-genes-in-panel') }}:
          {{ panelName }}
        </span>
        <span v-else>
          {{ $t('panel-result.dialog.title-genes-not-in-panel') }}:
          {{ panelName }}
        </span>
      </template>
      <template v-slot:content>
        <v-virtual-scroll :items="genes" height="400" item-height="64">
          <template v-slot:default="{ item }">
            <v-list-item :key="item">
              <v-list-item-content>
                <v-list-item-title>
                  <v-chip
                    :outlined="chipOutlined"
                    class="ma-1"
                    :color="formatState(item)"
                  >
                    <div class="d-flex align-center">
                      {{ item.gene }}
                      <span v-if="item.synonym != ''">
                        <v-icon class="ml-1">mdi-arrow-right-bold</v-icon>
                        {{ item.synonym }}
                      </span>
                    </div>
                  </v-chip>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
          </template>
        </v-virtual-scroll>
      </template>
      <template v-slot:action-buttons>
        <v-btn class="primary" @click="downloadGenes(genes)">
          {{ $t('panel-result.dialog.button.save') }}
        </v-btn>
      </template>
    </dialog-template>

    <v-card outlined>
      <v-card-title>
        {{ $t('panel-result.result.name') }}
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
            <panel-results-help />
          </template>
        </info-alert>
        <div class="text-left" v-if="symbolOrSynonymLength > 0">
          <b>{{ $t('panel-result.result.title') }}:</b>
          {{ symbolOrSynonymLength }}
        </div>
        <div class="text-left" v-if="notFoundLength > 0">
          <b>{{ $t('panel-result.result.not-found-genes-title') }}:</b>
          {{ notFoundLength }}
        </div>
        <v-data-table
          :headers="tableHeaders"
          :items="panelContent"
          item-key="name"
          :custom-sort="customSort"
        >
          <template v-slot:[`item.institution`]="{ item }">
            <v-tooltip bottom v-if="!isInstitutionEmpty(item.institution)">
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  v-on="on"
                  @click.stop="openInstitutionDetails(item.institution)"
                >
                  {{ item.institution.item.name }}
                  <v-icon>mdi-arrow-top-right-thick</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('panel-result.show-institution-details') }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.countGenesInPanel`]="{ item }">
            <v-tooltip bottom v-if="item.countGenesInPanel > 0">
              <template v-slot:activator="{ on }">
                <v-chip
                  :outlined="chipOutlined"
                  class="ma-2"
                  color="primary"
                  v-on="on"
                  @click.stop="openDialog(item, 'genesInPanel')"
                >
                  {{ item.countGenesInPanel }}
                </v-chip>
              </template>
              <span>{{ $t('panel-result.chip.show-genes') }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.countGenesNotInPanel`]="{ item }">
            <v-tooltip bottom v-if="item.countGenesNotInPanel > 0">
              <template v-slot:activator="{ on }">
                <v-chip
                  :outlined="chipOutlined"
                  class="ma-2 secondary"
                  text-color="black"
                  v-on="on"
                  @click.stop="openDialog(item, 'genesNotInPanel')"
                >
                  {{ item.countGenesNotInPanel }}
                </v-chip>
              </template>
              <span>{{ $t('panel-result.chip.show-genes') }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on" @click.stop="downloadResult(item)">
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('panel-result.tooltip.save-result') }}</span>
            </v-tooltip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import download, { formatObjetToJson } from '@/utils/download'
import PanelResultsHelp from '@/components/help/PanelResultsHelp.vue'
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import {
  FullGene,
  Gene,
  Institution,
  PanelResultFormattedRow,
  PanelSearchResult,
  ParsedGenes,
  SynonymGene,
  // ParsedGene,
} from '@/types/panel-types'
import InstitutionDetails from '@/components/InstitutionDetails.vue'
import DialogTemplate from '@/components/DialogTemplate.vue'
import { ListItem } from '@/types/ui-types'

export default Vue.extend({
  components: {
    PanelResultsHelp,
    HelpButton,
    InfoAlert,
    InstitutionDetails,
    DialogTemplate,
  },
  name: 'PanelResult',
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
    return {
      institutionDialog: false,
      showDialog: false,
      currentInstitution: new ListItem(
        new Institution('', '', '', '', []),
        true
      ),
      geneType: new String(),
      panelName: new String(),
      genes: new Array<SynonymGene>(),
      expanded: [],
      singleExpand: false,
      tableHeaders: [
        {
          text: this.$t('panel-result.table.headers.institution-name'),
          align: 'start',
          value: 'institution',
        },
        {
          text: this.$t('panel-result.table.headers.panel-name'),
          value: 'name',
        },
        {
          text: this.$t('panel-result.table.headers.genes-found'),
          value: 'countGenesInPanel',
        },
        {
          text: this.$t('panel-result.table.headers.genes-not-found'),
          value: 'countGenesNotInPanel',
        },
        {
          text: this.$t('panel-result.table.headers.actions'),
          value: 'actions',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      institutionsByPanel: 'getInstitutionsByPanel',
      chipOutlined: 'getChipOutlined',
    }),
    notFoundLength() {
      let length = 0
      if (this.parsedGenes && this.parsedGenes.notFoundGenes) {
        length = this.parsedGenes.notFoundGenes.length
      }
      return length
    },
    symbolOrSynonymLength() {
      let length = 0
      if (this.parsedGenes) {
        if (this.parsedGenes.synonymFoundGenes) {
          length += this.parsedGenes.synonymFoundGenes.length
        }
        if (this.parsedGenes.symbolFoundGenes) {
          length += this.parsedGenes.symbolFoundGenes.length
        }
      }
      return length
    },
    panelContent(): Array<PanelResultFormattedRow> {
      return (this.panelSearchResults as Array<PanelSearchResult>).map(
        (panel: PanelSearchResult) => {
          const panelSymbolToSymbolMatchSet = new Set(
            panel.panelSymbolToSymbolMatch
          )
          const panelSynonymToSynonymMatchSet = new Set(
            panel.panelSynonymToSynonymMatch
          )
          const panelSymbolToSynonymMatchMap = new Map(
            panel.panelSymbolToSynonymMatch.map((item: SynonymGene) => [
              (item.gene as FullGene).symbol,
              item,
            ])
          )
          const panelSynonymToSymbolMatchMap = new Map(
            panel.panelSynonymToSymbolMatch.map((item: SynonymGene) => [
              item.synonym,
              item,
            ])
          )

          const genesInPanel = panel.genesInPanel
            .filter((gene) => gene && gene.name)
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((gene: Gene) =>
              this.formatGeneInfo(
                gene,
                panelSymbolToSymbolMatchSet,
                panelSynonymToSynonymMatchSet,
                panelSymbolToSynonymMatchMap,
                panelSynonymToSymbolMatchMap
              )
            )
          const genesNotInPanel = panel.genesNotInPanel
            .sort((a, b) => (a.name > b.name ? 1 : -1))
            .map((gene: Gene) =>
              this.formatGeneInfo(
                gene,
                panelSymbolToSymbolMatchSet,
                panelSynonymToSynonymMatchSet,
                panelSymbolToSynonymMatchMap,
                panelSynonymToSymbolMatchMap
              )
            )
          let institution = this.institutionsByPanel.get(panel.name)
          if (!institution) {
            institution = {}
          }

          return new PanelResultFormattedRow(
            panel.name,
            genesInPanel.length,
            genesNotInPanel.length,
            genesInPanel,
            genesNotInPanel,
            new ListItem(institution, true)
          )
        }
      )
    },
  },
  watch: {},
  methods: {
    openDialog(panel: PanelResultFormattedRow, geneType: string) {
      this.panelName = panel.name
      this.geneType = geneType
      this.genes =
        geneType === 'genesInPanel' ? panel.genesInPanel : panel.genesNotInPanel
      this.showDialog = true
    },
    openInstitutionDetails(institution: ListItem) {
      this.currentInstitution = institution
      this.institutionDialog = true
    },
    downloadGenes(genes: string) {
      const result = {
        name: this.panelName,
        genes: genes,
      }
      this.downloadResult(result)
      //this.showDialog = false;
    },
    downloadResult(panel: any) {
      const content = this.formatResult(panel, false)
      const filename = panel.name.replaceAll(/[ ]+/g, '_') + '.json'
      download(filename, content, 'text/json')
    },
    formatResult(panel: any, pretty: boolean) {
      return formatObjetToJson(panel, pretty)
    },
    isInstitutionEmpty(institution: ListItem) {
      return Object.keys(institution.item).length == 0
    },
    handleHelp() {
      this.$emit('help')
    },
    customSort(items: any[], sortBy: string[], sortDesc: boolean[]): any[] {
      items.sort((a: any, b: any) => {
        const desc = sortDesc[0]
        if (sortBy[0] === 'institution') {
          const aItem = a[sortBy[0]].name
          const bItem = b[sortBy[0]].name
          return this.sortString(aItem, bItem, desc)
        } else {
          const aItem = a[sortBy[0]]
          const bItem = b[sortBy[0]]
          return this.sortString(aItem, bItem, desc)
        }
      })
      return items
    },
    sortString(aItem: any, bItem: any, desc: boolean) {
      if (aItem > bItem) {
        return desc ? 1 : -1
      }
      if (aItem < bItem) {
        return desc ? -1 : 1
      }
      return 0
    },
    formatGeneInfo(
      gene: Gene,
      symbolToSymbolMatchSet: Set<string>,
      synonymToSynonymMatchSet: Set<string>,
      symbolToSynonymMatchMap: Map<string, SynonymGene>,
      synonymToSymbolMatchMap: Map<String, SynonymGene>
    ): SynonymGene {
      let geneName = gene.name

      let resultGene = geneName.toUpperCase()
      let synonym = ''

      if (synonymToSynonymMatchSet.has(geneName)) {
        synonym = geneName.toUpperCase()
        resultGene = ''
      } else if (symbolToSynonymMatchMap.has(geneName)) {
        const symbolToSynonymMatch = symbolToSynonymMatchMap.get(geneName)
        synonym = (symbolToSynonymMatch as SynonymGene).synonym.toUpperCase()
      } else if (synonymToSymbolMatchMap.has(geneName)) {
        const synonymToSymbolMatch = synonymToSymbolMatchMap.get(geneName)
        synonym = (
          (synonymToSymbolMatch as SynonymGene).gene as string
        ).toUpperCase()
      }

      return new SynonymGene(synonym, resultGene)
    },

    formatState(gene: SynonymGene): string {
      let color = 'success'

      if (gene.synonym !== '') {
        color = 'warning'
      }

      return color
    },
  },
})
</script>
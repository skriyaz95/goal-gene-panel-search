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
                <v-list-item-title> {{ item }} </v-list-item-title>
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
        >
          <template v-slot:[`item.institution`]="{ item }">
            <v-tooltip bottom v-if="!isInstitutionEmpty(item.institution)">
              <template v-slot:activator="{ on }">
                <v-btn
                  text
                  v-on="on"
                  @click.stop="openInstitutionDetails(item.institution)"
                >
                  {{ item.institution.name }}
                  <v-icon>mdi-arrow-top-right-thick</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('panel-result.show-institution-details') }}</span>
            </v-tooltip>
          </template>
          <template v-slot:[`item.countGenesInPanel`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
                  class="ma-2"
                  color="primary"
                  text-color="white"
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
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
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
  Gene,
  Institution,
  PanelResultFormattedRow,
  PanelSearchResult,
  ParsedGenes,
  // ParsedGene,
} from '@/types/panel-types'
import InstitutionDetails from '@/components/InstitutionDetails.vue'
import DialogTemplate from '@/components/DialogTemplate.vue'

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
      currentInstitution: new Institution('', '', '', '', []),
      geneType: new String(),
      panelName: new String(),
      genes: new Array<string>(),
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
          const genesInPanel = panel.genesInPanel.map((gene: Gene) =>
            gene.name.toUpperCase()
          )
          const genesNotInPanel = panel.genesNotInPanel.map((gene: Gene) =>
            gene.name.toUpperCase()
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
            institution
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
    openInstitutionDetails(institution: Institution) {
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
    isInstitutionEmpty(institution: Institution) {
      return Object.keys(institution).length == 0
    },
    handleHelp() {
      this.$emit('help')
    },
  },
})
</script>

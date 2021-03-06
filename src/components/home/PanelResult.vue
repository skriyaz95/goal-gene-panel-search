<template>
  <div>
    <dialog-template
      max-width="800px"
      v-model="institutionDialog"
      @closing="institutionDialog = false"
    >
      <template v-slot:title>
        {{ $t('panelResult.dialog.title-institution-details') }}
      </template>
      <template v-slot:content>
        <institution-details :institution="currentInstitution" />
      </template>
    </dialog-template>
    <dialog-template
      max-width="800px"
      :help="false"
      v-model="showDialog"
      @closing="showDialog = false"
      @help="handleHelp"
    >
      <template v-slot:title>
        {{ $t('panelResult.dialog.title') }}:
        {{ panelName }}
      </template>
      <template v-slot:content>
        <info-alert :active="help">
          <template v-slot:content>
            <panel-results-dialog-help />
          </template>
        </info-alert>
        <v-row dense>
          <v-col cols="12" md="6">
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead class="pt-2">
                  <tr>
                    <th class="text-left">
                      {{ $t('panelResult.dialog.table.genesFound') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in panelGenes.genesInPanel"
                    :key="index"
                  >
                    <td>
                      <gene-entry :parsedGene="item"></gene-entry>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
          <v-col cols="12" md="6">
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead class="pt-2">
                  <tr>
                    <th class="text-left">
                      {{ $t('panelResult.dialog.table.genesNotFound') }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, index) in panelGenes.genesNotInPanel"
                    :key="index"
                  >
                    <td>
                      <gene-entry :parsedGene="item"></gene-entry>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </template>
      <template v-slot:action-buttons>
        <v-btn class="primary" @click="downloadGenes(panelName, panelGenes)">
          {{ $t('panelResult.dialog.button.download') }}
          <v-icon right>mdi-download</v-icon>
        </v-btn>
      </template>
    </dialog-template>

    <v-card outlined>
      <v-card-title>
        {{ $t('panelResult.result.name') }}
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :disabled="!panelContent || panelContent.length == 0"
              icon
              @click="downloadPanelResult()"
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
            <panel-results-help />
          </template>
        </info-alert>
        <div class="text-left" v-if="anyitemLength > 0">
          <b>{{ $t('panelResult.result.title') }}:</b>
          {{ anyitemLength }}
        </div>
        <div class="text-left" v-if="invalidLength > 0">
          <b>{{ $t('panelResult.result.invalidGenesTitle') }}:</b>
          {{ invalidLength }}
        </div>
        <resizable-page ref="resizablePage">
          <template v-slot:table="tableProps">
            <v-data-table
              :height="tableProps.tableHeight"
              :headers="tableHeaders"
              :items="panelContent"
              item-key="name"
              :custom-sort="customSort"
              fixed-header
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
                  <span>{{ $t('panelResult.showInstitutionDetails') }}</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.panelGenes`]="{ item }">
                <v-tooltip bottom v-if="notEmpty(item)">
                  <template v-slot:activator="{ on }">
                    <v-progress-linear
                      :value="countFoundNotFound(item)"
                      color="primary"
                      background-color="warning lighten-1"
                      height="25"
                      dark
                      v-on="on"
                      @click="openDialog(item)"
                      class="sim-button"
                    >
                      <div class="d-flex justify-space-between col-12">
                        <span>
                          {{ item.panelGenes.genesInPanel.length }}
                        </span>
                        <span>
                          {{ item.panelGenes.genesNotInPanel.length }}
                        </span>
                      </div>
                    </v-progress-linear>
                  </template>
                  <span>{{ $t('panelResult.chip.showGenes') }}</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      v-on="on"
                      @click.stop="downloadGenes(item.name, item.panelGenes)"
                    >
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('panelResult.saveResult.tooltip') }}</span>
                </v-tooltip>
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
import { mapGetters } from 'vuex'
import download, { formatObjetToJson } from '@/utils/download'
import PanelResultsHelp from '@/components/help/PanelResultsHelp.vue'
import PanelResultsDialogHelp from "@/components/help/PanelResultsDialogHelp.vue";
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import {
  FullGene,
  Institution,
  PanelGenes,
  PanelResultFormattedRow,
  ParsedGene,
  ParsedGenes,
  // ParsedGene,
} from '@/types/panel-types'
import InstitutionDetails from '@/components/InstitutionDetails.vue'
import DialogTemplate from '@/components/DialogTemplate.vue'
import { GeneState, ListItem } from '@/types/ui-types'
import Papa from 'papaparse'
// import { transpose } from '@/utils/arrays'
import ResizablePage from '@/components/ResizablePage.vue'

export default Vue.extend({
  components: {
    PanelResultsDialogHelp,
    PanelResultsHelp,
    HelpButton,
    InfoAlert,
    InstitutionDetails,
    DialogTemplate,
    ResizablePage,
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
    panelContent: {
      type: Array,
      default: () => new Array<PanelResultFormattedRow>(),
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
      panelName: new String(),
      panelGenes: new PanelGenes([], []),
      tableHeaders: [
        {
          text: this.$t('panelResult.table.headers.institutionName'),
          align: 'start',
          value: 'institution',
        },
        {
          text: this.$t('panelResult.table.headers.panelName'),
          value: 'name',
        },
        {
          text: this.$t('panelResult.table.headers.genes'),
          value: 'panelGenes',
          sortable: false,
        },
        {
          text: this.$t('panelResult.table.headers.actions'),
          value: 'actions',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
    invalidLength() {
      let length = 0
      if (this.parsedGenes && this.parsedGenes.invalidGenes) {
        length = this.parsedGenes.invalidGenes.length
      }
      return length
    },
    anyitemLength() {
      let length = 0
      if (this.parsedGenes) {
        if (this.parsedGenes.synonymFoundGenes) {
          length += this.parsedGenes.synonymFoundGenes.length
        }
        if (this.parsedGenes.symbolFoundGenes) {
          length += this.parsedGenes.symbolFoundGenes.length
        }
        if (this.parsedGenes.fusionFoundGenes) {
          length += this.parsedGenes.fusionFoundGenes.length
        }
        if (this.parsedGenes.intronFoundGenes) {
          length += this.parsedGenes.intronFoundGenes.length
        }
      }
      return length
    },
  },
  watch: {},
  methods: {
    openDialog(panel: PanelResultFormattedRow) {
      this.panelName = panel.name
      this.panelGenes = panel.panelGenes
      this.showDialog = true
    },
    openInstitutionDetails(institution: ListItem) {
      this.currentInstitution = institution
      this.institutionDialog = true
    },
    downloadGenes(panelName: string, genes: PanelGenes) {
      const headers = []
      headers.push(this.$t('panelResult.csv.headers.panelResult.geneSearch'))
      headers.push(this.$t('panelResult.csv.headers.panelResult.hgnc'))
      headers.push(this.$t('panelResult.csv.headers.panelResult.genesFound'))
      headers.push(this.$t('panelResult.csv.headers.panelResult.genesNotFound'))
      headers.push(this.$t('panelResult.csv.headers.panelResult.invalid'))

      const rows: Array<Array<String>> = []
      for (let i = 0; i < genes.genesInPanel.length; i++) {
        const items: Array<String> = []
        const currentGene = genes.genesInPanel[i]
        //gene search
        items.push(currentGene.fromSearch as string)
        if (
          currentGene.state === GeneState.SYNONYM ||
          currentGene.state === GeneState.FUSION ||
          currentGene.state === GeneState.INTRON
        ) {
          //hgnc
          items.push((currentGene.realGene as FullGene).symbol)
        } else {
          //hgnc
          items.push(currentGene.gene.name)
        }
        //found
        items.push(currentGene.gene.name)
        //not found
        items.push('')
        //invalid
        items.push('')
        rows.push(items)
      }
      for (let i = 0; i < genes.genesNotInPanel.length; i++) {
        const items: Array<String> = []
        const currentGene = genes.genesNotInPanel[i]
        //gene search
        items.push(currentGene.fromSearch as string)
        //hgnc
        items.push(currentGene.realGene as string)
        //found
        items.push('')
        //not found
        items.push(currentGene.gene.name)
        //invalid
        items.push('')
        rows.push(items)
      }

      //Invalid genes
      for (let i = 0; i < this.parsedGenes.invalidGenes.length; i++) {
        const items: Array<String> = []
        const currentGene = this.parsedGenes.invalidGenes[i]
        //gene search
        items.push(currentGene.gene.name)
        //hgnc
        items.push('')
        //found
        items.push('')
        //not found
        items.push('')
        //invalid
        items.push(currentGene.gene.name)
        rows.push(items)
      }

      // const panelNames = []
      // panelNames.push(panelName)

      // const genesInPanel = genes.genesInPanel.map(
      //   (geneInPanel) => geneInPanel.gene.name
      // )
      // const genesNotInPanel = genes.genesNotInPanel.map(
      //   (geneNotInPanel) => geneNotInPanel.gene.name
      // )

      // const data = []
      // data.push(panelNames)
      // data.push(genesInPanel)
      // data.push(genesNotInPanel)

      const csv = Papa.unparse({
        fields: headers,
        data: rows,
      })
      download('search_results_' + panelName + '.csv', csv, 'text/csv')
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
    notEmpty(item: PanelResultFormattedRow) {
      return (
        item.panelGenes.genesInPanel.length > 0 ||
        item.panelGenes.genesNotInPanel.length > 0
      )
    },
    hiddenClass(items: ParsedGene[]) {
      return items.length === 0 ? 'hidden' : ''
    },
    countFoundNotFound(item: PanelResultFormattedRow) {
      return (
        (item.panelGenes.genesInPanel.length /
          (item.panelGenes.genesInPanel.length +
            item.panelGenes.genesNotInPanel.length)) *
        100
      )
    },
    downloadPanelResult() {
      const headers = []
      headers.push(
        this.$t('panelResult.csv.headers.panelResult.institutionName')
      )
      headers.push(
        this.$t('panelResult.csv.headers.panelResult.institutionPhone')
      )
      headers.push(
        this.$t('panelResult.csv.headers.panelResult.institutionEmail')
      )
      headers.push(
        this.$t('panelResult.csv.headers.panelResult.institutionWebsite')
      )
      headers.push(this.$t('panelResult.csv.headers.panelResult.genePanelName'))
      headers.push(this.$t('panelResult.csv.headers.panelResult.genesFound'))
      headers.push(this.$t('panelResult.csv.headers.panelResult.genesNotFound'))

      const data: any = []

      this.panelContent.forEach((panelContent) => {
        const row = []

        let institution: Institution = new Institution('', '', '', '', [])
        if ((panelContent as PanelResultFormattedRow).institution !== null) {
          institution = (
            (panelContent as PanelResultFormattedRow).institution as ListItem
          ).item as Institution
        }
        row.push(institution.name)
        row.push(institution.phone)
        row.push(institution.email)
        row.push(institution.website)
        row.push((panelContent as PanelResultFormattedRow).name)
        row.push(
          (panelContent as PanelResultFormattedRow).panelGenes.genesInPanel
            .length
        )
        row.push(
          (panelContent as PanelResultFormattedRow).panelGenes.genesNotInPanel
            .length
        )
        data.push(row)
      })

      const csv = Papa.unparse({
        fields: headers,
        data: data,
      })
      download('panels_result.csv', csv, 'text/csv')
    },
    resize() {
      const elt: any = this.$refs.resizablePage
      if (elt !== undefined) {
        elt.onResize()
      }
    },
  },
})
</script>

<style scoped>
.hidden {
  opacity: 0;
}
</style>

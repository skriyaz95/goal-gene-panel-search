<template>
  <div>
    <v-dialog
      v-model="institutionDialog"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          {{ $t('panel-result.dialog.title-institution-details') }}
        </v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-bank</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ institution.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-phone-in-talk</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><a :href="linkTo(institution.phone, 'phone')">{{ institution.phone }}</a></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-email</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><a :href="linkTo(institution.email, 'email')">{{ institution.email }}</a></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-earth</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title><a :href="institution.website" target="_blank"> {{ $t('panel-result.dialog.institution-website-link')}} </a></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="institutionDialog = false"
          >
            {{ $t('panel-result.dialog.button.close') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span
            v-if="geneType === 'genesInPanel'"
            class="text-h5"
          >
            {{ $t('panel-result.dialog.title-genes-in-panel') }}:
            {{ panelName }}
          </span>
          <span
            v-else
            class="text-h5"
          >
            {{ $t('panel-result.dialog.title-genes-not-in-panel') }}:
            {{ panelName }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-virtual-scroll
            :items="genes"
            height="400"
            item-height="64"
          >
            <template v-slot:default="{ item }">
              <v-list-item :key="item">
                <v-list-item-content>
                  <v-list-item-title> {{ item }} </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider />
            </template>
          </v-virtual-scroll>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="showDialog = false"
          >
            {{ $t('panel-result.dialog.button.close') }}
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="downloadGenes(genes)"
          >
            {{ $t('panel-result.dialog.button.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card outlined>
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="getPanelResult()"
          item-key="name"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                {{ $t('panel-result.result.name') }}
                <span v-if="userGenes.length > 0">
                  ({{ $t('panel-result.result.title') }}:
                  {{ userGenes.length }})
                </span>
              </v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:[`item.institution`]="{ item }">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on" v-if="!isInstitutionEmpty(item.institution)" @click.stop="openInstitutionDetails(item.institution)">
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
                <v-btn
                  icon
                  v-on="on"
                  @click.stop="downloadResult(item)"
                >
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
import {Gene, Institution, PanelResultFormattedRow, PanelSearchResult,} from '@/types/panel-types'
import {mapGetters} from 'vuex'
import download, {formatObjetToJson} from '@/utils/download'

export default Vue.extend({
  name: 'PanelResult',
  data() {
    return {
      institutionDialog: false,
      showDialog: false,
      institution: {},
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
      userGenes: 'getUserGenes',
      userGenesInPanels: 'getUserGenesInPanels',
      institutionMap: 'getInstitutionMap'
    }),
  },
  methods: {
    getPanelResult() {
      return this.userGenesInPanels.map((panel: PanelSearchResult) => {
        const genesInPanel = panel.genesInPanel.map((gene: Gene) =>
          gene.name.toUpperCase()
        )
        const genesNotInPanel = panel.genesNotInPanel.map((gene: Gene) =>
          gene.name.toUpperCase()
        )

        let institution = this.institutionMap.get(panel.name.toUpperCase())
        if(!institution) {
          institution  = {};
        }

        return new PanelResultFormattedRow(
          panel.name,
          genesInPanel.length,
          genesNotInPanel.length,
          genesInPanel,
          genesNotInPanel,
          institution
        )
      })
    },
    openDialog(panel: PanelResultFormattedRow, geneType: string) {
      this.panelName = panel.name
      this.geneType = geneType
      this.genes =
        geneType === 'genesInPanel' ? panel.genesInPanel : panel.genesNotInPanel
      this.showDialog = true
    },
    openInstitutionDetails(institution: Institution) {
      this.institution = institution
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
    linkTo(link: string, linkType: string) {
      const linkPrefix = linkType == 'phone' ?  "tel:" : "mailto:"
      return linkPrefix + link
    },
    isInstitutionEmpty(institution: Institution) {
      return Object.keys(institution).length < 0;
    }
  },
})
</script>

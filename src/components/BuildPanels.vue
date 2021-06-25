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
        <v-card v-if="tempPanels.length > 0" outlined>
          <v-expansion-panels flat focusable>
            <v-expansion-panel v-for="panel in tempPanels" :key="panel.name">
              <v-expansion-panel-header disable-icon-rotate>
                <v-row align="center">
                  <v-col cols="6" lg="3">
                    <v-text-field
                      v-model="panel.name"
                      :label="$t('buildPanels.panelName.text')"
                      hide-details
                      dense
                      @click.stop=""
                    />
                  </v-col>
                  <v-col cols="6" lg="9">
                    <span>
                      ({{ $tc('count.gene', $n(panel.genes.length)) }})</span
                    >
                  </v-col>
                </v-row>

                <template v-slot:actions>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" @click.stop="downloadPanel(panel)">
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t('button.saveOnePanel.tooltip') }}</span>
                  </v-tooltip>
                  <v-icon> mdi-chevron-down </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="pa-2" v-text="formatPanel(panel, true)" />
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
import { Gene, GenePanel, PanelPayload } from '@/types/panel-types'
import download from '@/utils/download'
import { formatObjetToJson } from '@/utils/download'

export default Vue.extend({
  name: 'BuildPanel',

  data: () => ({
    rawDir: 'raw_panels/',
    sourceDir: 'source_panels/',
    panelFileNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
  }),
  methods: {
    buildPanels() {
      this.$store.commit('resetTempPanels')
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
                name: geneSymbol,
              })
            }
            const panel = new GenePanel(panelName, panelGenes)
            this.$store.commit('addTempPanel', new PanelPayload(panel))
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
    parseCSV(allRows: String[]) {
      console.log('parsing csv')
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
    parseBED(allRows: String[]) {
      console.log('parsing bed')
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
    formatPanel(panel: GenePanel, pretty: boolean) {
      return formatObjetToJson(panel, pretty)
    },
    downloadPanel(panel: GenePanel) {
      const content = this.formatPanel(panel, false)
      const filename = panel.name.replaceAll(/[ ]+/g, '_') + '.json'
      download(filename, content, 'text/json')
    },
    downloadAllPanels() {
      for (var i = 0; i < this.tempPanels.length; i++) {
        this.downloadPanel(this.tempPanels[i])
      }
    },
    isEmptyPanels() {
      return !this.tempPanels || this.tempPanels.length == 0
    },
    listPanelFiles(r: any) {
      this.panelFileNames = []
      r.keys().forEach((key: any) => this.panelFileNames.push(key))
    },
  },
  computed: {
    ...mapGetters({
      tempPanels: 'getTempPanels',
      panels: 'getPanels',
    }),
  },
  mounted() {
    this.listPanelFiles(
      require.context('../../public/raw_panels/', false, /\.csv$|\.bed$/)
    )
  },
})
</script>

<template>
  <div>
    <v-toolbar class="primary" dark flat>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <main-content-template outter>
      <template v-slot:left-col>
        <v-container class="px-0 py-3">
          <v-row>
            <v-col cols="12" class="pb-0">
              <user-input
                :help="showHelp"
                @help="handleHelp"
                :firstTime="firstTime"
              ></user-input>
            </v-col>
            <v-col cols="12">
              <parsed-input
                ref="parsedInput"
                :help="showHelp"
                @help="handleHelp"
                :loading="parsingGenes"
                :formattedGenes="formattedGenes"
              />
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:right-col>
        <v-container class="pa-0" fluid>
          <v-row class="text-start" dense>
            <v-col cols="12">
              <v-tabs centered v-model="tab" :background-color="background">
                <v-tab
                  :href="'#' + tabTitle"
                  v-for="tabTitle in tabs"
                  :key="tabTitle"
                >
                  {{ tabTitle }}
                </v-tab>
              </v-tabs>
              <v-tabs-items v-model="tab" class="background pt-3">
                <v-tab-item value="results">
                  <panel-result
                    :help="showHelp"
                    @help="handleHelp"
                    :loading="searchingPanels"
                    :parsedGenes="formattedGenes"
                    :panelSearchResults="panelSearchResults"
                  />
                </v-tab-item>
                <v-tab-item value="compare">
                  <panel-compare
                    :help="showHelp"
                    @help="handleHelp"
                    :loading="searchingPanels"
                    :items="compareItems"
                    :headers="compareHeaders"
                    :visibleInstitutions="visibleInstitutions"
                    @toggleInstitution="toggleInstitution"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </main-content-template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import UserInput from '@/components/home/UserInput.vue'
import ParsedInput from '@/components/home/ParsedInput.vue'
import PanelResult from '@/components/home/PanelResult.vue'
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import {
  Institution,
  PanelSearchResult,
  ParsedGenes,
} from '@/types/panel-types'
import PanelCompare from '@/components/home/PanelCompare.vue'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'
import { FormatCompareItemsPayload } from '@/types/payload-types'
import { getCookie, setCookie } from '@/utils/cookies'
import { ActiveState, TableHeader } from '@/types/ui-types'
import MainContentTemplate from '@/components/MainContentTemplate.vue'

export default Vue.extend({
  components: {
    UserInput,
    ParsedInput,
    PanelResult,
    PanelCompare,
    MainContentTemplate,
  },
  name: 'Home',
  props: {},
  data: () => ({
    tabs: ['results', 'compare'],
    showHelp: false,
    parsingGenes: false,
    searchingPanels: false,
    formattedGenes: new ParsedGenes(),
    panelSearchResults: new Array<PanelSearchResult>(),
    firstTime: false,
    compareItems: [],
    compareHeaders: new Array<TableHeader>(),
    visibleInstitutions: new Array<ActiveState>(),
  }),
  computed: {
    ...mapGetters({
      institutions: 'getInstitutionsSorted',
      panelsByInstitution: 'getPanelsByInstitution',
    }),
    tab: {
      set(tab: string) {
        this.$router.replace({ query: { ...this.$route.query, tab } })
      },
      get(): string | (string | null)[] {
        return this.$route.query.tab
      },
    },
    background(): VuetifyThemeItem {
      return this.$vuetify.theme.themes.light.background
    },
    toolbarTitle(): TranslateResult {
      if (this.$route.meta && this.$route.meta.i18n) {
        return this.$t(this.$route.meta.i18n + '.toolbar.text')
      }
      return 'GTI'
    },
  },
  methods: {
    ...mapActions([
      'parseUserGenes',
      'findGenesInAllPanels',
      'formatCompareItems',
    ]),
    handleHelp(): any {
      this.showHelp = !this.showHelp
      this.firstTime = false
    },
    handleFirstTime(): any {
      const cookie = getCookie('firstTime')
      if (!cookie) {
        //cookie doesn't exist
        setCookie('firstTime', false, 365)
        setTimeout(() => {
          this.firstTime = true
        }, 5000) //display 5 sec after loading
      }
    },
    toggleInstitution(activeState: ActiveState) {
      activeState.active = !activeState.active
      this.setInstitutionActiveState(activeState)
    },
    setInstitutionActiveState(activeState: ActiveState) {
      const panels = this.panelsByInstitution.get(activeState.id)
      if (panels) {
        const newHeaders = new Array<TableHeader>()
        for (let i = 0; i < this.compareHeaders.length; i++) {
          const header = this.compareHeaders[i]
          if (panels.indexOf(header.text) > -1) {
            header.visible = activeState.active
          }
          newHeaders.push(header)
        }
        this.compareHeaders = newHeaders
      }
    },
    initInstitutionVisibleState() {
      this.visibleInstitutions.forEach((activeState: ActiveState) => {
        this.setInstitutionActiveState(activeState)
      })
    },
    initVisibleInstitutions() {
      this.visibleInstitutions = this.institutions.map((i: Institution) => {
        return { id: i.name, active: true }
      })
    },
  },
  mounted() {
    this.handleFirstTime()
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'parseUserGenes') {
        this.formattedGenes = new ParsedGenes()
        this.formattedGenes.notFoundGenes = event.data.parsedGenes.notFoundGenes
        this.formattedGenes.synonymFoundGenes =
          event.data.parsedGenes.synonymFoundGenes
        this.formattedGenes.symbolFoundGenes =
          event.data.parsedGenes.symbolFoundGenes
        this.findGenesInAllPanels(this.formattedGenes)
        // })
      } else if (event.data.todo == 'findGenesInAllPanels') {
        this.panelSearchResults = event.data.genesInAllPanels
        const payload = new FormatCompareItemsPayload(
          this.formattedGenes,
          this.panelSearchResults
        )
        this.formatCompareItems(payload)
        this.searchingPanels = false
      } else if (event.data.todo == 'cleanUserInput') {
        this.parseUserGenes(event.data.userGeneList)
      } else if (event.data.todo == 'formatCompareItems') {
        this.compareItems = event.data.items
        event.data.headers[0].text = this.$t(
          'panelCompare.table.headers.gene.text'
        ) //replace placeholder with i18n value
        this.compareHeaders = event.data.headers
        this.initInstitutionVisibleState()
      }
    }
    this.initVisibleInstitutions()
  },
})
</script>

<template>
  <div>
    <v-toolbar class="primary" dark flat dense>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <main-content-template outter even>
      <template v-slot:left-col>
        <main-content-template inner header>
          <template v-slot:header>
            <div class="pl-2 pt-2">
              <recall-searches
                :lastSearches="lastSearches"
                @recallLastSearch="fillLastSearch"
                @resetLastSearches="resetLastSearches"
              />
            </div>
          </template>
          <template v-slot:left-col>
            <user-input
              ref="userInput"
              :help="showHelp"
              @help="handleHelp"
              :firstTime="firstTime"
              @afterBlur="handleUserInputBlur"
            >
            </user-input>
          </template>
          <template v-slot:right-col>
            <parsed-input
              ref="parsedInput"
              :help="showHelp"
              @help="handleHelp"
              :loading="parsingGenes"
              :formattedGenes="formattedGenes"
            />
          </template>
        </main-content-template>
      </template>
      <template v-slot:right-col>
        <main-content-template inner header :twoCols="false">
          <template v-slot:header>
            <v-tabs centered v-model="tab" :background-color="background">
              <v-tab
                :href="'#' + tabTitle"
                v-for="tabTitle in tabs"
                :key="tabTitle"
              >
                {{ tabTitle }}
              </v-tab>
            </v-tabs>
          </template>
          <template v-slot:one-col>
            <v-tabs-items v-model="tab" class="background">
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
          </template>
        </main-content-template>
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
import RecallSearches from '@/components/home/RecallSearches.vue'

export default Vue.extend({
  components: {
    UserInput,
    ParsedInput,
    PanelResult,
    PanelCompare,
    MainContentTemplate,
    RecallSearches,
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
    lastSearches: [],
  }),
  computed: {
    ...mapGetters({
      institutions: 'getInstitutionsSorted',
      panelsByInstitution: 'getPanelsByInstitution',
      inputNeedsReload: 'getInputNeedsReload',
      lastTab: 'getLastTabHome',
    }),
    tab: {
      set(tab: string) {
        const queryTab = this.$route.query.tab
        if (tab && tab !== queryTab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
          if (queryTab) {
            this.updateLastTabHome(tab)
          }
        }
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
      'updateLastSearch',
      'clearLastSearches',
      'updateInputNeedsReload',
      'updateLastTabHome',
    ]),
    handleHelp(): any {
      this.showHelp = !this.showHelp
      this.firstTime = false
      setCookie('firstTime', true, 365)
    },
    handleFirstTime(): any {
      const cookie = getCookie('firstTime')
      if (!cookie) {
        //cookie doesn't exist
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
    fillLastSearch(search: string) {
      const ref = this.$refs.userInput as any
      ref.fillLastSearch(search)
    },
    resetLastSearches() {
      this.clearLastSearches().then(() => {
        this.lastSearches = []
      })
    },
    handleUserInputBlur(geneList: any[]) {
      if (geneList[1]) {
        this.updateLastSearch(geneList[0]).then((result: []) => {
          this.lastSearches = result
        })
        this.updateInputNeedsReload(true)
      } else {
        this.updateInputNeedsReload(false)
      }
    },
    loadLastInput() {
      if (this.inputNeedsReload && this.lastSearches.length > 0) {
        const ref = this.$refs.userInput as any
        ref.geneList = this.lastSearches[this.lastSearches.length - 1]
      }
    },
    initLastSearches() {
      this.updateLastSearch('').then((result: []) => {
        this.lastSearches = result
        this.loadLastInput()
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
    this.initLastSearches()
    this.tab = this.lastTab
  },
})
</script>

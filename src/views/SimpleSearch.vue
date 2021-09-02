<template>
  <div>
    <v-toolbar class="primary" dark flat dense>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <main-content-template outter header>
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
          simpleSearch
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
          simpleSearch
        />
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
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import { ParsedGenes } from '@/types/panel-types'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'
import { getCookie, setCookie } from '@/utils/cookies'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import RecallSearches from '@/components/home/RecallSearches.vue'

export default Vue.extend({
  components: {
    UserInput,
    ParsedInput,
    MainContentTemplate,
    RecallSearches,
  },
  name: 'SimpleSearch',
  props: {},
  data: () => ({
    showHelp: false,
    parsingGenes: false,
    searchingPanels: false,
    formattedGenes: new ParsedGenes(),
    firstTime: false,
    lastSearches: [],
  }),
  computed: {
    ...mapGetters({
      institutions: 'getInstitutionsSorted',
      institutionsByPanel: 'getInstitutionsByPanel',
      panelsByInstitution: 'getPanelsByInstitution',
      inputNeedsReload: 'getInputNeedsReload',
    }),
    background(): VuetifyThemeItem {
      return this.$vuetify.theme.themes.light.background
    },
    toolbarTitle(): TranslateResult {
      return this.$t('navigation.search.toolbar.text')
    },
  },
  methods: {
    ...mapActions([
      'parseUserGenes',
      'updateLastSearch',
      'clearLastSearches',
      'updateInputNeedsReload',
      'findGenesInAllPanels',
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
    document.title = 'GTI ' + this.$t('navigation.search.title.text')
    this.handleFirstTime()
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'parseUserGenes') {
        this.formattedGenes = new ParsedGenes()
        this.formattedGenes.invalidGenes = event.data.parsedGenes.invalidGenes
        this.formattedGenes.synonymFoundGenes =
          event.data.parsedGenes.synonymFoundGenes
        this.formattedGenes.symbolFoundGenes =
          event.data.parsedGenes.symbolFoundGenes
        this.formattedGenes.fusionFoundGenes =
          event.data.parsedGenes.fusionFoundGenes
        this.formattedGenes.intronFoundGenes =
          event.data.parsedGenes.intronFoundGenes
      } else if (event.data.todo == 'cleanUserInput') {
        this.parseUserGenes(event.data.userGeneList)
      }
    }
    this.initLastSearches()
  },
})
</script>

<template>
  <v-container fluid class="mt-2">
    <v-row class="text-center" dense>
      <v-col cols="12" lg="3">
        <user-input
          :help="showHelp"
          @help="handleHelp"
          :firstTime="firstTime"
        />
      </v-col>
      <v-col cols="12" lg="9">
        <panel-result
          :help="showHelp"
          @help="handleHelp"
          :loading="searchingPanels"
          :parsedGenes="formattedGenes"
          :panelSearchResults="panelSearchResults"
        />
        <panel-compare
          :help="showHelp"
          @help="handleHelp"
          :loading="searchingPanels"
          :parsedGenes="formattedGenes"
          :panelSearchResults="panelSearchResults"
        />
      </v-col>
      <v-col cols="12" lg="6">
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

<script lang="ts">
import Vue from 'vue'
import UserInput from '@/components/home/UserInput.vue'
import ParsedInput from '@/components/home/ParsedInput.vue'
import PanelResult from '@/components/home/PanelResult.vue'
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import { mapGetters, mapActions } from 'vuex'
import { PanelSearchResult, ParsedGenes } from '@/types/panel-types'
import PanelCompare from '@/components/home/PanelCompare.vue'

export default Vue.extend({
  name: 'HomePage',
  components: {
    UserInput,
    ParsedInput,
    PanelResult,
    PanelCompare,
  },
  data() {
    return {
      showHelp: false,
      parsingGenes: false,
      searchingPanels: false,
      formattedGenes: new ParsedGenes(),
      panelSearchResults: new Array<PanelSearchResult>(),
      firstTime: false,
    }
  },
  methods: {
    ...mapActions(['parseUserGenes', 'findGenesInAllPanels']),
    handleHelp() {
      this.showHelp = !this.showHelp
      this.firstTime = false
    },
    handleFirstTime() {
      let decodedCookie = decodeURIComponent(document.cookie)
      if (decodedCookie.indexOf('firstTime') == -1) {
        //cookie doesn't exist
        document.cookie = 'firstTime=false'
        setTimeout(() => {
          this.firstTime = true
        }, 5000) //display 3 sec after loading
      }
    },
  },
  computed: {
    ...mapGetters({}),
  },
  watch: {},
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
        this.searchingPanels = false
      } else if (event.data.todo == 'cleanUserInput') {
        this.parseUserGenes(event.data.userGeneList)
      }
    }
  },
})
</script>

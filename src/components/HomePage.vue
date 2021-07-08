<template>
  <v-container fluid class="mt-2">
    <v-row class="text-center" dense>
      <v-col cols="12" lg="3">
        <user-input
          :help="showHelp"
          @help="showHelp = !showHelp"
          @userInputDone="postWorkerParseUserGenes"
        />
      </v-col>
      <v-col cols="12" lg="9">
        <panel-result
          :help="showHelp"
          @help="showHelp = !showHelp"
          :loading="searchingPanels"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <parsed-input
          :help="showHelp"
          @help="showHelp = !showHelp"
          :loading="parsingGenes"
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

export default Vue.extend({
  name: 'HomePage',
  components: {
    UserInput,
    ParsedInput,
    PanelResult,
  },
  data() {
    return {
      showHelp: false,
      parsingGenes: false,
      searchingPanels: false,
    }
  },
  methods: {
    ...mapActions(['setParsedGenes', 'setPanelSearchResult']),
    postWorkerParseUserGenes() {
      this.parsingGenes = true
      $getFindGenesWorker().postMessage({
        init: false,
        todo: 'parseUserGenes',
        userGenes: this.userGenes,
      })
    },
    postWorkerFindGenesInAllPanels() {
      this.searchingPanels = true
      $getFindGenesWorker().postMessage({
        init: false,
        todo: 'findGenesInAllPanels',
        parsedGenes: this.parsedGenes,
        panels: this.panels,
      })
    },
  },
  computed: {
    ...mapGetters({
      panels: 'getPanels',
      userGenes: 'getUserGenes',
      parsedGenes: 'getParsedGenes',
    }),
  },
  watch: {},
  mounted() {
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'parseUserGenes') {
        this.setParsedGenes(event.data.parsedGenes).then(() => {
          this.postWorkerFindGenesInAllPanels()
          this.parsingGenes = false
        })
      } else if (event.data.todo == 'findGenesInAllPanels') {
        this.setPanelSearchResult(event.data.genesInAllPanels).then(() => {
          this.searchingPanels = false
        })
      }
    }
  },
})
</script>

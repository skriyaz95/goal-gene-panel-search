<template>
  <v-container fluid class="mt-2">
    <v-row class="text-center" dense>
      <v-col cols="12" lg="3">
        <user-input :help="showHelp" @help="showHelp = !showHelp" />
      </v-col>
      <v-col cols="12" lg="9">
        <panel-result
          :help="showHelp"
          @help="showHelp = !showHelp"
          :loading="searchingPanels"
          :parsedGenes="formattedGenes"
          :panelSearchResults="panelSearchResults"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <parsed-input
          ref="parsedInput"
          :help="showHelp"
          @help="showHelp = !showHelp"
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
      formattedGenes: new ParsedGenes(),
      panelSearchResults: new Array<PanelSearchResult>(),
    }
  },
  methods: {
    ...mapActions(['parseUserGenes', 'findGenesInAllPanels']),
  },
  computed: {
    ...mapGetters({}),
  },
  watch: {},
  mounted() {
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

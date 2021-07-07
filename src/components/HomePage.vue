<template>
  <v-container
    fluid
    class="mt-2"
  >
    <v-row
      class="text-center"
      dense
    >
      <v-col
        cols="12"
        lg="3"
      >
        <user-input @postFindAllGenesMessage="postFindAllGenesMessage($event)"/>
      </v-col>
      <v-col
        cols="12"
        lg="9"
      >
        <panel-result />
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <parsed-input />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import UserInput from '@/components/home/UserInput.vue'
import ParsedInput from '@/components/home/ParsedInput.vue'
import PanelResult from '@/components/home/PanelResult.vue'
import $getFindGenesWorker from "@/utils/workers/worker-instance";
import {Gene} from "@/types/panel-types";
import {mapGetters} from "vuex";

export default Vue.extend({
  name: 'HomePage',
  components: {
    UserInput,
    ParsedInput,
    PanelResult,
  },
  methods: {
    postFindAllGenesMessage(userGenes: Gene[]) {
      $getFindGenesWorker().postMessage({
        init: false,
        todo: 'findAllGenes',
        userGenes: userGenes,
      })
    },
    postFindGenesInAllPanels() {
      $getFindGenesWorker().postMessage({
        init: false,
        todo: 'findGenesInAllPanels',
        parsedGenes: this.parsedGenes,
        panels: this.panels
      })
    }
  },
  computed: {
    ...mapGetters({
      panels: 'getPanels',
      parsedGenes: 'getParsedGenes'
    }),
  },
  watch: {
    parsedGenes: 'postFindGenesInAllPanels'
  },
  mounted() {
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'findAllGenes') {
        this.$store.commit('setParsedGenes', event.data.parsedGenes)
      }else if (event.data.todo == 'findGenesInAllPanels') {
        this.$store.commit('setPanelSearchResult', event.data.genesInAllPanels)
      }
    }
  },
})
</script>

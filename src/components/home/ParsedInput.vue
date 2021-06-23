<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('parseInput.title.text') }}
    </v-card-title>
    <v-card-text>
      <div>
        <div>Not Found:</div>
        <v-chip
          v-for="gene in formattedGenes.notFoundGenes"
          :key="gene.gene.name"
          class="ma-1"
          :color="formatState(gene.state)"
        >
          {{ gene.gene.name }}
        </v-chip>
      </div>
      <div>
        <div>Synonyms:</div>
        <v-chip
          v-for="gene in formattedGenes.synonymFoundGenes"
          :key="gene.gene.name"
          class="ma-1"
          :color="formatState(gene.state)"
        >
          {{ gene.gene.name }}
        </v-chip>
      </div>
      <div>
        <div>Symbols:</div>
        <v-chip
          v-for="gene in formattedGenes.symbolFoundGenes"
          :key="gene.gene.name"
          class="ma-1"
          :color="formatState(gene.state)"
        >
          {{ gene.gene.name }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { ParsedGenes } from '@/types/panel-types'

export default Vue.extend({
  name: 'ParsedInput',
  data: () => ({
    formattedGenes: new ParsedGenes(),
    findGenesWorker: {} as Worker,
  }),
  computed: {
    ...mapGetters({
      userGenes: 'getUserGenesSorted',
      allGenes: 'getAllGenes',
      allGeneMap: 'getAllGeneMap',
      synonymMap: 'getSynonymMap',
    }),
  },
  watch: {
    userGenes: 'formatGenes',
  },
  methods: {
    formatState(state: string) {
      if (state == 'symbol') {
        return 'success'
      }
      if (state == 'synonym') {
        return 'warning'
      }
      return 'error'
    },
    formatGenes() {
      this.findGenesWorker.postMessage({
        init: false,
        userGenes: this.userGenes,
      })
    },
    initWorkers() {
      this.findGenesWorker = new Worker(
        '@/utils/workers/find-gene-webworker.ts',
        {
          type: 'module',
        }
      )
      console.log(this.synonymMap)
      this.findGenesWorker.postMessage({
        init: true,
        allGeneMap: this.allGeneMap,
        synonymMap: this.synonymMap,
      })
      // console.log('before onmessage')
      this.findGenesWorker.onmessage = (event: any) => {
        console.log("I'm back")
        this.formattedGenes = event.data.parsedGenes
      }
    },
  },
  mounted() {
    this.initWorkers()
  },
  destroyed() {
    this.findGenesWorker.terminate()
  },
})
</script>

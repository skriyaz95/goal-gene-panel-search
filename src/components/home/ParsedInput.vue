<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('parseInput.title.text') }}:
      <span v-if="userGenes.length > 0" class="ml-3">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" color="error" class="ml-1 mr-1">
              {{ $t('parseInput.notFound.text') }} ({{
                $tc('count.gene', $n(formattedGenes.notFoundGenes.length))
              }})
            </v-chip>
          </template>
          <span>{{ $t('parseInput.notFound.tooltip') }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" color="warning" class="ml-1 mr-1">
              {{ $t('parseInput.synonyms.text') }} ({{
                $tc('count.gene', $n(formattedGenes.synonymFoundGenes.length))
              }})
            </v-chip>
          </template>
          <span>{{ $t('parseInput.synonyms.tooltip') }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip v-on="on" color="success" class="ml-1 mr-1">
              {{ $t('parseInput.symbols.text') }} ({{
                $tc('count.gene', $n(formattedGenes.symbolFoundGenes.length))
              }})
            </v-chip>
          </template>
          <span>{{ $t('parseInput.symbols.tooltip') }}</span>
        </v-tooltip>
      </span>
    </v-card-title>
    <v-card-text>
      <div v-if="userGenes.length == 0">
        {{ $t('parseInput.empty.text') }}
      </div>
      <div v-else>
        <div>
          <div>{{ $t('parseInput.notFound.text') }}:</div>
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
          <div>{{ $t('parseInput.synonyms.text') }}:</div>
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
          <div>{{ $t('parseInput.symbols.text') }}:</div>
          <v-chip
            v-for="gene in formattedGenes.symbolFoundGenes"
            :key="gene.gene.name"
            class="ma-1"
            :color="formatState(gene.state)"
          >
            {{ gene.gene.name }}
          </v-chip>
        </div>
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
      this.findGenesWorker.postMessage({
        init: true,
        allGeneMap: this.allGeneMap,
        synonymMap: this.synonymMap,
      })
      this.findGenesWorker.onmessage = (event: any) => {
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

<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('parseInput.title.text') }}:
      <span v-if="userGenes.length > 0" class="ml-3">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip color="error" class="ml-1 mr-1" v-on="on">
              {{ $t('parseInput.notFound.text') }} ({{
                $tc('count.gene', $n(formattedGenes.notFoundGenes.length))
              }})
            </v-chip>
          </template>
          <span>{{ $t('parseInput.notFound.tooltip') }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip color="warning" class="ml-1 mr-1" v-on="on">
              {{ $t('parseInput.synonyms.text') }} ({{
                $tc('count.gene', $n(formattedGenes.synonymFoundGenes.length))
              }})
            </v-chip>
          </template>
          <span>{{ $t('parseInput.synonyms.tooltip') }}</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-chip color="success" class="ml-1 mr-1" v-on="on">
              {{ $t('parseInput.symbols.text') }} ({{
                $tc('count.gene', $n(formattedGenes.symbolFoundGenes.length))
              }})
            </v-chip>
          </template>
          <span>{{ $t('parseInput.symbols.tooltip') }}</span>
        </v-tooltip>
      </span>
      <v-spacer></v-spacer>
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
    </v-card-title>
    <v-card-text>
      <div v-if="userGenes.length == 0">
        {{ $t('parseInput.empty.text') }}
      </div>
      <div v-else>
        <parsed-list-item
          color="error"
          :items="formattedGenes.notFoundGenes"
          :title="$t('parseInput.notFound.text')"
        />
        <parsed-list-item
          color="warning"
          :items="formattedGenes.synonymFoundGenes"
          :title="$t('parseInput.synonyms.text')"
        />
        <parsed-list-item
          color="success"
          :items="formattedGenes.symbolFoundGenes"
          :title="$t('parseInput.symbols.text')"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { ParsedGenes } from '@/types/panel-types'
import ParsedListItem from './ParsedListItem.vue'

export default Vue.extend({
  components: { ParsedListItem },
  name: 'ParsedInput',
  data: () => ({
    formattedGenes: new ParsedGenes(),
    findGenesWorker: {} as Worker,
    loading: false,
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
  mounted() {
    this.initWorkers()
  },
  destroyed() {
    this.findGenesWorker.terminate()
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
        '@/utils/workers/find-gene-webworker.js',
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
    showChips(length: number) {
      return length < 1000
    },
  },
})
</script>

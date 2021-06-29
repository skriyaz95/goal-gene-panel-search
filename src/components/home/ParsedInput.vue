<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('parseInput.title.text') }}
      <v-fade-transition>
        <span v-if="userGenes.length > 0" class="ml-3">
          <v-tooltip bottom v-if="showNotFound">
            <template v-slot:activator="{ on }">
              <v-chip color="error" class="ml-1 mr-1" v-on="on">
                {{ $t('parseInput.notFound.text') }} ({{
                  $tc('count.gene', $n(formattedGenes.notFoundGenes.length))
                }})
              </v-chip>
            </template>
            <span>{{ $t('parseInput.notFound.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showSynonym">
            <template v-slot:activator="{ on }">
              <v-chip color="warning" class="ml-1 mr-1" v-on="on">
                {{ $t('parseInput.synonyms.text') }} ({{
                  $tc(
                    'count.gene',
                    $n(formattedGenes.synonymFoundGenes.length)
                  )
                }})
              </v-chip>
            </template>
            <span>{{ $t('parseInput.synonyms.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showSymbol">
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
      </v-fade-transition>
      <v-spacer></v-spacer>
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
    </v-card-title>
    <v-card-text>
      <div v-if="userGenes.length == 0">
        {{ $t('parseInput.empty.text') }}
      </div>
      <v-fade-transition>
        <div v-if="userGenes.length != 0">
          <parsed-list-item
            v-if="showNotFound"
            color="error"
            :items="formattedGenes.notFoundGenes"
            :title="$t('parseInput.notFound.text')"
            class="pb-2"
          />
          <parsed-list-item
            v-if="showSynonym"
            color="warning"
            :items="formattedGenes.synonymFoundGenes"
            :title="$t('parseInput.synonyms.text')"
            :synonym="true"
            class="pb-2"
          />
          <parsed-list-item
            v-if="showSymbol"
            color="success"
            :items="formattedGenes.symbolFoundGenes"
            :title="$t('parseInput.symbols.text')"
          />
        </div>
      </v-fade-transition>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { ParsedGenes } from '@/types/panel-types'
import ParsedListItem from '@/components/home/ParsedListItem.vue'
import $getFindGenesWorker from '@/utils/workers/worker-instance'

export default Vue.extend({
  components: { ParsedListItem },
  name: 'ParsedInput',
  data: () => ({
    formattedGenes: new ParsedGenes(),
    loading: false, //processing seems too fast to need a loading state ATM
  }),
  computed: {
    ...mapGetters({
      userGenes: 'getUserGenesSorted',
      allGenes: 'getAllGenes',
    }),
    showNotFound(): boolean {
      return this.formattedGenes.notFoundGenes.length > 0
    },
    showSynonym(): boolean {
      return this.formattedGenes.synonymFoundGenes.length > 0
    },
    showSymbol(): boolean {
      return this.formattedGenes.symbolFoundGenes.length > 0
    },
  },
  watch: {
    userGenes: 'formatGenes',
  },
  mounted() {
    $getFindGenesWorker().onmessage = (event: any) => {
      if (event.data.todo == 'findAllGenes') {
        this.formattedGenes = event.data.parsedGenes
        // this.loading = false
      }
    }
  },
  destroyed() {},
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
      // this.loading = true
      $getFindGenesWorker().postMessage({
        init: false,
        todo: 'findAllGenes',
        userGenes: this.userGenes,
      })
    },
  },
})
</script>

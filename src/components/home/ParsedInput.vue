<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('parsedInput.title.text') }}
      <v-fade-transition>
        <span v-if="userGenes.length > 0" class="ml-3">
          <v-tooltip bottom v-if="showNotFound">
            <template v-slot:activator="{ on }">
              <v-chip color="error" class="ml-1 mr-1" v-on="on">
                {{ $t('parsedInput.notFound.text') }} ({{
                  $tc('count.gene', $n(formattedGenes.notFoundGenes.length))
                }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.notFound.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showSynonym">
            <template v-slot:activator="{ on }">
              <v-chip color="warning" class="ml-1 mr-1" v-on="on">
                {{ $t('parsedInput.synonyms.text') }} ({{
                  $tc(
                    'count.gene',
                    $n(formattedGenes.synonymFoundGenes.length)
                  )
                }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.synonyms.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showSymbol">
            <template v-slot:activator="{ on }">
              <v-chip color="success" class="ml-1 mr-1" v-on="on">
                {{ $t('parsedInput.symbols.text') }} ({{
                  $tc('count.gene', $n(formattedGenes.symbolFoundGenes.length))
                }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.symbols.tooltip') }}</span>
          </v-tooltip>
        </span>
      </v-fade-transition>
      <v-spacer></v-spacer>
      <v-progress-circular v-if="loading" indeterminate></v-progress-circular>
      <help-button @action="handleHelp()" :active="help">
        <template v-slot:content>
          <parsed-search-help />
        </template>
      </help-button>
    </v-card-title>
    <v-card-text class="text-left">
      <info-alert :active="help">
        <template v-slot:content>
          <parsed-search-help />
        </template>
      </info-alert>
      <div v-if="userGenes.length == 0">
        {{ $t('parsedInput.empty.text') }}
      </div>
      <v-fade-transition>
        <div v-if="userGenes.length != 0">
          <gene-parsed-content
            :show-genes="[showNotFound, showSynonym, showSymbol]"
            :parsed-genes="formattedGenes"
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
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import GeneParsedContent from '@/components/GeneParsedContent.vue'
import ParsedSearchHelp from '@/components/help/ParsedSearchHelp.vue'
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'

export default Vue.extend({
  components: { GeneParsedContent, ParsedSearchHelp, HelpButton, InfoAlert },
  name: 'ParsedInput',
  props: {
    help: {
      type: Boolean,
      default: false,
    },
  },
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
        this.formattedGenes = new ParsedGenes()
        this.formattedGenes.notFoundGenes = event.data.parsedGenes.notFoundGenes
        this.formattedGenes.synonymFoundGenes =
          event.data.parsedGenes.synonymFoundGenes
        this.formattedGenes.symbolFoundGenes =
          event.data.parsedGenes.symbolFoundGenes
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
    handleHelp() {
      this.$emit('help')
    },
  },
})
</script>

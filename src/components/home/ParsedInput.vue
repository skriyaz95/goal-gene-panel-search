<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('parsedInput.title.text') }}
      <v-spacer></v-spacer>
      <help-button @action="handleHelp()" :active="help">
        <template v-slot:content>
          <span>
            {{ $t('button.showHide.tooltip') }}
            {{ $t('button.help.text') }}
          </span>
        </template>
      </help-button>
    </v-card-title>
    <v-card-text class="text-left">
      <info-alert :active="help">
        <template v-slot:content>
          <parsed-search-help />
        </template>
      </info-alert>
      <v-fade-transition>
        <span class="text-xs-left" v-show="showAny">
          <v-tooltip bottom v-show="showNotFound">
            <template v-slot:activator="{ on }">
              <v-chip color="error" class="ml-1 mr-1 mb-1" v-on="on">
                {{ $t('parsedInput.notFound.text') }} ({{
                  $tc('count.gene', $n(formattedGenes.notFoundGenes.length))
                }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.notFound.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-show="showSynonym">
            <template v-slot:activator="{ on }">
              <v-chip color="warning" class="ml-1 mr-1 mb-1" v-on="on">
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
          <v-tooltip bottom v-show="showSymbol">
            <template v-slot:activator="{ on }">
              <v-chip color="success" class="ml-1 mr-1 mb-1" v-on="on">
                {{ $t('parsedInput.symbols.text') }} ({{
                  $tc('count.gene', $n(formattedGenes.symbolFoundGenes.length))
                }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.symbols.tooltip') }}</span>
          </v-tooltip>
        </span>
      </v-fade-transition>
      <div v-show="noData">
        {{ $t('parsedInput.empty.text') }}
      </div>
      <v-fade-transition>
        <div v-show="showAny">
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
    loading: {
      type: Boolean,
      default: false,
    },
    formattedGenes: {
      type: ParsedGenes,
    },
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      // userGenes: 'getUserGenesSorted',
      // parsedGenes: 'getParsedGenes',
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
    showAny(): boolean {
      return this.showNotFound || this.showSynonym || this.showSymbol
    },
    noData(): boolean {
      return !this.showNotFound && !this.showSynonym && !this.showSymbol
    },
  },
  watch: {
    // parsedGenes: 'formatGenes',
  },
  destroyed() {},
  methods: {
    handleHelp() {
      this.$emit('help')
    },
  },
})
</script>

<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('parsedInput.title.text') }}
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            :disabled="noData"
            icon
            @click="downloadParsedSearch"
          >
            <v-icon>mdi-download </v-icon>
          </v-btn>
        </template>
        <span>{{ $t('button.download.tooltip') }}</span>
      </v-tooltip>
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
          <span v-show="showInvalid">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
                  :outlined="chipOutlined"
                  :color="invalidColor"
                  class="ml-1 mr-1 mb-1"
                  v-on="on"
                >
                  {{ $t('parsedInput.invalid.text') }} ({{
                    $tc('count.gene', $n(formattedGenes.invalidGenes.length))
                  }})
                </v-chip>
              </template>
              <span>{{ $t('parsedInput.invalid.tooltip') }}</span>
            </v-tooltip>
          </span>
          <span v-show="showSynonym">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
                  :outlined="chipOutlined"
                  :color="synonymColor"
                  class="ml-1 mr-1 mb-1"
                  v-on="on"
                >
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
          </span>
          <span v-show="showSymbol">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
                  :outlined="chipOutlined"
                  :color="symbolColor"
                  class="ml-1 mr-1 mb-1"
                  v-on="on"
                >
                  {{ $t('parsedInput.symbols.text') }} ({{
                    $tc(
                      'count.gene',
                      $n(formattedGenes.symbolFoundGenes.length)
                    )
                  }})
                </v-chip>
              </template>
              <span>{{ $t('parsedInput.symbols.tooltip') }}</span>
            </v-tooltip>
          </span>
          <span v-show="showFusion">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
                  :outlined="chipOutlined"
                  :color="fusionColor"
                  class="ml-1 mr-1 mb-1"
                  v-on="on"
                >
                  {{ $t('parsedInput.fusions.text') }} ({{
                    $tc(
                      'count.gene',
                      $n(formattedGenes.fusionFoundGenes.length)
                    )
                  }})
                </v-chip>
              </template>
              <span>{{ $t('parsedInput.fusions.tooltip') }}</span>
            </v-tooltip>
          </span>
          <span v-show="showIntron">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-chip
                  :outlined="chipOutlined"
                  :color="intronColor"
                  class="ml-1 mr-1 mb-1"
                  v-on="on"
                >
                  {{ $t('parsedInput.introns.text') }} ({{
                    $tc(
                      'count.gene',
                      $n(formattedGenes.intronFoundGenes.length)
                    )
                  }})
                </v-chip>
              </template>
              <span>{{ $t('parsedInput.introns.tooltip') }}</span>
            </v-tooltip>
          </span>
        </span>
      </v-fade-transition>
      <div v-show="noData">
        {{ $t('parsedInput.empty.text') }}
      </div>
      <v-fade-transition>
        <div v-show="showAny">
          <gene-parsed-content
            :show-genes="[
              showInvalid,
              showSynonym,
              showSymbol,
              showFusion,
              showIntron,
            ]"
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
import download from '@/utils/download'
import Papa from 'papaparse'
import { transpose } from '@/utils/arrays'
import { GeneState } from '@/types/ui-types'
import { formatStateColor } from '@/utils/formatting'

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
      chipOutlined: 'getChipOutlined',
    }),
    showInvalid(): boolean {
      return this.formattedGenes.invalidGenes.length > 0
    },
    showSynonym(): boolean {
      return this.formattedGenes.synonymFoundGenes.length > 0
    },
    showSymbol(): boolean {
      return this.formattedGenes.symbolFoundGenes.length > 0
    },
    showFusion(): boolean {
      return this.formattedGenes.fusionFoundGenes.length > 0
    },
    showIntron(): boolean {
      return this.formattedGenes.intronFoundGenes.length > 0
    },
    showAny(): boolean {
      return (
        this.showInvalid ||
        this.showSynonym ||
        this.showSymbol ||
        this.showFusion ||
        this.showIntron
      )
    },
    noData(): boolean {
      return (
        !this.showInvalid &&
        !this.showSynonym &&
        !this.showSymbol &&
        !this.showFusion &&
        !this.showIntron
      )
    },
    invalidColor() {
      return formatStateColor(GeneState.INVALID)
    },
    symbolColor() {
      return formatStateColor(GeneState.SYMBOL)
    },
    synonymColor() {
      return formatStateColor(GeneState.SYNONYM)
    },
    fusionColor() {
      return formatStateColor(GeneState.FUSION)
    },
    intronColor() {
      return formatStateColor(GeneState.INTRON)
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
    downloadParsedSearch() {
      const headers = [
        this.$t('parsedInput.invalid.text').toString(),
        this.$t('parsedInput.synonyms.text').toString(),
        this.$t('parsedInput.symbols.text').toString(),
        this.$t('parsedInput.fusions.text').toString(),
        this.$t('parsedInput.introns.text').toString(),
      ]
      const columns = [
        this.formattedGenes.invalidGenes.map((pg) => pg.gene.name),
        this.formattedGenes.synonymFoundGenes.map((pg) => pg.gene.name),
        this.formattedGenes.symbolFoundGenes.map((pg) => pg.gene.name),
        this.formattedGenes.fusionFoundGenes.map((pg) => pg.gene.name),
        this.formattedGenes.intronFoundGenes.map((pg) => pg.gene.name),
      ]
      const transposed = transpose(columns)

      // const csv = new CSVContent(headers, columns)
      const csv = Papa.unparse({
        fields: headers,
        data: transposed,
      })
      download('parsed_search.csv', csv, 'text/csv')
    },
  },
})
</script>

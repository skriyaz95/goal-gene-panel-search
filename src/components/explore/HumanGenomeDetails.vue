<template>
  <main-content-template :twoCols="false" inner>
    <template v-slot:one-col>
      <v-card outlined>
        <v-card-title>
          <span class="mr-2">{{ $t('explore.genome.title.text') }}</span>
          <v-tooltip bottom class="mr-2">
            <template v-slot:activator="{ on }">
              <v-btn
                text
                class="primary--text"
                v-on="on"
                :href="ncbiGeneURL"
                target="_blank"
              >
                {{ $t('explore.genome.genelink.text') }}
                <v-icon right>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
            <span> {{ $t('explore.genome.genelink.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom class="mr-2">
            <template v-slot:activator="{ on }">
              <v-btn
                text
                class="primary--text"
                v-on="on"
                :href="ncbiGeneInfoURL"
                target="_blank"
              >
                {{ $t('explore.genome.geneinfoSource.text') }}
                <v-icon right>mdi-open-in-new</v-icon>
              </v-btn>
            </template>
            <span> {{ $t('explore.genome.geneinfoSource.tooltip') }}</span>
          </v-tooltip>
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            :label="$t('explore.genome.search.text')"
            single-line
            hide-details
            clearable
          >
          </v-text-field>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="allGenes"
            :search="debouncedSearch"
          >
          </v-data-table>
        </v-card-text>
      </v-card>
    </template>
  </main-content-template>
</template>

<script lang="ts">
import Vue from 'vue'
import debounce from '@/utils/debounce'
import { NCBI_GENE_URL, NCBI_GENE_INFO_FILE_URL } from '@/utils/apis'
import allGenesData from '@/assets/all_genes.json'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import { GeneState } from '@/types/ui-types'

export default Vue.extend({
  components: { MainContentTemplate },
  name: 'HumanGenomeDetails',
  props: {},
  data() {
    return {
      headers: [
        { text: 'Symbol', value: GeneState.SYMBOL },
        { text: 'HGNC ID', value: 'hgncId' },
        { text: 'ENSEMBL ID', value: 'ensemblId' },
        { text: 'Synonyms', value: 'synonyms' },
        { text: 'Loci', value: 'loci' },
      ],
      search: '',
      debouncedSearch: '',
      ncbiGeneURL: NCBI_GENE_URL,
      ncbiGeneInfoURL: NCBI_GENE_INFO_FILE_URL,
    }
  },
  computed: {
    allGenes() {
      return allGenesData
    },
  },
  methods: {},
  watch: {
    search: debounce(function (this: any, value: string) {
      this.debouncedSearch = value
    }, 500),
  },
  mounted() {},
})
</script>

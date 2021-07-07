<template>
  <v-container fluid>
    <v-card>
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
  </v-container>
</template>

<script lang="ts">
// import { GenePanel } from '@/types/panel-types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import debounce from '@/utils/debounce'
import { NCBI_GENE_URL, NCBI_GENE_INFO_FILE_URL } from '@/utils/apis'

export default Vue.extend({
  components: {},
  name: 'HumanGenomeDetails',
  props: {},
  data() {
    return {
      headers: [
        { text: 'Symbol', value: 'symbol' },
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
    ...mapGetters({
      allGenes: 'getAllGenes',
    }),
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

/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        lg="4"
      >
        <v-card>
          <v-card-title>{{ $t('build-database.title.text') }}:</v-card-title>
          <v-card-text>
            <div>
              {{ $t('build-database.step.text') }} 1:
              {{ $t('build-database.download.title.text') }}:
              <v-btn
                :href="sourceFileUrl"
                target="_blank"
                icon
                class="primary--text"
              >
                <v-icon>mdi-open-in-new</v-icon>
              </v-btn>
            </div>
            <v-row align="center">
              <v-col md="auto">
                {{ $t('build-database.step.text') }} 2:
              </v-col>
              <v-col>
                <v-file-input
                  v-model="geneFile"
                  accept=".gene_info"
                  label="Upload Gene Info File"
                  show-size
                  @change="handleFileUpload"
                />
              </v-col>
              <v-col md="auto">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      icon
                      class="primary--text"
                      :disabled="allGenes.length == 0"
                      :loading="loading"
                      v-on="on"
                      @click="downloadGenes"
                    >
                      <v-icon>mdi-content-save</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t('button.saveAllGenes.tootip') }}</span>
                </v-tooltip>
              </v-col>
            </v-row>
            <div>
              {{ $t('build-database.step.text') }} 3:
              {{ $t('build-database.replace.title.text') }}
              <span v-show="allGenes.length != 0">
                ({{ $tc('count.gene', $n(allGenes.length)) }})
              </span>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { FullGene, SynonymGene } from '@/types/panel-types'
import Vue from 'vue'
// import axios from 'axios'
import { mapGetters } from 'vuex'
// import { Gene, GenePanel, PanelPayload } from '@/types/panel-types'
import download from '@/utils/download'
import { formatObjetToJson } from '@/utils/download'

export default Vue.extend({
  name: 'BuildDatabase',

  data: () => ({
    sourceFileUrl:
      'https://ftp.ncbi.nih.gov/gene/DATA/GENE_INFO/Mammalia/Homo_sapiens.gene_info.gz',
    rawDir: 'raw_panels/',
    sourceDir: 'source_panels/',
    publicPath: process.env.BASE_URL,
    geneFile: null,
    linebreak: /\r?\n|\r/g,
    headerSymbol: 'Symbol',
    headerSynonyms: 'Synonyms',
    headerDBIds: 'dbXrefs',
    headerLoci: 'map_location',
    hgncRegex: /[.]*HGNC:HGNC:([0-9]+)/,
    ensemblRegex: /[.]*Ensembl:([A-Z0-9]+)/,
    invalidSymbolCharacters: /[^A-Z0-9]+/,
    allGenes: new Array<FullGene>(),
    loading: false,
    synonyms: new Array<SynonymGene>(),
  }),
  methods: {
    handleFileUpload() {
      if (!this.geneFile) {
        return
      }
      this.loading = true
      var fr = new FileReader()
      fr.readAsText(this.geneFile as any)
      fr.onload = () => {
        this.parseGeneInfoContent(fr.result as string)
      }
    },
    parseGeneInfoContent(content: string) {
      var rows = content.split(this.linebreak)
      var headers = rows[0].split('\t')
      var headerByRowNb = new Map<String, number>()
      var genes = new Array<FullGene>()
      for (let i = 0; i < headers.length; i++) {
        headerByRowNb.set(headers[i], i)
      }
      for (let i = 1; i < rows.length; i++) {
        var items = rows[i].split('\t')
        var symbolItem = items[headerByRowNb.get(this.headerSymbol) as number]
        var symbol = ''
        if (symbolItem) {
          symbol = symbolItem.toUpperCase()
        }
        if (!symbol || this.invalidSymbolCharacters.test(symbol)) {
          continue //skip symbols with non alphanumeric characters
        }
        var synonymString =
          items[headerByRowNb.get(this.headerSynonyms) as number]
        var synonyms = new Array<string>()
        if (synonymString) {
          synonyms = items[headerByRowNb.get(this.headerSynonyms) as number]
            .split('|')
            .map((s) => s.toUpperCase())
        }
        var dbIds = items[headerByRowNb.get(this.headerDBIds) as number]
        if (!dbIds) {
          continue //skip if no dbIds
        }
        var hgncFound = dbIds.match(this.hgncRegex)
        let hgncId = ''
        if (hgncFound) {
          hgncId = hgncFound[1]
        }
        if (symbol && hgncId) {
          //only valid genes
          var ensemblFound = dbIds.match(this.ensemblRegex)
          let ensemblId = ''
          if (ensemblFound) {
            ensemblId = ensemblFound[1]
          }
          var loci = items[headerByRowNb.get(this.headerLoci) as number]
          var gene = new FullGene(symbol, hgncId, synonyms, loci, ensemblId)
          genes.push(gene)
        }
      }
      this.allGenes = genes
      this.createSynonyms()
      this.loading = false
    },
    createSynonyms() {
      const synonyms = new Array<SynonymGene>()
      for (let i = 0; i < this.allGenes.length; i++) {
        var currentGene = this.allGenes[i]
        for (let j = 0; j < currentGene.synonyms.length; j++) {
          synonyms.push(new SynonymGene(currentGene.synonyms[j], currentGene))
        }
      }
      this.synonyms = synonyms
    },
    downloadGenes() {
      if (!this.allGenes) {
        return
      }
      const filename_genes = 'all_genes.json'
      download(
        filename_genes,
        formatObjetToJson(this.allGenes, false),
        'text/json'
      )

      const filename_synonyms = 'synonyms.json'
      download(
        filename_synonyms,
        formatObjetToJson(this.synonyms, false),
        'text/json'
      )
    },
  },
  computed: {
    ...mapGetters({
      tempPanels: 'getTempPanels',
      panels: 'getPanels',
    }),
  },
  mounted() {},
})
</script>

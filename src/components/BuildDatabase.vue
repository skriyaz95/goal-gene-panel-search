/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="3">
        <v-card>
          <v-card-title>Update Gene Reference Database:</v-card-title>
          <v-card-text>
            <div>
              Step 1: Download and unzip this file:
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
              <v-col md="auto">Step 2:</v-col>
              <v-col>
                <v-file-input
                  accept=".gene_info"
                  @change="handleFileUpload"
                  label="Upload Gene Info File"
                  show-size
                  v-model="geneFile"
                ></v-file-input>
              </v-col>
              <v-col md="auto">
                <v-btn
                  @click="downloadGenes"
                  icon
                  class="primary--text"
                  :disabled="allGenes.length == 0"
                  :loading="loading"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { FullGene } from '@/types/panel-types'
import Vue from 'vue'
// import axios from 'axios'
import { mapGetters } from 'vuex'
// import { Gene, GenePanel, PanelPayload } from '@/types/panel-types'

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
    allGenes: new Array<FullGene>(),
    loading: false,
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
        var symbol = items[headerByRowNb.get(this.headerSymbol) as number]
        var synonymString =
          items[headerByRowNb.get(this.headerSynonyms) as number]
        var synonyms = new Array<string>()
        if (synonymString) {
          synonyms =
            items[headerByRowNb.get(this.headerSynonyms) as number].split('|')
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
      this.loading = false
    },
    downloadGenes() {
      if (!this.allGenes) {
        return
      }
      console.log('downloading', this.allGenes.length, 'genes')
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

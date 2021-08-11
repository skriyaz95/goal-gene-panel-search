/* eslint-disable vue/html-indent */
<template>
  <main-content-template inner>
    <template v-slot:left-col>
      <v-card outlined>
        <v-card-title>
          {{ $t('build-database.title.text') }}:
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
        <v-card-text>
          <info-alert :active="help">
            <template v-slot:content>
              <database-help />
            </template>
          </info-alert>
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
            <v-col md="auto"> {{ $t('build-database.step.text') }} 2: </v-col>
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
    </template>
  </main-content-template>
</template>

<script lang="ts">
import { FullGene, SynonymGene } from '@/types/panel-types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import download, { formatObjetToJson } from '@/utils/download'
import { NCBI_GENE_INFO_FILE_URL } from '@/utils/apis'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import DatabaseHelp from '../help/DatabaseHelp.vue'

export default Vue.extend({
  name: 'BuildDatabase',
  components: { MainContentTemplate, HelpButton, InfoAlert, DatabaseHelp },
  data: () => ({
    sourceFileUrl: NCBI_GENE_INFO_FILE_URL,
    geneFile: null,
    linebreak: /\r?\n|\r/g,
    headerSymbol: 'Symbol',
    headerSynonyms: 'Synonyms',
    headerDBIds: 'dbXrefs',
    headerLoci: 'map_location',
    hgncRegex: /[.]*HGNC:HGNC:([0-9]+)/,
    ensemblRegex: /[.]*Ensembl:([A-Z0-9]+)/,
    // invalidSymbolCharacters: /[^A-Z0-9-]+/,
    validSymbolCharacters: /[A-Z0-9-]{2,}/,
    emptyFieldPattern: '-',
    allGenes: new Array<FullGene>(),
    loading: false,
    synonyms: new Array<SynonymGene>(),
    help: false,
  }),
  methods: {
    handleHelp() {
      this.$emit('help')
      this.help = !this.help
    },
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
        if (!symbol || !this.validSymbolCharacters.test(symbol)) {
          continue //skip symbols with non alphanumeric characters
        }
        var synonymString =
          items[headerByRowNb.get(this.headerSynonyms) as number]
        var synonyms = new Array<string>()
        if (synonymString && synonymString != this.emptyFieldPattern) {
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
        if (symbol && hgncId && hgncId != this.emptyFieldPattern) {
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
      const alreadySeenNames = new Set<String>()
      const synonyms = new Array<SynonymGene>()
      for (let i = 0; i < this.allGenes.length; i++) {
        const fullGene = this.allGenes[i]
        //make a copy of fullGene
        const currentGene = JSON.parse(JSON.stringify(fullGene))
        currentGene.synonyms = [] //remove synonyms to keep object small
        for (let j = 0; j < fullGene.synonyms.length; j++) {
          const synonym = fullGene.synonyms[j]
          if (!alreadySeenNames.has(synonym)) {
            alreadySeenNames.add(synonym)
            synonyms.push(new SynonymGene(synonym, currentGene))
          }
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
    ...mapGetters({}),
  },
  mounted() {},
})
</script>

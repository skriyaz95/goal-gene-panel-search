<template>
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-dna</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ panel.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-bank</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ institution }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-file-document</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ panel.sourceFile }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-database</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <span>{{ $t('explore.panelDetails.genesInPanel.text') }}:</span>
            <v-fade-transition>
              <span class="ml-3" v-show="showAny">
                <v-tooltip bottom v-show="showNotFound">
                  <template v-slot:activator="{ on }">
                    <v-chip color="error" class="ml-1 mr-1" v-on="on">
                      {{ $t('parsedInput.notFound.text') }} ({{
                        $tc(
                          'count.gene',
                          $n(formattedGenes.notFoundGenes.length)
                        )
                      }})
                    </v-chip>
                  </template>
                  <span>{{ $t('parsedInput.notFound.tooltip') }}</span>
                </v-tooltip>
                <v-tooltip bottom v-show="showSynonym">
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
                <v-tooltip bottom v-show="showSymbol">
                  <template v-slot:activator="{ on }">
                    <v-chip color="success" class="ml-1 mr-1" v-on="on">
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
            </v-fade-transition>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div>
      <v-fade-transition>
        <div v-show="showAny" class="pl-15 ml-6">
          <gene-parsed-content
            :show-genes="[showNotFound, showSynonym, showSymbol]"
            :parsed-genes="formattedGenes"
          />
        </div>
      </v-fade-transition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Gene,
  GenePanelDetails,
  ParsedGene,
  ParsedGenes,
  SynonymGene,
} from '@/types/panel-types'
import Vue from 'vue'
import GeneParsedContent from '@/components/GeneParsedContent.vue'

export default Vue.extend({
  components: { GeneParsedContent },
  name: 'PanelDetails',
  props: {
    panel: {
      type: Object,
      default: () => new GenePanelDetails('', [], new ParsedGenes(), ''),
    },
    institution: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {
    formattedGenes() {
      const parsedGenes = new ParsedGenes()
      parsedGenes.symbolFoundGenes = this.panel.symbolsOnly.map(
        (g: Gene) => new ParsedGene(g, 'symbol')
      )
      parsedGenes.synonymFoundGenes = this.panel.synonymsOnly.map(
        (sg: SynonymGene) =>
          new ParsedGene(new Gene(sg.synonym), 'synonym', sg.gene)
      )
      parsedGenes.notFoundGenes = this.panel.notFound.map(
        (g: Gene) => new ParsedGene(g, 'notFound')
      )
      return parsedGenes
    },
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
  },
  methods: {},
  watch: {},
  mounted() {},
})
</script>

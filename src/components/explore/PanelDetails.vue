<template>
  <div>
    <v-list>
      <v-list-item v-if="editable && panel">
        <v-list-item-content>
          <v-text-field
            v-model="panel.item.name"
            :label="$t('institutionDetails.name.text')"
            dense
            @change="handleNameChange"
          >
            <template v-slot:prepend>
              <div class="pr-6"><v-icon>mdi-dna</v-icon></div>
            </template>
          </v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-else>
        <v-list-item-icon>
          <v-icon>mdi-dna</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ panel.item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-bank-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <span v-if="institution">{{ institution }}</span>
            <span v-else>{{ $t('buildPanels.noInstitution.text') }}</span>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-file-document</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ panel.item.sourceFile }}
            <v-btn
              icon
              :href="rawPanels + panel.item.sourceFile"
              target="_blank"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
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
                <span v-show="showNotFound">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip
                        :outlined="chipOutlined"
                        :color="notFoundColor"
                        class="ml-1 mr-1"
                        v-on="on"
                      >
                        {{ $t('parsedInput.notFound.text') }} ({{
                          $tc(
                            'count.gene',
                            $n(formattedGenes.notFoundGenes.length)
                          )
                        }})
                      </v-chip>
                    </template>
                    <span>{{
                      $t('explore.panelDetails.notFound.tooltip')
                    }}</span>
                  </v-tooltip>
                </span>
                <span v-show="showSynonym">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip
                        :outlined="chipOutlined"
                        :color="synonymColor"
                        class="ml-1 mr-1"
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
                    <span>{{
                      $t('explore.panelDetails.synonyms.tooltip')
                    }}</span>
                  </v-tooltip>
                </span>
                <span v-show="showSymbol">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-chip
                        :outlined="chipOutlined"
                        :color="symbolColor"
                        class="ml-1 mr-1"
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
                    <span>{{
                      $t('explore.panelDetails.symbols.tooltip')
                    }}</span>
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
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div>
      <v-fade-transition>
        <div v-show="showAny" class="pl-15 ml-6">
          <gene-parsed-content
            :show-genes="[
              showNotFound,
              showSynonym,
              showSymbol,
              showFusion,
              showIntron,
            ]"
            :parsed-genes="formattedGenes"
          />
        </div>
      </v-fade-transition>
    </div>
  </div>
</template>

<script lang="ts">
import {
  FullGene,
  Gene,
  GenePanelDetails,
  ParsedGene,
  ParsedGenes,
  SynonymGene,
} from '@/types/panel-types'
import Vue from 'vue'
import GeneParsedContent from '@/components/GeneParsedContent.vue'
import { mapGetters } from 'vuex'
import { GeneState, ListItem } from '@/types/ui-types'
import { formatStateColor } from '@/utils/formatting'

export default Vue.extend({
  components: { GeneParsedContent },
  name: 'PanelDetails',
  props: {
    panel: {
      type: Object,
      default: () =>
        new ListItem(new GenePanelDetails('', [], new ParsedGenes(), ''), true),
    },
    institution: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selectedInstitution: this.institution,
      rawPanels: process.env.BASE_URL + 'raw_panels/',
    }
  },
  computed: {
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
    formattedGenes() {
      const parsedGenes = new ParsedGenes()
      parsedGenes.symbolFoundGenes = this.panel.item.symbolsOnly.map(
        (g: Gene) => new ParsedGene(g, GeneState.SYMBOL)
      )
      parsedGenes.synonymFoundGenes = this.panel.item.synonymsOnly.map(
        (sg: SynonymGene) =>
          new ParsedGene(
            new Gene(sg.synonym),
            GeneState.SYNONYM,
            sg.gene as FullGene
          )
      )
      if (this.panel.item.fusionsOnly) {
        parsedGenes.fusionFoundGenes = this.panel.item.fusionsOnly.map(
          (g: Gene) => new ParsedGene(g, GeneState.FUSION)
        )
      } else {
        parsedGenes.fusionFoundGenes = []
      }
      if (this.panel.item.intronsOnly) {
        parsedGenes.intronFoundGenes = this.panel.item.intronsOnly.map(
          (g: Gene) => new ParsedGene(g, GeneState.INTRON)
        )
      } else {
        parsedGenes.intronFoundGenes = []
      }
      parsedGenes.notFoundGenes = this.panel.item.notFound.map(
        (g: Gene) => new ParsedGene(g, GeneState.NOT_FOUND)
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
    showFusion(): boolean {
      return this.formattedGenes.fusionFoundGenes.length > 0
    },
    showIntron(): boolean {
      return this.formattedGenes.intronFoundGenes.length > 0
    },
    showAny(): boolean {
      return (
        this.showNotFound ||
        this.showSynonym ||
        this.showSymbol ||
        this.showFusion ||
        this.showIntron
      )
    },
    notFoundColor() {
      return formatStateColor(GeneState.NOT_FOUND)
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
  methods: {
    handleNameChange(event: string[]) {
      this.$emit('name-changed', event)
    },
  },
  watch: {},
  mounted() {},
})
</script>

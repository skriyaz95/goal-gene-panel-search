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
            <v-btn icon :href="rawPanels + panel.sourceFile" target="_blank">
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
                <v-tooltip bottom v-show="showNotFound">
                  <template v-slot:activator="{ on }">
                    <v-chip
                      :outlined="chipOutlined"
                      color="error"
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
                  <span>{{ $t('explore.panelDetails.notFound.tooltip') }}</span>
                </v-tooltip>
                <v-tooltip bottom v-show="showSynonym">
                  <template v-slot:activator="{ on }">
                    <v-chip
                      :outlined="chipOutlined"
                      color="warning"
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
                  <span>{{ $t('explore.panelDetails.synonyms.tooltip') }}</span>
                </v-tooltip>
                <v-tooltip bottom v-show="showSymbol">
                  <template v-slot:activator="{ on }">
                    <v-chip
                      :outlined="chipOutlined"
                      color="success"
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
                  <span>{{ $t('explore.panelDetails.symbols.tooltip') }}</span>
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
import {ListItem} from "@/types/ui-types";

export default Vue.extend({
  components: { GeneParsedContent },
  name: 'PanelDetails',
  props: {
    panel: {
      type: Object,
      default: () => new ListItem(new GenePanelDetails('', [], new ParsedGenes(), ''), true),
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
        (g: Gene) => new ParsedGene(g, 'symbol')
      )
      parsedGenes.synonymFoundGenes = this.panel.item.synonymsOnly.map(
        (sg: SynonymGene) =>
          new ParsedGene(new Gene(sg.synonym), 'synonym', sg.gene as FullGene)
      )
      parsedGenes.notFoundGenes = this.panel.item.notFound.map(
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
  methods: {
    handleNameChange(event: string[]) {
      this.$emit('name-changed', event)
    },
  },
  watch: {},
  mounted() {

  },
})
</script>

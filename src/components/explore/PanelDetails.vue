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
                <span v-show="showInvalid">
                  <gene-entry-title
                    :state="geneState.INVALID"
                    :count="formattedGenes.invalidGenes.length"
                    :tooltip="
                      $t('explore.panelDetails.invalid.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                </span>
                <span v-show="showSynonym">
                  <gene-entry-title
                    :state="geneState.SYNONYM"
                    :count="formattedGenes.synonymFoundGenes.length"
                    :tooltip="
                      $t('explore.panelDetails.synonyms.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                </span>
                <span v-show="showSymbol">
                  <gene-entry-title
                    :state="geneState.SYMBOL"
                    :count="formattedGenes.symbolFoundGenes.length"
                    :tooltip="
                      $t('explore.panelDetails.symbols.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                </span>
                <span v-show="showFusion">
                  <gene-entry-title
                    :state="geneState.FUSION"
                    :count="formattedGenes.fusionFoundGenes.length"
                    :tooltip="
                      $t('explore.panelDetails.fusions.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                </span>
                <span v-show="showIntron">
                  <gene-entry-title
                    :state="geneState.INTRON"
                    :count="formattedGenes.intronFoundGenes.length"
                    :tooltip="
                      $t('explore.panelDetails.introns.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
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
    </div>
  </div>
</template>

<script lang="ts">
import {
  FullGene,
  FusionIntronGene,
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
import GeneEntryTitle from '@/components/GeneEntryTitle.vue'

export default Vue.extend({
  components: { GeneParsedContent, GeneEntryTitle },
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
      geneState: GeneState,
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
          (fg: FusionIntronGene) =>
            new ParsedGene(
              new Gene(fg.originalName),
              GeneState.FUSION,
              fg.gene as FullGene
            )
        )
      } else {
        parsedGenes.fusionFoundGenes = []
      }
      if (this.panel.item.intronsOnly) {
        parsedGenes.intronFoundGenes = this.panel.item.intronsOnly.map(
          (fg: FusionIntronGene) =>
            new ParsedGene(
              new Gene(fg.originalName),
              GeneState.INTRON,
              fg.gene as FullGene
            )
        )
      } else {
        parsedGenes.intronFoundGenes = []
      }
      parsedGenes.invalidGenes = this.panel.item.invalid.map(
        (g: Gene) => new ParsedGene(g, GeneState.INVALID)
      )
      return parsedGenes
    },
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

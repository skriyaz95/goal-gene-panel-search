/* eslint-disable vue/html-indent */
<template>
  <v-row align="center">
    <v-col cols="6" lg="3">
      <v-text-field
        v-model="tempPanelName"
        :label="$t('buildPanels.panelName.text')"
        hide-details
        dense
        @click.stop=""
        @change="updatePanelName()"
      />
    </v-col>
    <v-col cols="6" lg="9">
      <v-fade-transition class="ml-3">
        <span>
          <v-tooltip bottom v-if="showNotFound">
            <template v-slot:activator="{ on }">
              <v-chip color="error" class="ml-1 mr-1" v-on="on">
                <v-icon left> mdi-alert-circle-outline </v-icon>
                ({{ $tc('count.gene', $n(parsedGenes.notFoundGenes.length)) }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.notFound.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showSynonym">
            <template v-slot:activator="{ on }">
              <v-chip color="warning" class="ml-1 mr-1" v-on="on">
                <v-icon left> mdi-approximately-equal </v-icon>
                ({{
                  $tc('count.gene', $n(parsedGenes.synonymFoundGenes.length))
                }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.synonyms.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showSymbol">
            <template v-slot:activator="{ on }">
              <v-chip color="success" class="ml-1 mr-1" v-on="on">
                <v-icon left> mdi-check </v-icon>
                ({{
                  $tc('count.gene', $n(parsedGenes.symbolFoundGenes.length))
                }})
              </v-chip>
            </template>
            <span>{{ $t('parsedInput.symbols.tooltip') }}</span>
          </v-tooltip>
        </span>
      </v-fade-transition>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ParsedGenes } from '@/types/panel-types'
import Vue from 'vue'

export default Vue.extend({
  name: 'BuildPanelHeader',
  props: {
    showNotFound: Boolean,
    showSynonym: Boolean,
    showSymbol: Boolean,
    panelName: String,
    parsedGenes: ParsedGenes,
  },
  data: () => ({
    tempPanelName: '',
  }),
  methods: {
    updatePanelName() {
      //to avoid modifying a prop directly, send event to the parent
      this.$emit('update-panel-name', this.tempPanelName)
    },
  },
  computed: {},
  mounted() {
    this.tempPanelName = this.panelName
  },
})
</script>

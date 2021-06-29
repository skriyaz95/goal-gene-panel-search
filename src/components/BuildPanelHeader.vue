/* eslint-disable vue/html-indent */
<template>
  <v-row align="center">
    <v-col cols="6" lg="3">
      <v-text-field
        v-model="panel[0]"
        :label="$t('buildPanels.panelName.text')"
        hide-details
        dense
        @click.stop=""
      />
    </v-col>
    <v-col cols="6" lg="9">
      <v-fade-transition>
        <span class="ml-3">
          <v-tooltip bottom v-if="showGenes[0]">
            <template v-slot:activator="{ on }">
              <v-chip color="error" class="ml-1 mr-1" v-on="on">
                <v-icon left> mdi-alert-circle-outline </v-icon>
                ({{ $tc('count.gene', $n(panel[1].notFoundGenes.length)) }})
              </v-chip>
            </template>
            <span>{{ $t('parseInput.notFound.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showGenes[1]">
            <template v-slot:activator="{ on }">
              <v-chip color="warning" class="ml-1 mr-1" v-on="on">
                <v-icon left> mdi-approximately-equal </v-icon>
                ({{ $tc('count.gene', $n(panel[1].synonymFoundGenes.length)) }})
              </v-chip>
            </template>
            <span>{{ $t('parseInput.synonyms.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="showGenes[2]">
            <template v-slot:activator="{ on }">
              <v-chip color="success" class="ml-1 mr-1" v-on="on">
                <v-icon left> mdi-check </v-icon>
                ({{ $tc('count.gene', $n(panel[1].symbolFoundGenes.length)) }})
              </v-chip>
            </template>
            <span>{{ $t('parseInput.symbols.tooltip') }}</span>
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
    showGenes: () => [Boolean, Boolean, Boolean],
    panel: () => [String, ParsedGenes],
  },
  data: () => ({}),
  methods: {},
  computed: {},
  mounted() {},
})
</script>

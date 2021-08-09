/**
Help components contain complex tooltips or helpful explanations (for instance multile, formatted, etc.)
This allows reusing the component to display the same content for a tooltip
or a help card or other tutorial content
 */
<template>
  <div>
    <div class="pb-2">
      <b>{{ $t('panelCompare.title.text') }}</b>
      {{ $t('help.panelCompare.part1a') }}
      <b>{{ $t('parsedInput.title.text') }}</b>
      {{ $t('help.panelCompare.part1b') }}
    </div>
    <div class="pb-2">
      {{ $t('help.panelCompare.part2') }}
    </div>
    <div>{{ $t('help.panelCompare.example') }}:</div>
    <v-simple-table light>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('panelCompare.table.headers.gene.text') }}
            </th>
            <th class="text-left">
              {{ $t('panelCompare.table.headers.panel.text') }}
            </th>
            <th class="text-left">
              {{ $t('panelCompare.table.headers.explanation.text') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.gene">
            <td>
              <v-chip :color="item.geneColor" :outlined="chipOutlined">
                <v-icon left v-text="item.geneIcon"> </v-icon>
                {{ item.gene }}
              </v-chip>
            </td>
            <td>
              <v-chip
                :color="item.panelColor"
                v-if="item.panel"
                :outlined="chipOutlined"
              >
                <v-icon left v-text="item.panelIcon"> </v-icon>
                {{ item.panel }}
              </v-chip>
            </td>
            <td>
              {{ $t('panelCompare.table.headers.panel.text') }}

              {{ item.explain1 }} {{ item.explain2 }}
              <b>{{ parsedSearch }}</b>
              {{ item.explain3 }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { formatStateColor, formatStateIcon } from '@/utils/formatting'
import { GeneState } from '@/types/ui-types'

export default Vue.extend({
  name: 'PanelCompareHelp',
  props: {},
  data: () => ({}),
  computed: {
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
    items() {
      const it = []
      it.push({
        gene: 'TP53',
        panel: 'TP53',
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
        geneColor: formatStateColor(GeneState.SYMBOL),
        geneIcon: formatStateIcon(GeneState.SYMBOL),
        panelColor: formatStateColor(GeneState.SYMBOL),
        panelIcon: formatStateIcon(GeneState.SYMBOL),
      })
      it.push({
        gene: 'TENT5C',
        panel: 'FAM46C',
        explain1: this.$t('help.panelCompare.part3.anyMatch'),
        explain2: this.$t('help.panelCompare.part3.synonymMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
        geneColor: formatStateColor(GeneState.SYMBOL),
        geneIcon: formatStateIcon(GeneState.SYMBOL),
        panelColor: formatStateColor(GeneState.SYNONYM),
        panelIcon: formatStateIcon(GeneState.SYNONYM),
      })
      it.push({
        gene: 'BRAF1',
        panel: 'BRAF',
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.synonyminput'),
        geneColor: formatStateColor(GeneState.SYNONYM),
        geneIcon: formatStateIcon(GeneState.SYNONYM),
        panelColor: formatStateColor(GeneState.SYMBOL),
        panelIcon: formatStateIcon(GeneState.SYNONYM_TO_SYMBOL),
      })
      it.push({
        gene: 'KRAS1',
        panel: 'KRAS2',
        explain1: this.$t('help.panelCompare.part3.anyMatch'),
        explain2: this.$t('help.panelCompare.part3.synonymMatching'),
        explain3: this.$t('help.panelCompare.part3.synonyminput'),
        geneColor: formatStateColor(GeneState.SYNONYM),
        geneIcon: formatStateIcon(GeneState.SYNONYM),
        panelColor: formatStateColor(GeneState.SYNONYM),
        panelIcon: formatStateIcon(GeneState.SYNONYM),
      })
      it.push({
        gene: 'BRCA1',
        panel: '',
        explain1: this.$t('help.panelCompare.part3.noMatch'),
        explain2: '',
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
        geneColor: formatStateColor(GeneState.SYMBOL),
        geneIcon: formatStateIcon(GeneState.SYMBOL),
        panelColor: formatStateColor(GeneState.SYMBOL),
        panelIcon: formatStateIcon(GeneState.SYMBOL),
      })
      return it
    },
    parsedSearch() {
      return this.$t('parsedInput.title.text')
    },
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    formatState(state: string) {
      return formatStateColor(state)
    },
  },
})
</script>

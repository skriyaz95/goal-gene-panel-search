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
            <td>{{ item.gene }}</td>
            <td>{{ item.panel }}</td>
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

export default Vue.extend({
  name: 'PanelCompareHelp',
  props: {},
  data: () => ({}),
  computed: {
    items() {
      const it = []
      it.push({
        gene: 'TP53',
        panel: 'TP53',
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      it.push({
        gene: 'TENT5C',
        panel: 'FAM46C',
        explain1: this.$t('help.panelCompare.part3.anyMatch'),
        explain2: this.$t('help.panelCompare.part3.synonymMatching'),
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
      })
      it.push({
        gene: 'BRAF1',
        panel: 'BRAF',
        explain1: this.$t('help.panelCompare.part3.exactMatch'),
        explain2: this.$t('help.panelCompare.part3.symbolMatching'),
        explain3: this.$t('help.panelCompare.part3.synonyminput'),
      })
      it.push({
        gene: 'KRAS1',
        panel: 'KRAS2',
        explain1: this.$t('help.panelCompare.part3.anyMatch'),
        explain2: this.$t('help.panelCompare.part3.synonymMatching'),
        explain3: this.$t('help.panelCompare.part3.synonyminput'),
      })
      it.push({
        gene: 'BRCA1',
        panel: '',
        explain1: this.$t('help.panelCompare.part3.noMatch'),
        explain2: '',
        explain3: this.$t('help.panelCompare.part3.symbolInput'),
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
      if (state == 'symbol') {
        return 'success'
      }
      if (state == 'synonym') {
        return 'warning'
      }
      return 'error'
    },
  },
})
</script>

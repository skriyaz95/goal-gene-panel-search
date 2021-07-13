<template>
  <div>
    <v-card outlined>
      <v-card-title>
        {{ $t('panelCompare.title.text') }}
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
            <panel-compare-help />
          </template>
        </info-alert>
        <v-data-table
          :headers="headers"
          :items="items"
          item-key="geneId"
          sort-by="gene"
        >
          <template v-if="items.length > 0" v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.geneId">
                <td v-for="header in headers" :key="header.value">
                  <v-chip
                    v-if="showChip(item, header)"
                    :color="formatState(item, header)"
                  >
                    <div class="d-flex align-center">
                      {{ geneName(item, header) }}
                    </div>
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import PanelCompareHelp from '@/components/help/PanelCompareHelp.vue'

export default Vue.extend({
  components: {
    HelpButton,
    InfoAlert,
    PanelCompareHelp,
  },
  name: 'PanelCompare',
  props: {
    help: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    handleHelp() {
      this.$emit('help')
    },
    geneName(item: any, header: any) {
      return item[header.value].gene.name
    },
    showChip(item: any, header: any) {
      const label: string = header.value
      // console.log(item[label])
      return item[label] && item[label].state !== 'notFound'
    },
    formatState(item: any, header: any) {
      const label: string = header.value
      if (item[label].state === 'symbol') {
        return 'success'
      }
      if (
        item[label].state === 'synonym' ||
        item[label].state === 'symbolToSynonym' ||
        item[label].state === 'synonymToSymbol'
      ) {
        return 'warning'
      }
      return 'error'
    },
  },
})
</script>

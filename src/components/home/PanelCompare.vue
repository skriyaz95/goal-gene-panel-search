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
        <v-card outlined>
          <v-card-title>Table Tools:</v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <span class="body-1">
                  {{ $t('panelCompare.table.institutions.text') }}:
                </span>
                <v-chip
                  class="ma-1"
                  filter
                  v-for="(institution, index) in visibleInstitutions"
                  :key="index"
                  active-class="primary lighten-1"
                  :input-value="institution.active"
                  @click="toggleInstitution(institution)"
                >
                  {{ institution.id }}
                </v-chip>
              </v-col>
            </v-row>
            <v-text-field
              v-model="search"
              :label="$t('panelCompare.table.search.text')"
              clearable
              prepend-icon="mdi-magnify"
            >
            </v-text-field>
          </v-card-text>
        </v-card>

        <v-data-table
          :headers="filteredHeaders"
          :items="items"
          item-key="geneId"
          sort-by="gene"
          :custom-sort="customSort"
          :custom-filter="customFilter"
          :search="search"
        >
          <template v-if="items.length > 0" v-slot:body="{ items }">
            <tbody>
              <tr v-for="item in items" :key="item.geneId">
                <td v-for="header in filteredHeaders" :key="header.value">
                  <v-chip
                    :outlined="chipOutlined"
                    v-if="showChip(item, header)"
                    :color="formatState(item, header)"
                  >
                    <v-icon left v-text="formatIcon(item, header)"> </v-icon>
                    {{ geneName(item, header) }}
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
import { mapGetters } from 'vuex'
import { ActiveState, TableHeader } from '@/types/ui-types'

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
    visibleInstitutions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      validSeparators: /[ ,;\s]+/,
      search: '',
    }
  },
  computed: {
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
    filteredHeaders(): Array<TableHeader> {
      const fHeaders = new Array<TableHeader>()
      for (let i = 0; i < this.headers.length; i++) {
        const header = this.headers[i] as TableHeader
        if (header.visible) {
          fHeaders.push(header)
        }
      }
      return fHeaders
    },
  },
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
    formatIcon(item: any, header: any) {
      const label: string = header.value
      if (
        item[label].state === 'symbol' ||
        item[label].state === 'synonymToSymbol'
      ) {
        return 'mdi-check'
      }
      return 'mdi-approximately-equal'
    },
    customSort(items: any[], sortBy: string[], sortDesc: boolean[]): any[] {
      items.sort((a: any, b: any) => {
        if (!sortBy[0]) {
          return 0
        }
        const aItem = a[sortBy[0]].gene.name
        const bItem = b[sortBy[0]].gene.name
        const desc = sortDesc[0]
        if (aItem > bItem) {
          return desc ? 1 : -1
        }
        if (aItem < bItem) {
          return desc ? -1 : 1
        }
        return 0
      })
      return items
    },
    customFilter(value: any, search: string | null): boolean {
      if (value && search) {
        const searchItems = search.split(this.validSeparators)
        const cellValue = value.gene.name.toUpperCase()
        for (let i = 0; i < searchItems.length; i++) {
          const searchItem = searchItems[i].toUpperCase()
          if (cellValue.indexOf(searchItem) > -1) {
            return true
          }
        }
        return false
      }
      return true
    },
    toggleInstitution(institution: ActiveState) {
      this.$emit('toggleInstitution', institution)
    },
  },
  mounted() {},
})
</script>

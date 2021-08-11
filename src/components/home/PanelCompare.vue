<template>
  <div>
    <v-card outlined>
      <v-card-title>
        {{ $t('panelCompare.title.text') }}
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              v-on="on"
              :disabled="!items || items.length == 0"
              icon
              @click="downloadComparePanels"
            >
              <v-icon>mdi-download </v-icon>
            </v-btn>
          </template>
          <span>{{ $t('button.download.tooltip') }}</span>
        </v-tooltip>
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
                  <template v-for="(match, index) in getMatches(item, header)">
                    <v-chip
                      class="ma-1"
                      :key="index"
                      :outlined="chipOutlined"
                      v-if="showChip(match)"
                      :color="formatState(match)"
                    >
                      <v-icon left v-text="formatIcon(match)"> </v-icon>
                      {{ geneName(match) }}
                    </v-chip>
                  </template>
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
import { ActiveState, GeneState, TableHeader } from '@/types/ui-types'
import download from '@/utils/download'
import Papa from 'papaparse'
import { formatStateColor, formatStateIcon } from '@/utils/formatting'
// import { transpose } from '@/utils/arrays'

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
    geneName(match: any) {
      const gene = match.gene ? match.gene.name : match.name
      return gene
    },
    showChip(match: any) {
      return match && match.state !== GeneState.NOT_FOUND
    },
    formatState(match: any) {
      return formatStateColor(match.state)
    },
    formatIcon(match: any) {
      return formatStateIcon(match.state)
    },
    getMatches(item: any, header: any) {
      const label: string = header.value
      return item[label]
    },
    customSort(items: any[], sortBy: string[], sortDesc: boolean[]): any[] {
      items.sort((a: any, b: any) => {
        if (!sortBy[0]) {
          return 0
        }
        const aItem = a[sortBy[0]][0].gene.name
        const bItem = b[sortBy[0]][0].gene.name
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
    downloadComparePanels() {
      //use filteredHeaders to remove geneId and hidden columns
      const csvHeaders = this.filteredHeaders.map((h) => h.text)
      const csvItems = []
      for (let j = 0; j < this.items.length; j++) {
        const row = []
        for (let i = 0; i < this.filteredHeaders.length; i++) {
          const h = this.filteredHeaders[i]
          const result = (this.items as any)[j][h.value]
          //skip notFound results
          if (result && result.state === GeneState.NOT_FOUND) {
            row.push('')
          } else {
            const geneName = result.gene.name
            row.push(geneName)
          }
        }
        csvItems.push(row)
      }
      const csv = Papa.unparse({
        fields: csvHeaders,
        data: csvItems,
      })
      download('compare_panels.csv', csv, 'text/csv')
    },
  },
  mounted() {},
})
</script>


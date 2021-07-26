/* eslint-disable vue/html-indent */
<template>
  <main-content-template inner>
    <template v-slot:left-col>
      <list-template
        :value="value"
        @input="handleInput($event)"
        @change="handleChange($event)"
        :itemsSorted="panelsSorted"
      >
        <template v-slot:title>
          {{ $t('explore.panels.list.text') }}:
        </template>
      </list-template>
    </template>
    <template v-slot:right-col>
      <v-card outlined class="mb-2">
        <v-card-text>
          <panel-details
            :panel="getCurrentPanel()"
            :institution="currentInstitution"
          />
        </v-card-text>
      </v-card>
    </template>
  </main-content-template>
</template>

<script lang="ts">
import { GenePanelDetails } from '@/types/panel-types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import PanelDetails from '@/components/explore/PanelDetails.vue'
import ListTemplate from '@/components/explore/ListTemplate.vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'

export default Vue.extend({
  components: { PanelDetails, ListTemplate, MainContentTemplate },
  name: 'ExplorePanels',
  props: { value: { type: String, default: '0' } },
  data: () => ({
    previousIndex: 0, //to prevent undefined error when clicking on the same panel twice
    currentInstitution: 'test',
  }),
  methods: {
    getCurrentPanel(): GenePanelDetails | null {
      const currentPanel = this.panelsSorted[this.value]
      this.currentInstitution = this.getInstitutionfromPanel(currentPanel)
      return currentPanel
    },
    getInstitutionfromPanel(panel: GenePanelDetails) {
      if (this.institutions && panel && panel.name) {
        for (let i = 0; i < this.institutions.length; i++) {
          if (
            this.institutions[i].panels &&
            this.institutions[i].panels.indexOf(panel.name) > -1
          ) {
            return this.institutions[i].name
          }
        }
      }
      return ''
    },
    handleChange($event: any) {
      this.$emit('change', $event)
    },
    handleInput($event: any) {
      this.$emit('input', $event)
    },
  },
  computed: {
    ...mapGetters({
      panelsSorted: 'getPanelsSorted',
      institutions: 'getInstitutions',
      chipOutlined: 'getChipOutlined',
      lastItem: 'getLastItemExplore',
    }),
  },
  mounted() {
    // if (this.lastItem < this.panelsSorted.length) {
    //   const queryItem = this.$route.query.item
    //   if (queryItem && queryItem != this.lastItem) {
    //     this.panelIndex = Number.parseInt(queryItem as string)
    //   } else {
    //     this.panelIndex = this.lastItem
    //   }
    // }
  },
})
</script>

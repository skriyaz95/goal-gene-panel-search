/* eslint-disable vue/html-indent */
<template>
  <main-content-template :cols="2" inner>
    <template v-slot:left-col>
      <list-template
        v-model="panelIndex"
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
  props: {},
  data: () => ({
    panelIndex: 0,
    previousIndex: 0, //to prevent undefined error when clicking on the same panel twice
    currentInstitution: 'test',
  }),
  methods: {
    getCurrentPanel(): GenePanelDetails | null {
      if (this.panelIndex != undefined) {
        this.previousIndex = this.panelIndex
      }
      const currentPanel = this.panelsSorted[this.previousIndex]
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
      if ($event !== undefined) {
        this.panelIndex = $event
      }
    },
  },
  computed: {
    ...mapGetters({
      panelsSorted: 'getPanelsSorted',
      institutions: 'getInstitutions',
      chipOutlined: 'getChipOutlined',
    }),
  },
  mounted() {},
})
</script>

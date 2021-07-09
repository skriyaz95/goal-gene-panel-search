/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <list-template
          v-model="panelIndex"
          @change="handleChange($event)"
          :itemsSorted="panelsSorted"
        >
          <template v-slot:title>
            {{ $t('explore.panels.list.text') }}:
          </template>
        </list-template>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card outlined class="mb-2">
          <v-card-text>
            <panel-details
              :panel="getCurrentPanel()"
              :institution="currentInstitution"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GenePanelDetails } from '@/types/panel-types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import PanelDetails from '@/components/explore/PanelDetails.vue'
import ListTemplate from '@/components/explore/ListTemplate.vue'

export default Vue.extend({
  components: { PanelDetails, ListTemplate },
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
    }),
  },
  mounted() {},
})
</script>

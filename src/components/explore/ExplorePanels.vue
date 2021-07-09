/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card outlined>
          <v-card-text>
            <div class="mb-1 mt-1">{{ $t('explore.panels.list.text') }}:</div>
            <v-list-item-group
              v-model="panelIndex"
              active-class="primary lighten-2"
            >
              <v-list>
                <v-list-item
                  v-for="(panel, index) in panelsSorted"
                  :key="index"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-dna</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ panel.name }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-list-item-group>
          </v-card-text>
        </v-card>
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

export default Vue.extend({
  components: { PanelDetails },
  name: 'ExplorePanels',
  props: {},
  data: () => ({
    publicPath: process.env.BASE_URL,
    panelIndex: 0,
    previousIndex: 0, //to prevent undefined error when clicking on the same panel twice
    tempPanelSorted: new Array<GenePanelDetails>(),
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

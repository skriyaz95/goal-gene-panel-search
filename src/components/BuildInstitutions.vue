/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card outlined>
          <v-card-text>
            <div class="mb-1 mt-1">{{ $t('buidInstitutions.list.text') }}:</div>
            <v-list-item-group
              v-model="institutionIndex"
              active-class="primary lighten-2"
            >
              <v-list>
                <v-list-item
                  v-for="(institution, index) in tempInstitutionSorted"
                  :key="index"
                >
                  <v-list-item-icon>
                    <v-icon>mdi-bank</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    {{ institution.name }}
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-list-item-group>
          </v-card-text>
          <v-card-actions v-if="editable">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="primary" v-on="on" @click="addInstitution()">
                  {{ $t('buidInstitutions.new.text') }}
                </v-btn>
              </template>
              <span>{{ $t('buidInstitutions.new.tooltip') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="primary ml-2"
                  :disabled="!validInstitutions()"
                  v-on="on"
                  @click="downloadInstitutions()"
                >
                  {{ $t('buidInstitutions.saveAll.text') }}
                </v-btn>
              </template>
              <span> {{ $t('buidInstitutions.saveAll.tooltip') }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card outlined class="mb-2">
          <v-card-text>
            <institution-details
              :institution="getCurrentInstitution()"
              :editable="editable"
              :panels="panelNames"
              @name-changed="updateTempInstitutions"
              @delete-institution="deleteInstitution()"
              :show-read-only-panels="showReadOnlyPanels"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { GenePanel, Institution } from '@/types/panel-types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import InstitutionDetails from './home/InstitutionDetails.vue'
import download from '@/utils/download'
import { formatObjetToJson } from '@/utils/download'

export default Vue.extend({
  components: { InstitutionDetails },
  name: 'BuildInstitutions',
  props: {
    editable: Boolean,
    showReadOnlyPanels: Boolean,
  },
  data: () => ({
    publicPath: process.env.BASE_URL,
    institutionIndex: 0,
    previousIndex: 0, //to prevent undefined error when clicking on the same institution twice
    tempInstitutionSorted: new Array<Institution>(),
  }),
  methods: {
    addInstitution() {
      const newInstitution = new Institution('New', '', '', '', [])
      this.tempInstitutionSorted.push(newInstitution)
      this.tempInstitutionSorted.sort(this.sortInstitutionsByName)
      this.updateTempInstitutions('New')
    },
    validInstitutions() {
      //TODO validate form
      return true
    },
    downloadInstitutions() {
      download(
        'institutions.json',
        formatObjetToJson(this.tempInstitutionSorted, false),
        'text/json'
      )
    },
    getCurrentInstitution(): Institution | null {
      if (this.institutionIndex != undefined) {
        this.previousIndex = this.institutionIndex
      }
      return this.tempInstitutionSorted[this.previousIndex]
    },
    updateTempInstitutionsFromStore() {
      this.tempInstitutionSorted = JSON.parse(JSON.stringify(this.institutions))
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        for (let j = 0; j < this.tempInstitutionSorted[i].panels.length; j++) {
          if (
            this.panelNames.indexOf(this.tempInstitutionSorted[i].panels[j]) ==
            -1
          ) {
            this.tempInstitutionSorted[i].panels = []
            break
          }
        }
      }
    },
    updateTempInstitutions(name: string) {
      this.tempInstitutionSorted.sort(this.sortInstitutionsByName)
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        if (this.tempInstitutionSorted[i].name === name) {
          this.institutionIndex = i
          break
        }
      }
    },
    deleteInstitution() {
      this.tempInstitutionSorted.splice(this.institutionIndex, 1)
    },
    sortInstitutionsByName(a: Institution, b: Institution) {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    },
  },
  computed: {
    ...mapGetters({
      institutions: 'getInstitutionsSorted',
      panels: 'getPanels',
    }),
    panelNames(): string[] {
      return this.panels.map((p: GenePanel) => p.name)
    },
  },
  mounted() {
    this.updateTempInstitutionsFromStore()
  },
})
</script>

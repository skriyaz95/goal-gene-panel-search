/* eslint-disable vue/html-indent */
<template>
  <main-content-template inner>
    <template v-slot:left-col>
      <list-template
        v-model="institutionIndex"
        @change="handleChange($event)"
        :itemsSorted="tempInstitutionSorted"
      >
        <template v-slot:title>
          {{ $t('buidInstitutions.list.text') }}:
        </template>
        <template v-slot:actions v-if="editable">
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
        </template>
      </list-template>
    </template>
    <template v-slot:right-col>
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
    </template>
  </main-content-template>
</template>

<script lang="ts">
import { GenePanelDetails, Institution } from '@/types/panel-types'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import InstitutionDetails from '@/components/InstitutionDetails.vue'
import download, { formatObjetToJson } from '@/utils/download'
import ListTemplate from '@/components/explore/ListTemplate.vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'

export default Vue.extend({
  components: { InstitutionDetails, ListTemplate, MainContentTemplate },
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
    handleChange($event: any) {
      if ($event !== undefined) {
        this.institutionIndex = $event
      }
    },
  },
  computed: {
    ...mapGetters({
      institutions: 'getInstitutionsSorted',
      panels: 'getPanels',
    }),
    panelNames(): string[] {
      return this.panels.map((p: GenePanelDetails) => p.name)
    },
  },
  mounted() {
    this.updateTempInstitutionsFromStore()
  },
})
</script>

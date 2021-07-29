/* eslint-disable vue/html-indent */
<template>
  <main-content-template inner>
    <template v-slot:left-col>
      <list-template
        :value="item"
        @input="handleInput($event)"
        @change="handleChange($event)"
        :itemsSorted="tempInstitutionSorted"
        :editable="editable"
        @delete="deleteInstitution($event)"
        dropDownLabel="buildPanels.selectInstitution.text"
      >
        <template v-slot:title>
          {{ $t('buildInstitutions.list.text') }}:
          <v-spacer></v-spacer>
          <help-button @action="handleHelp()" :active="help">
            <template v-slot:content>
              <span>
                {{ $t('button.showHide.tooltip') }}
                {{ $t('button.help.text') }}
              </span>
            </template>
          </help-button>
        </template>
        <template v-slot:info>
          <info-alert :active="help">
            <template v-slot:content>
              <institution-explore-help :editable="editable" />
            </template>
          </info-alert>
          <info-alert v-if="editable" :active="info || help">
            <template v-slot:content>
              <div class="pb-2">
                {{ $t('buildInstitutions.info.part1') }}
              </div>
              <div>
                {{ $t('buildInstitutions.info.part2') }}
              </div>
            </template>
          </info-alert>
        </template>
        <template v-slot:actions v-if="editable">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn class="primary" v-on="on" @click="addInstitution()">
                {{ $t('buildInstitutions.new.text') }}
              </v-btn>
            </template>
            <span>{{ $t('buildInstitutions.new.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="primary ml-2"
                :disabled="!validInstitutions()"
                v-on="on"
                @click="saveAll()"
              >
                {{ $t('buildInstitutions.saveAll.text') }}
              </v-btn>
            </template>
            <span> {{ $t('buildInstitutions.saveAll.tooltip') }}</span>
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
            :show-read-only-panels="showReadOnlyPanels"
          />
        </v-card-text>
        <v-card-actions v-if="editable">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="error" v-on="on" @click="deleteInstitution()">
                {{ $t('buildInstitutions.delete.text') }}
                <v-spacer></v-spacer>
                <v-icon right>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buildInstitutions.delete.tooltip') }}</span>
          </v-tooltip>
        </v-card-actions>
      </v-card>
    </template>
  </main-content-template>
</template>

<script lang="ts">
import { GenePanelDetails, Institution } from '@/types/panel-types'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import InstitutionDetails from '@/components/InstitutionDetails.vue'
import download, { formatObjetToJson } from '@/utils/download'
import ListTemplate from '@/components/explore/ListTemplate.vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import HelpButton from '@/components/help/HelpButton.vue'
import InstitutionExploreHelp from '../help/InstitutionExploreHelp.vue'

export default Vue.extend({
  components: {
    InstitutionDetails,
    ListTemplate,
    MainContentTemplate,
    InfoAlert,
    InstitutionExploreHelp,
    HelpButton,
  },
  name: 'BuildExploreInstitutions',
  props: {
    editable: Boolean,
    showReadOnlyPanels: Boolean,
  },
  data: () => ({
    publicPath: process.env.BASE_URL,
    // institutionIndex: 0,
    previousIndex: 0, //to prevent undefined error when clicking on the same institution twice
    tempInstitutionSorted: new Array<Institution>(),
    info: false,
    help: false,
  }),
  methods: {
    ...mapActions(['updateInstitutions']),
    handleHelp() {
      this.$emit('help')
      this.help = !this.help
    },
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
    saveAll() {
      this.info = true
      this.updateInstitutions(this.tempInstitutionSorted)
      download(
        'institutions.json',
        formatObjetToJson(this.tempInstitutionSorted, false),
        'text/json'
      )
    },
    getCurrentInstitution(): Institution | null {
      return this.tempInstitutionSorted[this.item]
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
          this.$emit('update', i)
          break
        }
      }
      this.info = true
    },
    deleteInstitution(index: number) {
      if (index != null) {
        this.tempInstitutionSorted.splice(index, 1)
      } else {
        this.tempInstitutionSorted.splice(this.item, 1)
      }
      this.info = true
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
      this.item = $event
    },
    handleInput($event: any) {
      this.item = $event
    },
  },
  computed: {
    ...mapGetters({
      institutions: 'getInstitutionsSorted',
      panels: 'getPanels',
    }),
    item: {
      set(itemNumber: number) {
        //avoid duplicate navigation
        if (itemNumber === this.item) {
          return
        }
        const item = itemNumber.toString()
        this.$router.replace({ params: { ...this.$route.params, item } })
      },
      get(): number {
        return Number.parseInt(this.$route.params.item)
      },
    },
    panelNames(): string[] {
      return this.panels.map((p: GenePanelDetails) => p.name)
    },
  },
  mounted() {
    this.updateTempInstitutionsFromStore()
  },
})
</script>

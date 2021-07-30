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
        @institution-valid="validateInstitutions()"
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
                :disabled="!validInstitutions"
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
import {ListItem} from "@/types/ui-types";

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
    tempInstitutionSorted: new Array<ListItem>(),
    info: false,
    help: false,
    validInstitutions: true,
  }),
  methods: {
    ...mapActions(['updateInstitutions']),
    handleHelp() {
      this.$emit('help')
      this.help = !this.help
    },
    addInstitution() {
      const newInstitution = new Institution('New', '', '', '', [])
      const newItem = new ListItem(newInstitution, true)
      this.tempInstitutionSorted.push(newItem)
      this.tempInstitutionSorted.sort(this.sortInstitutionsByName)
      this.updateTempInstitutions('New')
    },
    validateInstitutions($event: ListItem) {
      this.tempInstitutionSorted[this.item] = $event
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        if(!this.tempInstitutionSorted[i].valid){
          this.validInstitutions = false
          return
        }
      }
      this.validInstitutions = true
    },
    saveAll() {
      this.info = true
      const institutions = this.tempInstitutionSorted.map((listItem: ListItem) => listItem.item)
      this.updateInstitutions(institutions)
      download(
        'institutions.json',
        formatObjetToJson(institutions, false),
        'text/json'
      )
    },
    getCurrentInstitution(): ListItem | null {
      return this.tempInstitutionSorted[this.item]
    },
    updateTempInstitutionsFromStore() {
      this.tempInstitutionSorted = JSON.parse(JSON.stringify(this.institutions)).map((institution:Institution) => new ListItem(institution, true))
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        const item = this.tempInstitutionSorted[i].item as Institution
        for (let j = 0; j < item.panels.length; j++) {
          if (
            this.panelNames.indexOf(item.panels[j]) ==
            -1
          ) {
            (this.tempInstitutionSorted[i].item as Institution).panels = []
            break
          }
        }
      }
    },
    updateTempInstitutions(name: string) {
      this.tempInstitutionSorted.sort(this.sortInstitutionsByName)
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        if (this.tempInstitutionSorted[i].item.name === name) {
          this.item = i;
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
    sortInstitutionsByName(a: ListItem, b: ListItem) {
      if (a.item.name < b.item.name) {
        return -1
      }
      if (a.item.name > b.item.name) {
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

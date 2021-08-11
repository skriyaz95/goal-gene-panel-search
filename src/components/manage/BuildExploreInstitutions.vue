/* eslint-disable vue/html-indent */
<template>
  <main-content-template inner>
    <template v-slot:left-col>
      <list-template
        :itemsSorted="tempInstitutionSorted"
        :editable="editable"
        @delete="deleteInstitution($event)"
        dropDownLabel="buildPanels.selectInstitution.text"
        icon="mdi-bank-outline"
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
                <v-icon right>mdi-bank-plus</v-icon>
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
                <v-icon right>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span> {{ $t('buildInstitutions.saveAll.tooltip') }}</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn class="warning ml-2" v-on="on" @click="resetAll()">
                {{ $t('buildPanels.resetAll.text') }}
                <v-icon right>mdi-reload</v-icon>
              </v-btn>
            </template>
            <span>
              {{ $t('buildPanels.resetAll.tooltip.part1') }}<br />
              {{ $t('buildPanels.resetAll.tooltip.part2') }}</span
            >
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
            @institution-valid="validateInstitutions($event)"
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
import { ListItem } from '@/types/ui-types'
import { listItemSorter } from '@/utils/arrays'

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
    ...mapActions(['updateInstitutions', 'resetInstitutions']),
    handleHelp() {
      this.$emit('help')
      this.help = !this.help
    },
    addInstitution() {
      const newInstitution = new Institution('New', '', '', '', [])
      const newItem = new ListItem(newInstitution, true)
      this.tempInstitutionSorted.push(newItem)
      this.tempInstitutionSorted.sort(listItemSorter)
      this.updateTempInstitutions('New')
    },
    validateInstitutions($event: ListItem) {
      if (this.item >= this.tempInstitutionSorted.length) {
        return true
      }
      this.tempInstitutionSorted[this.item] = $event
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        if (!this.tempInstitutionSorted[i].valid) {
          this.validInstitutions = false
          return
        }
      }
      this.validInstitutions = true
    },
    saveAll() {
      this.info = true
      const institutions = this.tempInstitutionSorted.map(
        (listItem: ListItem) => listItem.item
      )
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
      this.tempInstitutionSorted = JSON.parse(
        JSON.stringify(this.institutions)
      ).map((institution: Institution) => new ListItem(institution, true))
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        const item = this.tempInstitutionSorted[i].item as Institution
        for (let j = 0; j < item.panels.length; j++) {
          if (this.panelNames.indexOf(item.panels[j]) == -1) {
            const institution = this.tempInstitutionSorted[i]
              .item as Institution
            institution.panels = []
            break
          }
        }
      }
      this.panels.map((p: GenePanelDetails) => p.name)
    },
    updateTempInstitutions(name: string) {
      this.tempInstitutionSorted.sort(listItemSorter)
      for (let i = 0; i < this.tempInstitutionSorted.length; i++) {
        if (this.tempInstitutionSorted[i].item.name === name) {
          const item = i.toString()
          this.$router.replace({ params: { ...this.$route.params, item } })
          break
        }
      }
      this.info = true
    },
    deleteInstitution(index: number) {
      console.log('deleting institution')
      if (index != null) {
        this.tempInstitutionSorted.splice(index, 1)
      } else {
        this.tempInstitutionSorted.splice(this.item, 1)
      }
      this.info = true
    },
    resetAll() {
      this.resetInstitutions().then(() => {
        this.updateTempInstitutionsFromStore()
      })
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
    item(): number {
      return Number.parseInt(this.$route.params.item)
    },
  },
  mounted() {
    this.updateTempInstitutionsFromStore()
  },
})
</script>

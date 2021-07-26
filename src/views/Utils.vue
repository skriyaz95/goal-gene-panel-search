<template>
  <div>
    <v-toolbar class="primary" dark flat dense>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            href="https://github.com/skriyaz95/goal-gene-panel-search"
            target="_blank"
            text
            v-on="on"
          >
            <span class="mr-2">{{ $t('button.link.repo.text') }}</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('button.link.repo.tooltip') }}</span>
      </v-tooltip>
    </v-toolbar>
    <main-content-template :twoCols="false" header outter>
      <template v-slot:header>
        <v-tabs centered v-model="tab" :background-color="background">
          <v-tab
            :href="'#' + tabTitle"
            v-for="tabTitle in tabs"
            :key="tabTitle"
          >
            {{ tabTitle }}
          </v-tab>
        </v-tabs>
      </template>
      <template v-slot:one-col>
        <v-tabs-items v-model="tab" class="background">
          <v-tab-item value="panels">
            <build-panels />
          </v-tab-item>
          <v-tab-item value="institutions">
            <build-explore-institutions
              :editable="true"
              v-model="item"
              @change="handleItemChanged($event)"
              @update="handleInstitutionUpdate($event)"
            />
          </v-tab-item>
          <v-tab-item value="database">
            <build-database />
          </v-tab-item>
          <v-tab-item value="theme">
            <theme-picker />
          </v-tab-item>
          <v-tab-item value="cookies">
            <gdpr-info />
          </v-tab-item>
        </v-tabs-items>
      </template>
    </main-content-template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BuildPanels from '@/components/BuildPanels.vue'
import ThemePicker from '@/components/ThemePicker.vue'
import BuildDatabase from '@/components/BuildDatabase.vue'
import BuildExploreInstitutions from '@/components/BuildExploreInstitutions.vue'
import { TranslateResult } from 'vue-i18n'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import GdprInfo from '@/components/GdprInfo.vue'
import { mapGetters, mapActions } from 'vuex'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'

export default Vue.extend({
  name: 'Utils',

  components: {
    BuildPanels,
    ThemePicker,
    BuildDatabase,
    BuildExploreInstitutions,
    MainContentTemplate,
    GdprInfo,
  },
  data: () => ({
    tabs: ['panels', 'institutions', 'database', 'theme', 'cookies'],
  }),
  methods: {
    ...mapActions(['updateLastItemUtils', 'updateLastTabUtils']),
    handleItemChanged(item: Number): any {
      if (item != undefined && item != null && item.toString() != this.item) {
        this.item = item.toString()
      }
    },
    handleInstitutionUpdate(index: Number): any {
      if (index >= 0) {
        this.handleItemChanged(index)
      }
    },
    updateLastTab() {
      if (this.lastTab == '') {
        this.tab = this.$route.query.tab
        this.updateLastTabUtils(this.tab)
      } else {
        this.tab = this.lastTab
      }
    },
    updateLastItem() {
      if (this.lastItem == -1) {
        this.item = this.$route.query.item as string
        if (this.item != undefined && this.item != null) {
          this.updateLastItemUtils(Number.parseInt(this.item))
        }
      } else {
        this.item = this.lastItem
      }
    },
    /**
     * Use this on mounted to sync with lastTab and lastItem
     * also handles loading from full refresh by using the url query
     */
    updateLastTabAndItem() {
      console.log('here')
      this.updateLastTab()
      this.updateLastItem()
    },
  },
  mounted() {
    this.updateLastTabAndItem()
  },
  watch: {},
  computed: {
    ...mapGetters({
      lastTab: 'getLastTabUtils',
      lastItem: 'getLastItemUtils',
    }),
    tab: {
      set(tab: string) {
        const queryTab = this.$route.query.tab
        if (tab && tab !== queryTab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
          if (queryTab) {
            this.updateLastTabUtils(tab)
          }
        }
      },
      get(): string | (string | null)[] {
        return this.$route.query.tab
      },
    },
    item: {
      set(item: string) {
        const queryItem = this.$route.query.item
        if (item && item !== queryItem) {
          this.$router.replace({ query: { ...this.$route.query, item } })
          if (queryItem) {
            this.updateLastItemUtils(Number.parseInt(item))
          }
        }
      },
      get(): string | (string | null)[] {
        return this.$route.query.item
      },
    },
    background(): VuetifyThemeItem {
      return this.$vuetify.theme.themes.light.background
    },
    toolbarTitle(): TranslateResult {
      if (this.$route.meta && this.$route.meta.i18n) {
        return this.$t(this.$route.meta.i18n + '.toolbar.text')
      }
      return 'GTI'
    },
  },
})
</script>

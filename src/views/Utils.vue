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
            <build-explore-panels
              :editable="true"
              v-model="item"
              @change="handleItemChanged($event, 'panels')"
              @update="handlePanelUpdate($event)"
            />
          </v-tab-item>
          <v-tab-item value="institutions">
            <build-explore-institutions
              :editable="true"
              v-model="item"
              @change="handleItemChanged($event, 'institutions')"
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
import ThemePicker from '@/components/manage/ThemePicker.vue'
import BuildDatabase from '@/components/manage/BuildDatabase.vue'
import BuildExploreInstitutions from '@/components/manage/BuildExploreInstitutions.vue'
import BuildExplorePanels from '@/components/explore/BuildExplorePanels.vue'
import { TranslateResult } from 'vue-i18n'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import GdprInfo from '@/components/GdprInfo.vue'
import { mapGetters, mapActions } from 'vuex'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'

export default Vue.extend({
  name: 'Utils',

  components: {
    BuildExplorePanels,
    ThemePicker,
    BuildDatabase,
    BuildExploreInstitutions,
    MainContentTemplate,
    GdprInfo,
  },
  data: () => ({
    tabs: ['panels', 'institutions', 'database', 'theme', 'cookies'],
    mounting: true, //prevent update of lastPath until both tab and items are updated
  }),
  computed: {
    ...mapGetters({
      lastUtilsPath: 'getLastUtilsPath',
    }),
    tab: {
      set(tab: string) {
        if (tab != this.$route.query.tab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
          if (!this.mounting) {
            this.updateLastUtilsPath(this.$route.query)
          }
        }
      },
      get(): string | (string | null)[] {
        return this.$route.query.tab
      },
    },
    item: {
      set(item: string) {
        if (item != this.$route.query.item) {
          this.$router.replace({ query: { ...this.$route.query, item } })
          this.updateLastUtilsPath(this.$route.query)
          this.mounting = false
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
  methods: {
    ...mapActions(['updateLastUtilsPath']),
    handleItemChanged(item: Number, tab: String): any {
      if (
        item != undefined &&
        item != null &&
        item.toString() != this.item &&
        tab == this.tab
      ) {
        this.item = item.toString()
      }
    },
    handleInstitutionUpdate(index: Number): any {
      if (index >= 0) {
        this.handleItemChanged(index, 'institutions')
      }
    },
    handlePanelUpdate(index: Number): any {
      if (index >= 0) {
        this.handleItemChanged(index, 'panels')
      }
    },
    /**
     * Use this on mounted to sync with lastTab and lastItem
     * also handles loading from full refresh by using the url query
     */
    updateLastTabAndItem() {
      if (this.lastUtilsPath) {
        this.tab = this.lastUtilsPath.tab
        this.item = this.lastUtilsPath.item
      } else {
        if (this.$route.query.tab) {
          this.tab = this.$route.query.tab
        }
        if (this.$route.query.item) {
          this.item = this.$route.query.item
        }
      }
    },
  },
  mounted() {
    this.updateLastTabAndItem()
  },
  watch: {},
})
</script>

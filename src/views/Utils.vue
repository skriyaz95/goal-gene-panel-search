<template>
  <div>
    <v-toolbar class="primary" dark flat dense>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn :href="githubRepo" target="_blank" text v-on="on">
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
            {{ $t('navigation.tabs.' + tabTitle) }}
          </v-tab>
        </v-tabs>
      </template>
      <template v-slot:one-col>
        <v-tabs-items v-model="tab" class="background">
          <v-tab-item value="panels">
            <build-explore-panels :editable="true" />
          </v-tab-item>
          <v-tab-item value="institutions">
            <build-explore-institutions :editable="true" />
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
import { VuetifyThemeItem } from 'vuetify/types/services/theme'
import { GITHUB_REPO } from '@/utils/apis'

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
    githubRepo: GITHUB_REPO,
  }),
  computed: {
    tab: {
      set(tab: string) {
        const item = '0'
        this.$router.replace({ params: { ...this.$route.params, tab, item } })
      },
      get(): string | (string | null)[] {
        return this.$route.params.tab ? this.$route.params.tab : 'panels'
      },
    },
    background(): VuetifyThemeItem {
      return this.$vuetify.theme.themes.light.background
    },
    toolbarTitle(): TranslateResult {
      return this.$t('navigation.utils.toolbar.text')
    },
  },
  methods: {},
  mounted() {
    document.title = 'GTI ' + this.$t('navigation.utils.title.text')
  },
  watch: {},
})
</script>

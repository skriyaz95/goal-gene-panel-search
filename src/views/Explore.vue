<template>
  <div>
    <v-toolbar class="primary" dark flat dense>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
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
            <build-explore-panels> </build-explore-panels>
          </v-tab-item>
          <v-tab-item value="institutions">
            <build-explore-institutions
              :editable="false"
              :show-read-only-panels="true"
            />
          </v-tab-item>
          <v-tab-item value="genome">
            <human-genome-details></human-genome-details>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </main-content-template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import BuildExploreInstitutions from '@/components/manage/BuildExploreInstitutions.vue'
import BuildExplorePanels from '@/components/explore/BuildExplorePanels.vue'
import HumanGenomeDetails from '@/components/explore/HumanGenomeDetails.vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'

export default Vue.extend({
  components: {
    BuildExploreInstitutions,
    BuildExplorePanels,
    HumanGenomeDetails,
    MainContentTemplate,
  },
  name: 'Explore',
  props: {},
  data: () => ({
    tabs: ['panels', 'institutions', 'genome'],
  }),
  computed: {
    tab: {
      set(tab: string) {
        const item = '0'
        this.$router.replace({ params: { ...this.$route.params, tab, item } })
      },
      get(): string {
        return this.$route.params.tab ? this.$route.params.tab : 'panels'
      },
    },
    background(): VuetifyThemeItem {
      return this.$vuetify.theme.themes.light.background
    },
    toolbarTitle(): TranslateResult {
      return this.$t('navigation.explore.toolbar.text')
    },
  },
  methods: {},
  mounted() {
    document.title = 'GTI ' + this.$t('navigation.explore.title.text')
  },
})
</script>

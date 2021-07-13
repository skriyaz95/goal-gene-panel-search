<template>
  <div>
    <v-toolbar class="primary" dark flat>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-container class="pa-0" fluid>
      <v-tabs centered v-model="tab" :background-color="background">
        <v-tab :href="'#' + tabTitle" v-for="tabTitle in tabs" :key="tabTitle">
          {{ tabTitle }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="background">
        <v-tab-item value="panels">
          <explore-panels></explore-panels>
        </v-tab-item>
        <v-tab-item value="institutions">
          <build-institutions :editable="false" :show-read-only-panels="true" />
        </v-tab-item>
        <v-tab-item value="genome">
          <human-genome-details></human-genome-details>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import BuildInstitutions from '@/components/BuildInstitutions.vue'
import ExplorePanels from '@/components/explore/ExplorePanels.vue'
import { TranslateResult } from 'vue-i18n'
import HumanGenomeDetails from '@/components/explore/HumanGenomeDetails.vue'

export default Vue.extend({
  name: 'Explore',

  components: {
    BuildInstitutions,
    ExplorePanels,
    HumanGenomeDetails,
  },
  data() {
    return {
      tabs: ['panels', 'institutions', 'genome'],
    }
  },
  methods: {},
  mounted() {},
  watch: {},
  computed: {
    tab: {
      set(tab: string) {
        this.$router.replace({ query: { ...this.$route.query, tab } })
      },
      get() {
        return this.$route.query.tab
      },
    },
    background() {
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

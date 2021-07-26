<template>
  <div>
    <v-toolbar class="primary" dark flat>
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
            {{ tabTitle }}
          </v-tab>
        </v-tabs>
      </template>
      <template v-slot:one-col>
        <v-tabs-items v-model="tab" class="background">
          <v-tab-item value="panels">
            <explore-panels v-model="item" @change="handleItemChanged($event)">
            </explore-panels>
          </v-tab-item>
          <v-tab-item value="institutions">
            <build-institutions
              :editable="false"
              :show-read-only-panels="true"
              v-model="item"
              @change="handleItemChanged($event)"
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
import { mapGetters, mapActions } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import BuildInstitutions from '@/components/BuildInstitutions.vue'
import ExplorePanels from '@/components/explore/ExplorePanels.vue'
import HumanGenomeDetails from '@/components/explore/HumanGenomeDetails.vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'

export default Vue.extend({
  components: {
    BuildInstitutions,
    ExplorePanels,
    HumanGenomeDetails,
    MainContentTemplate,
  },
  name: 'Explore',
  props: {},
  data: () => ({
    tabs: ['panels', 'institutions', 'genome'],
  }),
  computed: {
    ...mapGetters({
      lastTab: 'getLastTabExplore',
      lastItem: 'getLastItemExplore',
    }),
    tab: {
      set(tab: string) {
        const queryTab = this.$route.query.tab
        if (tab && tab !== queryTab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
          if (queryTab) {
            this.updateLastTabExplore(tab)
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
            this.updateLastItemExplore(Number.parseInt(item))
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
  methods: {
    ...mapActions(['updateLastItemExplore', 'updateLastTabExplore']),
    handleItemChanged(item: Number): any {
      if (item != undefined && item.toString() != this.item) {
        this.item = item.toString()
      }
    },
    updateLastTab() {
      if (this.lastTab == '') {
        this.tab = this.$route.query.tab
        this.updateLastTabExplore(this.tab)
      } else {
        this.tab = this.lastTab
      }
    },
    updateLastItem() {
      if (this.lastItem == -1) {
        this.item = this.$route.query.item as string
        this.updateLastItemExplore(Number.parseInt(this.item))
      } else {
        this.item = this.lastItem
      }
    },
    /**
     * Use this on mounted to sync with lastTab and lastItem
     * also handles loading from full refresh by using the url query
     */
    updateLastTabAndItem() {
      this.updateLastTab()
      this.updateLastItem()
    },
  },
  mounted() {
    this.updateLastTabAndItem()
  },
})
</script>

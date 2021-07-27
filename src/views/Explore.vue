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
            {{ tabTitle }}
          </v-tab>
        </v-tabs>
      </template>
      <template v-slot:one-col>
        <v-tabs-items v-model="tab" class="background">
          <v-tab-item value="panels">
            <explore-panels
              v-model="item"
              @change="handleItemChanged($event, 'panels')"
            >
            </explore-panels>
          </v-tab-item>
          <v-tab-item value="institutions">
            <build-explore-institutions
              :editable="false"
              :show-read-only-panels="true"
              v-model="item"
              @change="handleItemChanged($event, 'institutions')"
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
import BuildExploreInstitutions from '@/components/BuildExploreInstitutions.vue'
import ExplorePanels from '@/components/explore/ExplorePanels.vue'
import HumanGenomeDetails from '@/components/explore/HumanGenomeDetails.vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'

export default Vue.extend({
  components: {
    BuildExploreInstitutions,
    ExplorePanels,
    HumanGenomeDetails,
    MainContentTemplate,
  },
  name: 'Explore',
  props: {},
  data: () => ({
    tabs: ['panels', 'institutions', 'genome'],
    mounting: true, //prevent update of lastPath until both tab and items are updated
  }),
  computed: {
    ...mapGetters({
      lastExplorePath: 'getLastExplorePath',
    }),
    tab: {
      set(tab: string) {
        if (tab != this.$route.query.tab) {
          this.$router.replace({ query: { ...this.$route.query, tab } })
          if (!this.mounting) {
            this.updateLastExplorePath(this.$route.query)
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
          this.updateLastExplorePath(this.$route.query)
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
    ...mapActions(['updateLastExplorePath']),
    handleItemChanged(item: Number, tab: String): any {
      console.log(item, tab)
      if (
        item != undefined &&
        item != null &&
        item.toString() != this.item &&
        tab == this.tab
      ) {
        this.item = item.toString()
      }
    },
    /**
     * Use this on mounted to sync with lastTab and lastItem
     * also handles loading from full refresh by using the url query
     */
    updateLastTabAndItem() {
      if (this.lastExplorePath) {
        this.tab = this.lastExplorePath.tab
        this.item = this.lastExplorePath.item
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
    console.log('explore')
    this.updateLastTabAndItem()
  },
})
</script>

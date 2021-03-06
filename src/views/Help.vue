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
          <v-tab-item value="files">
            <file-formats> </file-formats>
          </v-tab-item>
          <v-tab-item value="install">
            <install-app> </install-app>
          </v-tab-item>
          <v-tab-item value="manage">
            <manage-app> </manage-app>
          </v-tab-item>
        </v-tabs-items>
      </template>
    </main-content-template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { TranslateResult } from 'vue-i18n'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import FileFormats from '@/components/help/FileFormats.vue'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'
import InstallApp from '@/components/help/InstallApp.vue'
import ManageApp from '@/components/help/ManageApp.vue'

export default Vue.extend({
  components: {
    MainContentTemplate,
    FileFormats,
    InstallApp,
    ManageApp,
  },
  name: 'Help',
  props: {},
  data: () => ({
    tabs: ['files', 'install', 'manage'],
  }),
  computed: {
    tab: {
      set(tab: string) {
        this.$router.replace({ params: { ...this.$route.params, tab } })
      },
      get(): string {
        return this.$route.params.tab ? this.$route.params.tab : 'files'
      },
    },
    background(): VuetifyThemeItem {
      return this.$vuetify.theme.themes.light.background
    },
    toolbarTitle(): TranslateResult {
      return this.$t('navigation.help.toolbar.text')
    },
  },
  methods: {},
  mounted() {
    document.title = 'GTI ' + this.$t('navigation.help.title.text')
  },
})
</script>

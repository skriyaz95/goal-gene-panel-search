<template>
  <v-container>
    <v-tabs centered v-model="tab">
      <v-tab :href="'#' + tabTitle" v-for="tabTitle in tabs" :key="tabTitle">
        {{ tabTitle }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item value="panels">
        <build-panels />
      </v-tab-item>
      <v-tab-item value="institutions">
        <build-institutions />
      </v-tab-item>
      <v-tab-item value="database">
        <build-database />
      </v-tab-item>
      <v-tab-item value="theme">
        <theme-picker />
      </v-tab-item>
    </v-tabs-items>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import BuildPanels from '../components/BuildPanels.vue'
import ThemePicker from '../components/ThemePicker.vue'
import BuildDatabase from '../components/BuildDatabase.vue'
import BuildInstitutions from '../components/BuildInstitutions.vue'

export default Vue.extend({
  name: 'Utils',

  components: {
    BuildPanels,
    ThemePicker,
    BuildDatabase,
    BuildInstitutions,
  },
  data() {
    return {
      tabs: ['panels', 'institutions', 'database', 'theme'],
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
  },
})
</script>

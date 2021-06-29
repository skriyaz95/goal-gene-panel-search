<template>
  <v-container>
    <v-tabs centered v-model="tab">
      <v-tab>Panels</v-tab>
      <v-tab>Database</v-tab>
      <v-tab>Theme</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <build-panels />
      </v-tab-item>
      <v-tab-item>
        <build-database />
      </v-tab-item>
      <v-tab-item>
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

export default Vue.extend({
  name: 'Utils',

  components: {
    BuildPanels,
    ThemePicker,
    BuildDatabase,
  },
  data() {
    return {
      tab: null,
    }
  },
})
</script>

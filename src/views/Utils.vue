<template>
  <div>
    <theme-picker />
    <build-panels />
    <build-database />
  </div>
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
})
</script>

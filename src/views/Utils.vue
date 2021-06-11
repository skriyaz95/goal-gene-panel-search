<template>
  <div>
    <theme-picker />
    <build-panels />
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import BuildPanels from '../components/BuildPanels.vue'
  import ThemePicker from '../components/ThemePicker.vue'

  export default Vue.extend({
    name: 'Utils',

    components: {
      BuildPanels, ThemePicker
    },
  })
</script>

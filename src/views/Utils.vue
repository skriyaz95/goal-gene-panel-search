<template>
  <build-panels />
</template>

<script lang="ts">
  import Vue from 'vue'
  import BuildPanels from '../components/BuildPanels.vue'

  export default Vue.extend({
    name: 'Utils',

    components: {
      BuildPanels,
    },
  })
</script>

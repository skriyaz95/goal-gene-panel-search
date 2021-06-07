<template>
  <home-page />
</template>

<script lang="ts">
  import Vue from 'vue'
  import HomePage from '../components/HomePage.vue'

  export default Vue.extend({
    name: 'Home',

    components: {
      HomePage,
    },
  })
</script>

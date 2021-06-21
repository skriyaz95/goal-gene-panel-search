<template>
  <v-container fluid class="my-3">
    <v-row class="text-center">
      <v-col cols="12" lg="6">
        <user-input/>
      </v-col>
      <v-col cols="12" lg="6">
        <panel-result/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import UserInput from "@/components/home/UserInput.vue"
import PanelResult from "@/components/home/PanelResult.vue";

export default Vue.extend({
  name: 'HomePage',
  components: {
    UserInput,
    PanelResult
  }
})
</script>

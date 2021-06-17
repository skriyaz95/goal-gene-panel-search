<template>
  <v-container fluid class="my-3">
    <v-row class="text-center">
      <v-col cols="12" lg="6">
        <user-input/>
      </v-col>
      <v-col cols="12" lg="6">
        <v-card outlined>
          <v-card-title>
            Result
          </v-card-title>
          <v-card-text>{{ getUserGenesInPanels }}</v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import UserInput from "@/components/home/UserInput.vue"
  import {mapGetters} from "vuex"

  export default Vue.extend({
    name: 'HomePage',
    components: {
      UserInput,
    },
    computed: {
      ...mapGetters({
        getUserGenesInPanels: "getUserGenesInPanels",
      }),
    }
  })
</script>

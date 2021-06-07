<template>
  <v-container fluid>
    <v-row class="text-center">
      <v-col cols="12" lg="6">
        <div>User Input Component Here</div>
        <v-card>
          <v-card-title>
            Preferably a v-card like this
          </v-card-title>
          <v-card-text>Using it's own component</v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" lg="6">
        <div>Panel Result Component Here</div>
        <v-card>
          <v-card-title>
            Preferably a v-card like this
          </v-card-title>
          <v-card-text>Using it's own component</v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'HelloWorld',

    data: () => ({
    }),
  })
</script>

<template>
  <v-container fluid class="mt-2">
    <v-row class="text-center" dense>
      <v-col cols="12" lg="3">
        <user-input :help="showHelp" @help="showHelp = !showHelp" />
      </v-col>
      <v-col cols="12" lg="9">
        <panel-result :help="showHelp" @help="showHelp = !showHelp" />
      </v-col>
      <v-col cols="12" lg="6">
        <parsed-input :help="showHelp" @help="showHelp = !showHelp" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import UserInput from '@/components/home/UserInput.vue'
import ParsedInput from '@/components/home/ParsedInput.vue'
import PanelResult from '@/components/home/PanelResult.vue'

export default Vue.extend({
  name: 'HomePage',
  components: {
    UserInput,
    ParsedInput,
    PanelResult,
  },
  data() {
    return {
      showHelp: false,
    }
  },
})
</script>

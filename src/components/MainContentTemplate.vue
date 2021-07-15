<template>
  <v-container fluid :class="[outter ? 'px-3' : 'px-0', tab ? 'py-3' : 'py-0']">
    <v-row class="text-start" dense>
      <v-col cols="12" :lg="cols == 2 ? 4 : 3" v-if="cols == 2">
        <slot name="left-col"></slot>
      </v-col>
      <v-col cols="12" lg="3" v-if="cols == 3">
        <slot name="middle-col"></slot>
      </v-col>
      <v-col cols="12" :lg="cols == 2 ? 8 : 6" v-if="cols == 2">
        <slot name="right-col"></slot>
      </v-col>
      <v-col cols="12" v-if="cols == 1">
        <slot name="one-col"></slot>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainContentTemplate',
  props: {
    cols: {
      type: Number,
      default: 2,
    },
    outter: {
      type: Boolean,
      default: false,
    },
    tab: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<template>
  <v-container
    fluid
    :class="[outter ? 'px-3' : 'px-0', header ? 'py-0' : 'py-0']"
  >
    <v-row class="text-start" dense>
      <v-col cols="12" v-if="header" class="height48 mb-2" align-self="center">
        <slot name="header"></slot>
      </v-col>
      <template v-if="twoCols">
        <v-col cols="12" :md="even ? 6 : 4" v-show="!hideLeft">
          <slot name="left-col"></slot>
        </v-col>
        <v-col cols="12" :md="rightColWidth">
          <slot name="right-col"></slot>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12">
          <slot name="one-col"></slot>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'MainContentTemplate',
  props: {
    twoCols: {
      type: Boolean,
      default: true,
    },
    outter: {
      type: Boolean,
      default: false,
    },
    header: {
      type: Boolean,
      default: false,
    },
    even: {
      type: Boolean,
      default: false,
    },
    hideLeft: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    rightColWidth() {
      if (this.hideLeft) {
        return 12
      }
      return this.even ? 6 : 8
    },
  },
})
</script>

<style scoped>
.height48 {
  height: 48px;
  min-height: 48px;
}
</style>
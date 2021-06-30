/**
A v-alert info wrapped in a transition with defualt app colors
 */
<template>
  <v-fade-transition>
    <v-alert
      dense
      text
      type="info"
      color="primary"
      v-if="active"
      class="text-left"
    >
      <slot name="content"></slot>
    </v-alert>
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'InfoAlert',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {},
})
</script>

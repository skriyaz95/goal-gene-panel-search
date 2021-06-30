/**
A button to toggle help either when hovering (tooltip)
or when clicking.
Use event 'action' to handle what happens when the button is clicked.
For instance, display other component helps at the same time
 */
<template>
  <v-tooltip bottom :disabled="active">
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" @click.stop="handleClick()" icon :class="isActive">
        <v-icon>mdi-help-circle-outline</v-icon>
      </v-btn>
    </template>
    <slot name="content"></slot>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'HelpButton',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({}),
  computed: {
    isActive() {
      return this.active ? 'primary--text' : ''
    },
  },
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    handleClick() {
      this.$emit('action')
    },
  },
})
</script>

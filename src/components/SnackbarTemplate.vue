<template>
  <v-snackbar
    :multi-line="multiLine"
  >
    <slot name="content"></slot>
    <template v-slot:action="{ attrs }">
      <v-btn
        color="red"
        text
        v-bind="attrs"
        @click="close()"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'SnackBarTemplate',
  props: ['multiLine'],
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    close() {
      this.$emit('closing')
    },
  },
})
</script>

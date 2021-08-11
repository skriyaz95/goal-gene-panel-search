<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    :max-width="maxWidth"
  >
    <v-card>
      <v-toolbar class="primary title pr-2" flat dark dense>
        <slot name="title"></slot>
        <v-spacer></v-spacer>
        <slot name="toolbar-buttons"></slot>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="close()" icon dark small>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('panel-result.dialog.button.close') }}</span>
        </v-tooltip>
      </v-toolbar>

      <v-card-text>
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="action-buttons"></slot>
        <v-btn @click="close()">
          {{ $t('panel-result.dialog.button.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'DialogTemplate',
  props: ['value', 'maxWidth'],
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

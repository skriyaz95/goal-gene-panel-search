<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    :max-width="maxWidth"
    scrollable
  >
    <v-card>
      <v-toolbar fixed class="primary title pr-2" flat dark dense>
        <slot name="title"></slot>
        <v-spacer></v-spacer>
        <slot name="toolbar-buttons"></slot>
        <help-button @action="handleHelp()" :active="help">
          <template v-slot:content>
            <span>
              {{ $t('button.showHide.tooltip') }}
              {{ $t('button.help.text') }}
            </span>
          </template>
        </help-button>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" @click="close()" icon dark small>
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <span>{{ $t('panelResult.dialog.button.close') }}</span>
        </v-tooltip>
      </v-toolbar>

      <v-card-text class="pa-3">
        <slot name="content"></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <slot name="action-buttons"></slot>
        <v-btn @click="close()">
          {{ $t('panelResult.dialog.button.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import HelpButton from '@/components/help/HelpButton.vue'

export default Vue.extend({
  name: 'DialogTemplate',
  components: {
    HelpButton,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    maxWidth: {
      type: String,
      default: '',
    },
    help: {
      type: Boolean,
      default: true,
    },
  },
  data: () => ({}),
  computed: {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    close() {
      this.$emit('closing')
    },
    handleHelp() {
      this.$emit('help')
    }
  },
})
</script>

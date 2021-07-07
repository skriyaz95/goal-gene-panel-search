<template>
  <div>
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-dna</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ panel.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-bank</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            {{ institution }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-database</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> Symbols Synonyms Not Found </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div>
      <v-chip class="mr-2 mb-2" v-for="gene in panel.genes" :key="gene.name">
        {{ gene.name }}
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import { GenePanel } from '@/types/panel-types'
import Vue from 'vue'

export default Vue.extend({
  components: {},
  name: 'PanelDetails',
  props: {
    panel: {
      type: Object,
      default: () => new GenePanel('', []),
    },
    institution: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {},
})
</script>

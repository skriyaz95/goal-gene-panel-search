<template>
  <v-row class="pl-2 pb-3" align-content="center">
    <v-col class="flex-grow-0 flex-shrink-1 text-no-wrap" align-self="center">
      <div v-if="!empty">{{ $t('userInput.recall.title.text') }}:</div>
      <div v-else>{{ $t('userInput.recall.empty.text') }}</div>
    </v-col>
    <v-col class="flex-grow-1 flex-shrink-0">
      <v-btn
        v-for="(search, index) in lastSearches"
        :key="index"
        class="primary--text"
        @click="fillLastSearch(search)"
        text
      >
        <span>{{ lastSearchLabel(search) }}</span>
        <v-icon right>mdi-magnify</v-icon>
      </v-btn>
    </v-col>
    <v-col class="flex-grow-0 flex-shrink-1">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            :disabled="empty"
            v-on="on"
            icon
            @click="resetLastSearches"
            class="primary--text"
          >
            <v-icon>mdi-close-circle</v-icon>
          </v-btn>
        </template>
        <span>
          {{ $t('userInput.recall.clear.text') }}
        </span>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},
  name: 'RecallSearches',
  props: {
    lastSearches: {
      type: [],
      default: () => [],
    },
  },
  data: () => ({}),
  computed: {
    empty() {
      return this.lastSearches.length == 0
    },
  },
  watch: {},
  methods: {
    fillLastSearch(search: string) {
      this.$emit('recallLastSearch', search)
    },
    lastSearchLabel(search: string) {
      if (search.length > 5) {
        return search.substring(0, 5) + '...'
      }
      return search
    },
    resetLastSearches() {
      this.$emit('resetLastSearches')
    },
  },
  mounted() {},
})
</script>

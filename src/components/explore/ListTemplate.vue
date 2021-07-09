/* eslint-disable vue/html-indent */
<template>
  <v-card outlined>
    <v-card-title>
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text>
      <v-autocomplete
        :value="value"
        :label="$t('input.details.text')"
        clearable
        :items="searchableItems"
        @change="handleEvent($event)"
      ></v-autocomplete>
      <v-list-item-group
        :value="value"
        active-class="primary lighten-2 font-weight-bold"
        @change="handleEvent($event)"
      >
        <v-list>
          <v-list-item v-for="(item, index) in itemsSorted" :key="index">
            <v-list-item-icon>
              <v-icon>mdi-dna</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ item[fieldItemLabel] }}
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list-item-group>
    </v-card-text>
    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {},
  name: 'ListTemplate',
  props: {
    value: Number,
    fieldItemLabel: { type: String, default: 'name' },
    itemsSorted: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({}),
  methods: {
    handleEvent($event: any) {
      this.$emit('change', $event)
    },
  },
  computed: {
    searchableItems() {
      const items = this.itemsSorted.map((i: any, index: Number) => {
        const text = i[this.fieldItemLabel]
        return { text: text, value: index }
      })
      return items
    },
  },
  mounted() {},
})
</script>

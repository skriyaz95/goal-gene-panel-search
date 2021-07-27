/* eslint-disable vue/html-indent */
<template>
  <v-card outlined>
    <v-card-title>
      <slot name="title"></slot>
    </v-card-title>
    <v-card-text>
      <slot name="info"></slot>
      <v-autocomplete
        :label="$t(dropDownLabel)"
        clearable
        :items="searchableItems"
        :value="Number.parseInt(value)"
        @input="handleInput($event)"
      ></v-autocomplete>
      <v-list-item-group
        active-class="primary lighten-2 font-weight-bold"
        :value="Number.parseInt(value)"
        @change="handleChange($event)"
        mandatory
      >
        <v-list>
          <v-list-item v-for="(item, index) in itemsSorted" :key="index">
            <v-list-item-icon>
              <v-icon>mdi-dna</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              {{ item[fieldItemLabel] }}
            </v-list-item-content>
            <v-list-item-action v-if="editable">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon @click="handleDelete(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t('buildInstitutions.delete.tooltip') }}</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-list-item-group>
    </v-card-text>
    <v-card-actions class="px-4">
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
    value: { type: String, default: '0' },
    fieldItemLabel: { type: String, default: 'name' },
    dropDownLabel: { type: String, default: 'input.details.text' },
    itemsSorted: {
      type: Array,
      default: () => [],
    },
    editable: Boolean,
  },
  data: () => ({}),
  methods: {
    handleChange($event: any) {
      this.$emit('change', $event)
    },
    handleInput($event: any) {
      this.$emit('input', $event)
    },
    handleDelete(index: Number) {
      this.$emit('delete', index)
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

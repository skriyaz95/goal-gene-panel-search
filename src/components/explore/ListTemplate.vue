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
        :value="item"
        @change="handleChange"
      ></v-autocomplete>
      <v-list nav dense>
        <v-list-item
          v-for="(item, index) in itemsSorted"
          :key="index"
          :to="{ params: { item: index } }"
          :active-class="activeClassExact"
        >
          <v-list-item-icon>
            <v-icon :class="textColor(item.valid)">{{ icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content :class="textColor(item.valid)">
            {{ item[fieldItemLabel][fieldNameLabel] }}
          </v-list-item-content>
          <v-list-item-action v-if="editable" class="my-0">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon @click.prevent="handleDelete(index)">
                  <v-icon :class="textColor(item.valid)">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buildInstitutions.delete.tooltip') }}</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list>
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
    fieldItemLabel: { type: String, default: 'item' },
    fieldNameLabel: { type: String, default: 'name' },
    dropDownLabel: { type: String, default: 'input.details.text' },
    itemsSorted: {
      type: Array,
      default: () => [],
    },
    editable: Boolean,
    icon: { type: String, default: 'mdi-dna' },
    navName: { type: String, default: 'explore' },
  },
  data: () => ({
    activeClass: 'primary lighten-1 font-weight-bold',
    activeClassExact: 'primary lighten-2 font-weight-bold',
  }),
  methods: {
    handleChange($event: any) {
      console.log($event)
      const item = $event
      this.$router.replace({ params: { ...this.$route.params, item } })
      // this.$emit('change', $event)
    },
    handleDelete(index: Number) {
      this.$emit('delete', index)
    },
    textColor(valid: boolean) {
      return !valid ? 'red--text' : ''
    },
  },
  computed: {
    searchableItems() {
      const items = this.itemsSorted.map((i: any, index: Number) => {
        const text = i[this.fieldItemLabel][this.fieldNameLabel]
        return { text: text, value: index }
      })
      return items
    },
    item(): number {
      return Number.parseInt(this.$route.params.item)
    },
  },
  mounted() {},
})
</script>

/* eslint-disable vue/html-indent */
<template>
  <div>
    <div class="pb-2">{{ title }}:</div>
    <v-color-picker mode="hexa" v-model="color" @update:color="updateColor"></v-color-picker>
  </div>
          
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ColorPicker",
  props: {
    title: String,
    defaultColor: String
  },
  data: () => ({
    color: ""
  }),
  methods: {
    updateColor() {
      this.$emit("update-color", this.color);
    }
  },
  computed: {
  },
  mounted() {
    this.color = this.defaultColor;
  },
});
</script>

/* eslint-disable vue/html-indent */
<template>
  <div>
    <div class="pb-2">
      {{ title }}:
    </div>
    <v-color-picker
      v-model="color"
      mode="hexa"
      @update:color="updateColor"
    />
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
  computed: {
  },
  mounted() {
    this.color = this.defaultColor;
  },
  methods: {
    updateColor() {
      this.$emit("update-color", this.color);
    }
  },
});
</script>

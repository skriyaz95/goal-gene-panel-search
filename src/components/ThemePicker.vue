/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col cols="6" lg="3">
                <color-picker :title="$t('themePicker.primary.text')"
                              :defaultColor="getPrimary()" @update-color="updatePrimary"/>

              </v-col>
              <v-col cols="6" lg="3">
                <color-picker :title="$t('themePicker.secondary.text')"
                              :defaultColor="getSecondary()" @update-color="updateSecondary"/>

              </v-col>
              <v-col cols="12" lg="6">
                <a href="https://vuetifyjs.com/en/styles/colors/#material-colors"
                   target="_blank" >Vuetify Material Colors</a><br/><br/>
                <div class="mb-2" >{{$t('themePicker.result.text')}}:</div>
                <pre v-html="formatThemeResult()"></pre>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import ColorPicker from "@/components/ColorPicker.vue"

export default Vue.extend({
  name: "ThemePicker",
components: { ColorPicker
},
 data: () => ({
  }),
  methods: {
     getPrimary() {
       return this.$vuetify.theme.themes[this.theme].primary;
    },
      getSecondary() {
       return this.$vuetify.theme.themes[this.theme].secondary;
    },
      updatePrimary(color: string) {
       return this.$vuetify.theme.themes[this.theme].primary = color;
    },
      updateSecondary(color: string) {
       return this.$vuetify.theme.themes[this.theme].secondary = color;
    },
    formatThemeResult() {
      var json = {
        primary: this.getPrimary(),
        secondary: this.getSecondary()
      };
      return JSON.stringify(json, null, 2);
    }
  },
  computed: {
     theme() {
       if (this.$vuetify.theme.dark) {
         return "dark";
       }
       else {
         return "light";
       }
     },
  },
  mounted() {
  },
});
</script>

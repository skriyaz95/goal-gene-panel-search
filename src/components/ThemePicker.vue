/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
                lg="2"
              >
                <v-radio-group
                  v-model="themeSelected"
                  @change="changeTheme"
                >
                  <v-radio
                    v-for="n in themes.length"
                    :key="n"
                    :label="getThemeLabel(n)"
                    :value="n"
                  />
                </v-radio-group>
              </v-col>
              <v-col
                cols="6"
                lg="3"
              >
                <color-picker
                  :title="$t('themePicker.primary.text')"
                  :default-color="getPrimary()"
                  @update-color="updatePrimary"
                />
              </v-col>
              <v-col
                cols="6"
                lg="3"
              >
                <color-picker
                  :title="$t('themePicker.secondary.text')"
                  :default-color="getSecondary()"
                  @update-color="updateSecondary"
                />
              </v-col>
              <v-col
                cols="12"
                lg="4"
              >
                <a
                  href="https://vuetifyjs.com/en/styles/colors/#material-colors"
                  target="_blank"
                >Vuetify Material Colors</a><br><br>
                <div class="mb-2">
                  {{ $t('themePicker.result.text') }}:
                </div>
                <pre v-html="formatThemeResult()" />
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
import { lightThemes } from "@/plugins/vuetify"

export default Vue.extend({
  name: "ThemePicker",
components: { ColorPicker
},
 data: () => ({
   themeSelected: -1,
   themes: lightThemes
  }),
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
    this.changeTheme();
  },
  methods: {
     getPrimary() {
       return this.$vuetify.theme.themes[this.theme].primary;
    },
      getSecondary() {
       return this.$vuetify.theme.themes[this.theme].secondary;
    },
      updatePrimary(color: string) {
        if (this.isValidColor(color)) {
          this.$vuetify.theme.themes[this.theme].primary = color;
        }
    },
      updateSecondary(color: string) {
        if (this.isValidColor(color)) {
       this.$vuetify.theme.themes[this.theme].secondary = color;
        }
    },
    formatThemeResult() {
      var json = {
        primary: this.getPrimary(),
        secondary: this.getSecondary()
      };
      return JSON.stringify(json, null, 2);
    },
    isValidColor(color: string) {
      return color != "#FF0000FF";
    },
    changeTheme() {
      if (this.themeSelected > -1) {
        this.updatePrimary(this.themes[this.themeSelected - 1].primary);
        this.updateSecondary(this.themes[this.themeSelected - 1].secondary);
      }
    },
    getThemeLabel(n: number) {
      return this.$t("themePicker.button.theme.text") + " #" + n;
    }
  },
});
</script>

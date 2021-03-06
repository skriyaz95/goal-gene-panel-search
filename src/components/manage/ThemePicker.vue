<template>
  <main-content-template :twoCols="false" inner>
    <template v-slot:one-col>
      <v-card outlined>
        <v-card-text>
          <v-row>
            <v-col cols="6" lg="2">
              <v-radio-group v-model="themeSelected" @change="changeTheme">
                <v-radio
                  v-for="n in themes.length"
                  :key="n"
                  :label="getThemeLabel(n)"
                  :value="n"
                />
              </v-radio-group>
            </v-col>
            <v-col cols="6" lg="6">
              <v-row>
                <v-col cols="4">
                  <color-picker
                    :title="$t('themePicker.primary.text')"
                    :default-color="getPrimary()"
                    @update-color="updatePrimary"
                  />
                </v-col>
                <v-col cols="4">
                  <color-picker
                    :title="$t('themePicker.secondary.text')"
                    :default-color="getSecondary()"
                    @update-color="updateSecondary"
                  />
                </v-col>
                <v-col cols="4">
                  <div class="pb-6">
                    {{ $t('themePicker.logo.color.title.text') }}:
                  </div>
                  <v-slider
                    class="mt-2"
                    v-model="hueRotation"
                    @input="updateHueRotation"
                    min="0"
                    max="359"
                    thumb-label="always"
                    label="hue"
                  />
                  <v-slider
                    v-model="saturation"
                    @input="updateSaturation"
                    min="0"
                    max="10"
                    thumb-label="always"
                    step="0.1"
                    label="sat"
                  />
                  <div>{{ $t('themePicker.logo.explain.text') }}</div>
                </v-col>
                <v-col cols="8" align-self="end">
                  <gene-entry-title
                    :state="geneState.INVALID"
                    :count="1"
                    :tooltip="
                      $t('explore.panelDetails.invalid.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                  <gene-entry-title
                    :state="geneState.SYNONYM"
                    :count="2"
                    :tooltip="
                      $t('explore.panelDetails.invalid.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                  <gene-entry-title
                    :state="geneState.SYMBOL"
                    :count="3"
                    :tooltip="
                      $t('explore.panelDetails.invalid.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                  <gene-entry-title
                    :state="geneState.FUSION"
                    :count="4"
                    :tooltip="
                      $t('explore.panelDetails.invalid.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                  <gene-entry-title
                    :state="geneState.INTRON"
                    :count="5"
                    :tooltip="
                      $t('explore.panelDetails.invalid.tooltip').toString()
                    "
                  >
                  </gene-entry-title>
                </v-col>
                <v-col cols="4">
                  <v-switch
                    @click="updateChipOutlined(!chipOutlined)"
                    :label="$t('button.outlined.text')"
                    color="primary"
                    hide-details
                    :input-value="chipOutlined"
                  >
                  </v-switch>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" lg="4">
              <a
                href="https://vuetifyjs.com/en/styles/colors/#material-colors"
                target="_blank"
              >
                Vuetify Material Colors
              </a>
              <br /><br />
              <div class="mb-2">{{ $t('themePicker.result.text') }}:</div>
              <pre v-html="formatThemeResult()" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
  </main-content-template>
</template>

<script lang="ts">
import Vue from 'vue'
import ColorPicker from '@/components/ColorPicker.vue'
import { lightThemes } from '@/plugins/vuetify'
import { mapGetters, mapActions } from 'vuex'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import { GeneState } from '@/types/ui-types'
import GeneEntryTitle from '@/components/GeneEntryTitle.vue'

export default Vue.extend({
  name: 'ThemePicker',
  components: { ColorPicker, MainContentTemplate, GeneEntryTitle },
  data: () => ({
    themeSelected: -1,
    themes: lightThemes,
    hueRotation: 0,
    saturation: 1,
    geneState: GeneState,
  }),
  computed: {
    theme() {
      if (this.$vuetify.theme.dark) {
        return 'dark'
      } else {
        return 'light'
      }
    },
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
  },
  mounted() {
    this.changeTheme()
  },
  methods: {
    ...mapActions(['updateChipOutlined']),
    getPrimary() {
      return this.$vuetify.theme.themes[this.theme].primary
    },
    getSecondary() {
      return this.$vuetify.theme.themes[this.theme].secondary
    },
    updatePrimary(color: string) {
      if (this.isValidColor(color)) {
        this.$vuetify.theme.themes[this.theme].primary = color
      }
    },
    updateSecondary(color: string) {
      if (this.isValidColor(color)) {
        this.$vuetify.theme.themes[this.theme].secondary = color
      }
    },
    updateHueRotation(hueRotation: number) {
      this.hueRotation = hueRotation
      this.$vuetify.theme.themes[this.theme].hueRotation = hueRotation
    },
    updateSaturation(saturation: number) {
      this.saturation = saturation
      this.$vuetify.theme.themes[this.theme].saturation = saturation
    },
    formatThemeResult() {
      var json = {
        primary: this.getPrimary(),
        secondary: this.getSecondary(),
        hueRotation: this.hueRotation,
        saturation: this.saturation,
      }
      return JSON.stringify(json, null, 2)
    },
    isValidColor(color: string) {
      return color != '#FF0000FF'
    },
    changeTheme() {
      if (this.themeSelected > -1) {
        this.updatePrimary(this.themes[this.themeSelected - 1].primary)
        this.updateSecondary(this.themes[this.themeSelected - 1].secondary)
        this.updateHueRotation(this.themes[this.themeSelected - 1].hueRotation)
        this.updateSaturation(this.themes[this.themeSelected - 1].saturation)
      }
    },
    getThemeLabel(n: number) {
      return this.$t('themePicker.button.theme.text') + ' #' + n
    },
  },
})
</script>

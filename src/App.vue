<template>
  <v-app :style="getBackgroundStyle()">
    <navigation-menu
      :hue-rotation="hueRotationFilter()"
      :saturation="saturationFilter()"
    />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
// import axios from 'axios'
import { mapGetters } from 'vuex'
import NavigationMenu from '@/components/NavigationMenu.vue'
// import { TranslateResult } from 'vue-i18n'
import $getFindGenesWorker from '@/utils/workers/worker-instance'

export default Vue.extend({
  name: 'App',
  components: { NavigationMenu },

  data: () => ({
    sourceDir: 'source_panels/',
    panelNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
  }),
  methods: {
    getBackgroundStyle(lighten: boolean) {
      var background: any = this.$vuetify.theme.themes[this.theme].background
      var backgroundString = ''
      if (lighten && background.base) {
        //check if string or object
        backgroundString = background.lighten5
      } else {
        backgroundString = background
      }
      return { background: backgroundString }
    },
    hueRotationFilter() {
      var hueRotation: any = this.$vuetify.theme.themes[this.theme].hueRotation
      return hueRotation
    },
    saturationFilter() {
      var saturation: any = this.$vuetify.theme.themes[this.theme].saturation
      return saturation
    },
    /**
     * Workers shared accross components can be initialized here
     *
     */
    initWorkers() {
      // $getFindGenesWorker().postMessage({
      //   init: true,
      //   allGeneMap: this.allGeneMap,
      //   synonymMap: this.synonymMap,
      // })
    },
  },
  computed: {
    theme() {
      if (this.$vuetify.theme.dark) {
        return 'dark'
      } else {
        return 'light'
      }
    },
    ...mapGetters({
      panels: 'getPanels',
    }),
    // toolbarTitle(): TranslateResult {
    //   if (this.$route.meta && this.$route.meta.i18n) {
    //     return this.$t(this.$route.meta.i18n + '.toolbar.text')
    //   }
    //   return 'GTI'
    // },
  },
  mounted() {
    this.initWorkers()
  },
  destroyed() {
    $getFindGenesWorker().terminate()
  },
})
</script>

<style>
.v-input.v-text-field.v-textarea .v-text-field__slot {
  padding: 5px 10px 5px 5px; /*fix scrollbar overlapping with textarea outlined */
}
tr:nth-child(even) {
  background-color: #fafafa;
}
</style>

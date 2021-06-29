<template>
  <v-app :style="getBackgroundStyle()">
    <navigation-menu
      :hue-rotation="hueRotationFilter()"
      :saturation="saturationFilter()"
    />
    <v-app-bar app color="primary" dark flat clipped-left>
      <div class="d-flex align-center">
        <span class="title" v-text="toolbarTitle" />
      </div>

      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            href="https://github.com/skriyaz95/goal-gene-panel-search"
            target="_blank"
            text
            v-on="on"
          >
            <span class="mr-2">{{ $t('button.link.repo.text') }}</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('button.link.repo.tooltip') }}</span>
      </v-tooltip>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { mapGetters } from 'vuex'
import { PanelPayload } from '@/types/panel-types'
import NavigationMenu from '@/components/NavigationMenu.vue'
import { TranslateResult } from 'vue-i18n'
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
    importExistingPanels(r: any): any {
      this.$store.commit('resetPanels')
      var jsonPanels = new Array<any>()
      r.keys().forEach((key: any) => jsonPanels.push(key))
      for (var i = 0; i < jsonPanels.length; i++) {
        var path = this.publicPath + this.sourceDir + jsonPanels[i]
        axios
          .get(path, {
            params: {},
          })
          .then((response) => {
            var panel = response.data
            this.$store.commit('addPanel', new PanelPayload(panel))
          })
          .catch((error) => {
            alert(error)
          })
      }
    },
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
      $getFindGenesWorker().postMessage({
        init: true,
        allGeneMap: this.allGeneMap,
        synonymMap: this.synonymMap,
      })
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
      allGenes: 'getAllGenes',
      allGeneMap: 'getAllGeneMap',
      synonymMap: 'getSynonymMap',
    }),
    toolbarTitle(): TranslateResult {
      if (this.$route.meta && this.$route.meta.i18n) {
        return this.$t(this.$route.meta.i18n + '.toolbar.text')
      }
      return 'GTI'
    },
  },
  mounted() {
    this.initWorkers()
    this.importExistingPanels(
      require.context('../public/source_panels/', false, /\.json$/)
    )
    console.log()
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
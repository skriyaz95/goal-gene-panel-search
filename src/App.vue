<template>
  <v-app :style="getBackgroundStyle()">
    <navigation-menu
      :hue-rotation="hueRotationFilter()"
      :saturation="saturationFilter()"
    />
    <v-main>
      <router-view />
    </v-main>
    <v-snackbar
      content-class="pa-0"
      light
      v-model="gdpr"
      right
      timeout="-1"
      transition="slide-x-reverse-transition"
    >
      <gdpr-info @response="handleGDPRResponse"></gdpr-info>
    </v-snackbar>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import NavigationMenu from '@/components/NavigationMenu.vue'
import $getFindGenesWorker from '@/utils/workers/worker-instance'
import { getCookie } from '@/utils/cookies'
import GdprInfo from '@/components/GdprInfo.vue'
import { LastSelection } from '@/types/ui-types'
import { Route } from 'vue-router'

export default Vue.extend({
  name: 'App',
  components: { NavigationMenu, GdprInfo },

  data: () => ({
    sourceDir: 'source_panels/',
    panelNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
    gdpr: false,
  }),
  methods: {
    ...mapActions(['updateLastSelection']),
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
    handleGDPR(): any {
      const cookie = getCookie('GDPR_ACCEPT')
      if (!cookie) {
        //cookie doesn't exist
        setTimeout(() => {
          this.gdpr = true
        }, 1000) //display 5 sec after loading
      }
    },
    handleGDPRResponse(response: boolean) {
      this.gdpr = !response
    },
    recordLastSelection(from: Route) {
      const lastSelectionForTab = new LastSelection(
        from.name as string,
        from.params.tab,
        Number.parseInt(from.params.item)
      )
      this.updateLastSelection(lastSelectionForTab)
    },
    fetchLastSelection(to: Route) {
      const lastSelectionForTab = this.lastSelections.get(
        (to.name as string) + to.params.tab
      )
      return lastSelectionForTab
    },
  },
  computed: {
    ...mapGetters({
      lastSelections: 'getLastSelections',
    }),
    theme() {
      if (this.$vuetify.theme.dark) {
        return 'dark'
      } else {
        return 'light'
      }
    },
  },
  mounted() {
    this.initWorkers()
    this.handleGDPR()
    this.$router.beforeEach((to, _from, next) => {
      document.title =
        'GTI ' + (this.$t('navigation.' + to.name + '.title.text') || '')
      next()
    })
    this.$router.afterEach((to) => {
      this.recordLastSelection(to)
    })
  },
  destroyed() {
    $getFindGenesWorker().terminate()
  },
})
</script>


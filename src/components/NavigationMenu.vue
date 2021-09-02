<template>
  <v-navigation-drawer bottom clipped app :mini-variant.sync="mini">
    <v-card
      v-show="mini && !$vuetify.breakpoint.mobile"
      flat
      min-height="256"
      max-height="256"
      :style="hueRotationFilter"
    >
      <v-img
        src="@/assets/gti/gti_logo_nolabel_128.png"
        alt="GTI Logo"
        width="80%"
        class="mt-2"
        :style="imageStyle"
      />
      <v-img
        src="@/assets/gti/gti_acronym_orig.png"
        alt="GTI Logo"
        class="mt-10"
        :style="imageStyle"
        width="35px"
      />
    </v-card>
    <v-card
      v-show="!mini && !$vuetify.breakpoint.mobile"
      flat
      min-height="256"
      :style="hueRotationFilter"
    >
      <v-img
        src="@/assets/gti/gti_logo_256.png"
        alt="GTI Logo"
        width="70%"
        class="mt-2 mb-4"
        :style="imageStyle"
      />
      <v-img
        src="@/assets/gti/gti_label_512.png"
        alt="GTI Title"
        width="225px"
        :style="imageStyle"
      />
    </v-card>
    <v-card v-show="$vuetify.breakpoint.mobile" flat :style="hueRotationFilter">
      <v-row align="center">
        <v-col cols="3">
          <v-img
            src="@/assets/gti/gti_logo_64.png"
            alt="GTI Logo"
            :style="imageStyle"
          />
        </v-col>
        <v-col cols="8">
          <v-img
            src="@/assets/gti/gti_label_256.png"
            alt="GTI Title"
            :content-class="imageStyle"
          />
        </v-col>
      </v-row>
    </v-card>
    <v-divider />
    <v-list nav dense>
      <v-list-item v-show="!$vuetify.breakpoint.mobile" @click="mini = !mini">
        <v-list-item-icon>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-icon :style="iconRotation" v-on="on"> mdi-eject </v-icon>
            </template>
            <span>{{ $t('navigation.mini.tooltip') }}</span>
          </v-tooltip>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('navigation.mini.text') }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        :to="{ name: 'home', params: { tab: 'results' } }"
        :active-class="activeClassExact"
        :class="isActiveHome ? activeClass : ''"
        exact-path
        @click.stop=""
      >
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('navigation.home.text') }} </v-list-item-title>
      </v-list-item>
      <v-list-item
        :to="{ name: 'search' }"
        exact
        @click.stop=""
        :active-class="activeClassExact"
      >
        <v-list-item-icon>
          <v-icon>mdi-dna</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('navigation.search.text') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        :to="{
          name: 'explore',
          params: { tab: 'panels', item: '0' },
        }"
        :active-class="activeClassExact"
        :class="isActiveExplore ? activeClass : ''"
        @click.stop=""
        exact-path
      >
        <v-list-item-icon>
          <v-icon>mdi-database-search</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('navigation.explore.text') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        :to="{ name: 'utils', params: { tab: 'panels', item: '0' } }"
        :active-class="activeClassExact"
        :class="isActiveUtils ? activeClass : ''"
        exact-path
        @click.stop=""
      >
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('navigation.utils.text') }}</v-list-item-title>
      </v-list-item>

      <v-list-item
        :to="{ name: 'help', params: { tab: 'files' } }"
        :active-class="activeClassExact"
        :class="isActiveHelp ? activeClass : ''"
        exact-path
        @click.stop=""
      >
        <v-list-item-icon>
          <v-icon>mdi-lifebuoy</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('navigation.help.text') }}</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-translate</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          <v-menu open-on-hover offset-x close-delay="500">
            <template v-slot:activator="{ on, attrs }">
              <span text v-bind="attrs" v-on="on">
                {{ $t('navigation.translate.text') }}
                <v-icon>mdi-menu-right</v-icon>
              </span>
            </template>
            <v-list dense>
              <v-list-item
                v-for="(item, index) in langs"
                :key="index"
                @click="handleLanguageChange(item.value)"
              >
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'
import VueI18n from 'vue-i18n'

export default Vue.extend({
  name: 'NavigationMenu',
  props: {
    hueRotation: {
      type: Number,
      default: 0,
    },
    saturation: {
      type: Number,
      default: 1,
    },
  },
  data: () => ({
    mini: false,
    activeClass: 'primary lighten-1 font-weight-bold',
    activeClassExact: 'primary lighten-2 font-weight-bold',
  }),
  computed: {
    iconRotation() {
      if (this.mini) {
        return 'transform: rotate(90deg)'
      }
      return 'transform: rotate(270deg)'
    },
    hueRotationFilter() {
      return 'filter: hue-rotate(' + this.hueRotation + 'deg)'
    },
    imageStyle() {
      return 'margin: auto; filter: saturate(' + this.saturation + ')'
    },
    isActiveHome() {
      const route = this.$route as any
      //skip default route which is handled by VueRouter
      if (route.name !== 'home' || route.params.tab === 'results') {
        return false
      }
      return route.name === 'home'
    },
    isActiveExplore() {
      const route = this.$route as any
      //skip default route which is handled by VueRouter
      if (route.name !== 'explore') {
        return false
      }
      if (route.params.tab === 'panels' && route.params.item === '0') {
        return false
      }
      return route.name === 'explore'
    },
    isActiveUtils() {
      const route = this.$route as any
      if (route.name !== 'utils') {
        return false
      }
      //skip default route which is handled by VueRouter
      if (route.params.tab === 'panels' && route.params.item === '0') {
        return false
      }
      return route.name === 'utils'
    },
    isActiveHelp() {
      const route = this.$route as any
      //skip default route which is handled by VueRouter
      if (route.name !== 'help' || route.params.tab === 'files') {
        return false
      }
      return route.name === 'help'
    },
    langs(): any[] {
      return (this.$i18n as VueI18n).availableLocales.map((l) => {
        let text = l.toUpperCase()
        if (l !== 'en' && l !== 'fr') {
          text += ' (beta)'
        }
        return { text: text, value: l }
      })
    },
  },
  mounted() {},
  methods: {
    handleLanguageChange(value: string) {
      this.$i18n.locale = value
      localStorage.locale = value
    },
  },
})
</script>

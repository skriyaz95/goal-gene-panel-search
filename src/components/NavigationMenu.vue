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
        src="../assets/gti/gti_logo_nolabel_128.png"
        alt="GTI Logo"
        width="80%"
        class="mt-2"
        :style="imageStyle"
      />
      <v-img
        src="../assets/gti/gti_acronym_orig.png"
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
        src="../assets/gti/gti_logo_256.png"
        alt="GTI Logo"
        width="70%"
        class="mt-2 mb-4"
        :style="imageStyle"
      />
      <v-img
        src="../assets/gti/gti_label_512.png"
        alt="GTI Title"
        width="225px"
        :style="imageStyle"
      />
    </v-card>
    <v-card v-show="$vuetify.breakpoint.mobile" flat :style="hueRotationFilter">
      <v-row align="center">
        <v-col cols="3">
          <v-img
            src="../assets/gti/gti_logo_64.png"
            alt="GTI Logo"
            :style="imageStyle"
          />
        </v-col>
        <v-col cols="8">
          <v-img
            src="../assets/gti/gti_label_256.png"
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
        link
        :to="{ name: 'Home' }"
        active-class="primary lighten-2"
        exact
        @click.stop=""
      >
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('navigation.home.text') }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        link
        :to="{ name: 'Explore', query: { tab: 'panels' } }"
        active-class="primary lighten-2"
        exact-path
        @click.stop=""
      >
        <v-list-item-icon>
          <v-icon>mdi-database-search</v-icon>
        </v-list-item-icon>
        <v-list-item-title>
          {{ $t('navigation.explore.text') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        link
        :to="{ name: 'Utils', query: { tab: 'panels' } }"
        active-class="primary lighten-2"
        exact-path
        @click.stop=""
      >
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t('navigation.utils.text') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from 'vue'

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
  },
  mounted() {},
  methods: {},
})
</script>

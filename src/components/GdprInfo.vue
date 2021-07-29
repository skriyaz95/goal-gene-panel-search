/* eslint-disable vue/html-indent */
<template>
  <v-card flat :outlined="snack">
    <v-card-title> {{ $t('gdpr.title') }} </v-card-title>
    <v-card-text>
      <div class="pb-2">
        <div>
          <b>{{ $t('gdpr.doNotTrack') }}</b> {{ $t('gdpr.cookieUsage') }}
        </div>
        <div>
          {{ $t('gdpr.learnMore') }}:
          <v-btn
            icon
            @click="detailsVisible = !detailsVisible"
            :class="detailsVisible ? 'primary--text' : ''"
          >
            <v-icon>mdi-eye</v-icon>
          </v-btn>
        </div>
      </div>
      <div v-show="detailsVisible">
        <div class="pb-2">
          <b>{{ $t('gdpr.catCustomization') }}: </b>
          <div class="pb-1 pl-2">
            <v-icon>mdi-cookie-outline</v-icon><i>firstTime</i><br />
            {{ $t('gdpr.source') }}:
            {{ $t('gdpr.customization.cookie1.source') }}
            <br />
            {{ $t('gdpr.purpose') }}:
            {{ $t('gdpr.customization.cookie1.purpose') }} <br />
            {{ $t('gdpr.validity') }}:
            {{ $t('gdpr.customization.cookie1.validity') }}
          </div>
          <div class="pl-2">
            <v-icon>mdi-cookie-outline</v-icon><i>GDPR_ACCEPT</i><br />
            {{ $t('gdpr.source') }}:
            {{ $t('gdpr.customization.cookie2.source') }}
            <br />
            {{ $t('gdpr.purpose') }}:
            {{ $t('gdpr.customization.cookie2.purpose') }} <br />
            {{ $t('gdpr.validity') }}:
            {{ $t('gdpr.customization.cookie2.validity') }}
          </div>
        </div>
        <div class="pb-2">
          <b>{{ $t('gdpr.catAd') }}:</b><br />
          <div class="pl-2">
            <v-icon>mdi-cookie-outline</v-icon><i>.gstatic.com</i><br />
            {{ $t('gdpr.source') }}: {{ $t('gdpr.ad.cookie1.source') }} <br />
            {{ $t('gdpr.purpose') }}: {{ $t('gdpr.ad.cookie1.purpose') }} <br />
            {{ $t('gdpr.validity') }}:
            <a :href="retention"> {{ retention }} </a>
          </div>
        </div>
        <div class="pb-2">
          <div>
            <b>
              {{ $t('gdpr.agreement') }}
            </b>
            <br />
            {{ $t('gdpr.refusal') }}
            <a :href="redirect"> {{ redirect }} </a>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        :disabled="acceptClicked || refuseClicked"
        @click="accept"
        class="primary"
      >
        {{ $t('button.accept.text') }}
      </v-btn>
      <v-btn
        :disabled="acceptClicked || refuseClicked"
        @click="refuse"
        class="error"
      >
        {{ $t('button.refuse.text') }}
      </v-btn>
      <span class="pl-2">
        <v-icon v-show="acceptClicked">mdi-emoticon-cool-outline</v-icon>
        <v-icon v-show="refuseClicked">mdi-emoticon-cry-outline</v-icon>
      </span>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { DUCK_DUCK_GO, GOOGLE_RETENTION } from '@/utils/apis'
import { setCookie } from '@/utils/cookies'
import { mapActions } from 'vuex'

export default Vue.extend({
  name: 'GdprInfo',
  props: {
    snack: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    detailsVisible: false,
    redirect: DUCK_DUCK_GO,
    retention: GOOGLE_RETENTION,
    acceptClicked: false,
    refuseClicked: false,
  }),
  computed: {},
  mounted() {},
  methods: {
    ...mapActions(['clearLastSearches']),
    accept() {
      this.acceptClicked = true
      this.$emit('response', true)
      setCookie('GDPR_ACCEPT', true, 365)
    },
    refuse() {
      this.refuseClicked = true
      this.$emit('response', false)
      setCookie('GDPR_ACCEPT', false, 0)
      setCookie('firstTime', true, 0)
      this.clearLastSearches()
      setTimeout(() => {
        window.location.assign(this.redirect)
      }, 1000)
    },
  },
})
</script>

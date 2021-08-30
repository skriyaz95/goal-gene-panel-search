<template>
  <main-content-template inner even>
    <template v-slot:left-col>
      <v-card outlined>
        <v-card-title>
          <span class="mr-2"> {{ $t('help.manageApp.title.text') }} </span>
        </v-card-title>
        <v-card-text>
          <div class="pb-4">
            <div>
              {{ $t('help.manageApp.part1a') }}
              <router-link :to="{ name: 'utils', params: { tab: 'panels' } }">
                {{ $t('navigation.utils.title.text') }}</router-link
              >
              {{ $t('help.manageApp.part1b') }}
            </div>
            <div>{{ $t('help.manageApp.part2a') }}</div>
            <ul>
              <li>{{ $t('help.manageApp.part2b') }}</li>
              <li>{{ $t('help.manageApp.part2c') }}</li>
              <li>
                {{ $t('help.manageApp.part2d') }}
              </li>
              <li>{{ $t('help.manageApp.part2e') }}</li>
            </ul>
          </div>

          <div class="pb-2">
            <div class="pb-2">
              {{ $t('help.manageApp.part3a') }}
              <v-icon>mdi-help-circle-outline</v-icon>
              {{ $t('help.manageApp.part3b') }}
            </div>
            <div class="pb-2">
              {{ $t('help.manageApp.part4a') }}
            </div>
            <ul>
              <li>
                <b>{{ $tc('help.installApp.step', 1) }}:</b>
                {{ $t('help.manageApp.part4b') }}
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 2) }}:</b>
                {{ $t('help.manageApp.part4c') }}
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 3) }}:</b>
                {{ $t('help.manageApp.part4d') }}
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 4) }}:</b>
                {{ $t('help.manageApp.part4e') }}
              </li>
            </ul>
          </div>
        </v-card-text>
      </v-card>

      <v-card outlined class="mt-2">
        <v-card-title>
          <span class="mr-2">
            {{ $t('help.manageApp.customize.title.text') }}
          </span>
        </v-card-title>
        <v-card-text>
          <div class="pb-4">
            <div>
              {{ $t('help.manageApp.customize.part1') }}
            </div>
          </div>

          <div class="pb-2">
            <div class="pb-2">
              {{ $t('help.manageApp.customize.part2') }}
            </div>
            <div class="pb-2">
              {{ $t('help.manageApp.customize.part3') }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
    <template v-slot:right-col>
      <get-in-touch></get-in-touch>
    </template>
  </main-content-template>
</template>

<script lang="ts">
import Vue from 'vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import GetInTouch from '@/components/help/GetInTouch.vue'
import { GITHUB_REPO, CLOUDFLARE_DEPLOY } from '@/utils/apis'

export default Vue.extend({
  components: { MainContentTemplate, GetInTouch },
  name: 'ManageApp',
  props: {},
  data() {
    return {
      githubRepo: GITHUB_REPO,
      cloudflareDeploy: CLOUDFLARE_DEPLOY,
    }
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {},
})
</script>

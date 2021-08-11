<template>
  <main-content-template inner even>
    <template v-slot:left-col>
      <v-card outlined>
        <v-card-title>
          <span class="mr-2"> {{ $t('help.installApp.title.text') }} </span>
        </v-card-title>
        <v-card-text>
          <div class="pb-4">
            <div>{{ $t('help.installApp.part1a') }}</div>
            <ul>
              <li>
                {{ $t('help.installApp.part1b') }}
              </li>
              <li>
                {{ $t('help.installApp.part1c') }}
              </li>
              <li>
                {{ $t('help.installApp.part1d') }}
              </li>
            </ul>
          </div>

          <div class="pb-2">
            <div class="pb-2">
              {{ $t('help.installApp.part2a') }}
            </div>
            <ul>
              <li>
                <b>{{ $tc('help.installApp.step', 1) }}:</b>
                {{ $t('help.installApp.part2b') }}
                <a :href="githubRepo" target="_blank"> {{ githubRepo }} </a>
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 2) }}:</b>
                {{ $t('help.installApp.part2c') }}
                <a :href="cloudflareDeploy" target="_blank">
                  {{ cloudflareDeploy }}
                </a>
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 3) }}:</b>
                {{ $t('help.installApp.part2d') }}
                <router-link :to="{ name: 'utils', params: { tab: 'panels' } }">
                  {{ $t('navigation.utils.title.text') }}</router-link
                >
                {{ $t('help.installApp.part2e') }}
              </li>
            </ul>
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
  name: 'InstallApp',
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

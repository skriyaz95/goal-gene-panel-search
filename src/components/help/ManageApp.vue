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
              The
              <router-link :to="{ name: 'utils', params: { tab: 'panels' } }">
                {{ $t('navigation.utils.title.text') }}</router-link
              >
              page has all the tools you need to control the content of the app.
            </div>
            <div>You can:</div>
            <ul>
              <li>create/modify panels</li>
              <li>create/modify institutions</li>
              <li>
                update the gene database (which is used to check symbols and
                synonyms)
              </li>
              <li>customize the look of your app</li>
            </ul>
          </div>

          <div class="pb-2">
            <div class="pb-2">
              Each tab has a help button
              <v-icon>mdi-help-circle-outline</v-icon> to guide you through the
              process.
            </div>
            <div class="pb-2">The steps are similar for any data change:</div>
            <ul>
              <li>
                <b>{{ $tc('help.installApp.step', 1) }}:</b>
                Follow the instructions to create the data.
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 2) }}:</b>
                Download the data file(s) on your computer.
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 3) }}:</b>
                Replace the files in the assets directory to make the changes
                permanent.
              </li>
              <li>
                <b>{{ $tc('help.installApp.step', 4) }}:</b>
                Deploy the changes to your server (via github or manually
                depending on your setup)
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

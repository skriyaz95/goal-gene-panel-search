<template>
  <div>
    <v-toolbar class="primary" dark flat dense>
      <v-toolbar-title>
        <span class="title" v-text="toolbarTitle" />
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <main-content-template :twoCols="true" inner>
      <template v-slot:left-col>
        <v-alert text prominent type="error" icon="mdi-cloud-alert">
          <div class="pb-4">
            {{ $t('navigation.error.content.text.part1') }}
          </div>
          <div>
            <v-row>
              <v-col class="grow"></v-col>
              <v-col class="shrink">
                <v-btn
                  color="error"
                  outlined
                  :to="{ name: 'home', params: { tab: 'results' } }"
                >
                  {{ $t('navigation.error.content.text.part2') }}
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-alert>
      </template>
    </main-content-template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'
import { TranslateResult } from 'vue-i18n'

export default Vue.extend({
  components: {
    MainContentTemplate,
  },
  name: 'Error',
  props: {},
  data: () => ({}),
  computed: {
    toolbarTitle(): TranslateResult {
      if (this.$route.meta && this.$route.meta.i18n) {
        return this.$t(this.$route.meta.i18n + '.toolbar.text')
      }
      return 'GTI'
    },
  },
  methods: {},
  mounted() {
    document.title = 'GTI ' + this.$t('navigation.error.title.text')
  },
})
</script>

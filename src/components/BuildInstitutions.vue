/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card outlined>
          <v-card-text>
            <div class="mb-1 mt-1">
              {{ $t('buidInstitutions.list.text') }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn class="primary" v-on="on" @click="addInstitution()">
                  {{ $t('buidInstitutions.new.text') }}
                </v-btn>
              </template>
              <span>{{ $t('buidInstitutions.new.tooltip') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="primary ml-2"
                  :disabled="!validInstitutions()"
                  v-on="on"
                  @click="downloadInstitutions()"
                >
                  {{ $t('buidInstitutions.saveAll.text') }}
                </v-btn>
              </template>
              <span> {{ $t('buidInstitutions.saveAll.tooltip') }}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card outlined class="mb-2">
          <v-card-text> </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
// import download from '@/utils/download'
// import { formatObjetToJson } from '@/utils/download'

export default Vue.extend({
  components: {},
  name: 'BuildInstitutions',

  data: () => ({
    publicPath: process.env.BASE_URL,
  }),
  methods: {
    addInstitution() {},
    downloadInstitutions() {
      // const newInstitutions = Array.from(institutionMapCopy.values())
      // download(
      //   'institutions.json',
      //   formatObjetToJson(newInstitutions, false),
      //   'text/json'
      // )
    },
  },
  computed: {
    ...mapGetters({
      institutionsByName: 'getInstitutionsByName',
    }),
  },
  mounted() {},
})
</script>

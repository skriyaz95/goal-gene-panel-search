<template>
  <v-card outlined>
    <v-card-title>
      <span class="mr-2">
        {{ $t('help.installApp.contact.title.text') }}
      </span>
    </v-card-title>
    <v-card-text>
      <v-list two-line>
        <template v-for="(admin, index) in admins">
          <v-list-item :key="index">
            <v-list-item-avatar>
              <v-icon large>mdi-comment-account-outline</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title> {{ admin.name }} </v-list-item-title>
              <v-list-item-subtitle>
                <a :href="'mailto:' + admin.email">{{ admin.email }}</a>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { ADMINS } from '@/utils/contacts'

export default Vue.extend({
  components: {},
  name: 'GetInTouch',
  props: {},
  data() {
    return {
      admins: ADMINS,
    }
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {},
})
</script>

<template>
  <div>
    <v-list v-if="editable && institution">
      <v-list-item>
        <v-list-item-content>
          <v-text-field
            v-model="institution.name"
            :label="$t('institutionDetails.name.text')"
            prepend-icon="mdi-bank"
            dense
            @change="handleNameChange"
          >
          </v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-text-field
            v-model="institution.phone"
            :label="$t('institutionDetails.phone.text')"
            prepend-icon="mdi-phone-in-talk"
            dense
          >
          </v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-text-field
            v-model="institution.email"
            :label="$t('institutionDetails.email.text')"
            prepend-icon="mdi-email"
            dense
          >
          </v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-text-field
            v-model="institution.website"
            :label="$t('institutionDetails.website.text')"
            prepend-icon="mdi-earth"
            dense
          >
          </v-text-field>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-autocomplete
            chips
            deletable-chips
            multiple
            v-model="institution.panels"
            :items="panels"
            :label="$t('institutionDetails.panels.text')"
            hide-details
            prepend-icon="mdi-dna"
          ></v-autocomplete>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="error" v-on="on" @click="deleteInstitution()">
                {{ $t('buidInstitutions.delete.text') }}
                <v-spacer></v-spacer>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('buidInstitutions.delete.tooltip') }}</span>
          </v-tooltip>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-list v-else>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-bank</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ institution.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-phone-in-talk</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <a :href="linkTo(institution.phone, 'phone')">
              {{ institution.phone }}
            </a>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-email</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <a :href="linkTo(institution.email, 'email')">
              {{ institution.email }}
            </a>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-earth</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <a :href="institution.website" target="_blank">
              {{ institution.website }}
            </a>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="showReadOnlyPanels">
        <v-list-item-icon>
          <v-icon>mdi-dna</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <v-chip
              class="mr-2"
              v-for="(panel, index) in institution.panels"
              :key="index"
            >
              {{ panel }}
            </v-chip>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { Institution } from '@/types/panel-types'
import Vue from 'vue'

export default Vue.extend({
  components: {},
  name: 'InstitutionDetails',
  props: {
    institution: {
      type: Object,
      default: () => new Institution('', '', '', '', []),
    },
    editable: {
      type: Boolean,
      default: false,
    },
    panels: {
      type: Array,
      default: () => [],
    },
    showReadOnlyPanels: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    linkTo(link: string, linkType: string) {
      const linkPrefix = linkType == 'phone' ? 'tel:' : 'mailto:'
      return linkPrefix + link
    },
    handleNameChange(event: string[]) {
      this.$emit('name-changed', event)
    },
    deleteInstitution() {
      this.$emit('delete-institution')
    }
  },
  watch: {},
  mounted() {},
})
</script>

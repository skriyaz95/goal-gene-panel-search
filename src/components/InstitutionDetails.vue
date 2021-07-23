<template>
  <div>
    <v-list v-if="editable && institution">
      <v-form
        v-model="institutionValid"
      >
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="institution.name"
              :label="$t('institutionDetails.name.text')"
              :rules="nameRules"
              dense
              required
              prepend-icon="mdi-bank"
              @change="handleNameChange"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              :rules="phoneRules"
              v-model="institution.phone"
              :label="$t('institutionDetails.phone.text')"
              prepend-icon="mdi-phone-in-talk"
              dense
              required
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="institution.email"
              :rules = "emailRules"
              :label="$t('institutionDetails.email.text')"
              prepend-icon="mdi-email"
              dense
              required
            >
            </v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="institution.website"
              :rules="validateWebSite"
              :label="$t('institutionDetails.website.text')"
              prepend-icon="mdi-earth"
              dense
              required
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
              required
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
                  <v-icon right>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('buidInstitutions.delete.tooltip') }}</span>
            </v-tooltip>
          </v-list-item-content>
        </v-list-item>
      </v-form>
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
              :outlined="chipOutlined"
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
import { mapGetters } from 'vuex'

export default Vue.extend({
  components: {},
  name: 'InstitutionDetails',
  props: {
    institution: {
      type: Object,
      default: () => new Institution('', '', '', '', [], true),
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
    return {
      institutionValid: true,
      nameRules: [
        (v:string) => !!v || 'Institution Name is required',
        (v:string) => (v && v.length <= 50) || 'Institution Name must be less than 50 characters',
      ],
      emailRules: [
        (v:string) => !!v || 'Institution E-mail is required',
        (v:string) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'Institution E-mail must be valid'
      ],
      phoneRules: [
        (v:string) => !!v || 'Institution Phone Number is required',
        (v:string) => !v || /^(1\s|1|)?((\(\d{3}\))|\d{3})(-|\s)?(\d{3})(-|\s)?(\d{4})$/.test(v) || 'Institution Phone Number must be valid'
      ],
    }
  },
  watch: {
    institutionValid: 'emitInstitutionValid'
  },
  computed: {
    ...mapGetters({
      chipOutlined: 'getChipOutlined',
    }),
    validateWebSite(): any {
      const z = this.$t('buildPanels.validation.accepted-files')
      var websitePattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      const webSiteRequired = (v:string) => !!v || 'Institution Website is required'
      const websiteValidate = (v: string) => !v || websitePattern.test(v) || z
      return [webSiteRequired, websiteValidate]
    },
  },
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
    },
    emitInstitutionValid() {
      this.institution.valid = this.institutionValid
      this.$emit('institution-valid', this.institutionValid)
    }
  },
  mounted() {},
})
</script>

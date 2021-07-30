<template>
  <div>
    <!-- editable institution -->
    <v-list v-if="editable && institution">
      <v-form
        v-model="institutionValid"
        ref="institutionForm"
      >
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="institution.item.name"
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
              v-model="institution.item.phone"
              :label="$t('institutionDetails.phone.text')"
              prepend-icon="mdi-phone-in-talk"
              dense
              required
              @input="formatNumber"
            ></v-text-field>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-text-field
              v-model="institution.item.email"
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
              v-model="institution.item.website"
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
              v-model="institution.item.panels"
              :items="panels"
              :label="$t('institutionDetails.panels.text')"
              hide-details
              prepend-icon="mdi-dna"
              required
            ></v-autocomplete>
          </v-list-item-content>
        </v-list-item>
      </v-form>
    </v-list>
    <!-- read only institution -->
    <v-list v-else>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-bank</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ institution.item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-phone-in-talk</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <a :href="linkTo(institution.item.phone, 'phone')">
              {{ institution.item.phone }}
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
            <a :href="linkTo(institution.item.email, 'email')">
              {{ institution.item.email }}
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
            <a :href="institution.item.website" target="_blank">
              {{ institution.item.website }}
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
              v-for="(panel, index) in institution.item.panels"
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
import {ListItem} from "@/types/ui-types";

export default Vue.extend({
  components: {},
  name: 'InstitutionDetails',
  props: {
    institution: {
      type: Object,
      default: () => new ListItem(new Institution('', '', '', '', []), true),
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
        (v:string) => !!v || this.$t('institutionDetails.name.rules.required'),
        (v:string) => (v && v.length <= 50) || this.$t('institutionDetails.name.rules.length'),
      ],
      emailRules: [
        (v:string) => !!v || this.$t('institutionDetails.email.rules.required'),
        (v:string) => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || this.$t('institutionDetails.email.rules.valid')
      ],
      phoneRules: [
        (v:string) => !!v || this.$t('institutionDetails.phone.rules.required'),
        (v:string) => !v || /^(1\s|1|)?((\(\d{3}\))|\d{3})(-|\s)?(\d{3})(-|\s)?(\d{4})$/.test(v) || this.$t('institutionDetails.phone.rules.valid')
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
      var websitePattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
          '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      const webSiteRequired = (v:string) => !!v || this.$t('institutionDetails.website.rules.required')
      const websiteValidate = (v: string) => !v || websitePattern.test(v) || this.$t('institutionDetails.website.rules.valid')
      return [webSiteRequired, websiteValidate]
    }
  },
  methods: {
    linkTo(link: string, linkType: string) {
      const linkPrefix = linkType == 'phone' ? 'tel:' : 'mailto:'
      return linkPrefix + link
    },
    handleNameChange(event: string[]) {
      this.$emit('name-changed', event)
    },
    emitInstitutionValid() {
      this.institution.valid = this.institutionValid
      this.$emit('institution-valid', this.institution)
    },
    formatNumber() {
      var x = this.institution.item.phone.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
      this.institution.item.phone = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
    }
  },
  mounted() {},
})
</script>

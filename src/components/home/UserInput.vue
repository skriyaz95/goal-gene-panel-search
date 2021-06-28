<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('userInput.gene-list') }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-textarea
          v-model="geneList"
          name="gene-list"
          :label="$t('userInput.label')"
          :rules="geneListRules"
          clearable
          outlined
          clear-icon="mdi-close-circle"
          rows="13"
          @click:clear="clear()"
          @blur="clearIfEmpty"
        />
        <v-btn
          class="ma-2"
          large
          depressed
          color="primary"
          :disabled="!geneList || !isFormValid"
          @click="submitUserInput(geneList, true)"
        >
          {{ $t('userInput.button.submit') }}
        </v-btn>
        <v-btn class="ma-2" large depressed @click="clear()">
          {{ $t('userInput.button.clear') }}
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Gene } from '@/types/panel-types'
import debounce from '@/utils/debounce'

export default Vue.extend({
  name: 'UserInput',
  data: () => ({
    isFormValid: true,
    geneList: String(),
    validSeparators: /[ ,;\s]+/,
    validCharacters: /^[-,;~\w\s]+$/,
  }),
  computed: {
    ...mapGetters({
      lastSearch: 'getLastSearch',
    }),
    geneListRules(): any {
      // const x = this.$t('userInput.validation.list-empty')
      // const y = this.$t('userInput.validation.list-min-characters')
      const z = this.$t('userInput.validation.list-regex')
      // const emptyRule = (v:string) => (v != null && v.trim().length > 0) || x;
      // const lengthRule = (v: string) => (v != null && v.trim().length >= 2) || y
      const symbolRule = (v: string) => this.validCharacters.test(v) || z
      // return [lengthRule, symbolRule]
      return [symbolRule]
    },
  },
  watch: {
    geneList: debounce(function (this: any, value: string) {
      this.submitUserInput(value, false)
    }, 500),
  },
  methods: {
    submitUserInput(userinput: string, withAlert: boolean) {
      if (!this.geneList || !this.isFormValid) {
        if (withAlert) {
          alert('Form is not valid')
        }
        return
      } else {
        let genes = userinput.toUpperCase().split(this.validSeparators)
        let uniqGenes = Array.from(new Set(genes)) //remove duplicates
        let userGenes: Gene[] = []
        for (let symbol of uniqGenes) {
          if (symbol && symbol != '') {
            userGenes.push(new Gene(symbol))
          }
        }
        this.$store.commit('setUserGenes', userGenes)
        this.saveLastInput()
      }
    },
    clear() {
      let form: any = this.$refs.form
      this.geneList = String()
      this.$store.commit('setUserGenes', [])
      form.reset()
    },
    /** Clear the input if it doesn't contain any genes
     * This avoids error messages on blur
     */
    clearIfEmpty() {
      if (
        !this.geneList ||
        this.geneList == '' ||
        this.geneList.trim().length == 0
      ) {
        this.clear()
      }
    },
    loadLastInput() {
      if (this.lastSearch) {
        this.geneList = this.lastSearch
      }
    },
    saveLastInput() {
      this.$store.commit('updateLastSearch', this.geneList)
    },
  },
  mounted() {
    this.loadLastInput()
  },
})
</script>

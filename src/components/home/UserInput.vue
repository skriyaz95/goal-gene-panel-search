<template>
  <v-card outlined>
    <v-card-title>
      {{ $t('userInput.gene-list') }}
      <v-spacer></v-spacer>
      <help-button @action="handleHelp()" :active="help">
        <template v-slot:content>
          <gene-search-help />
        </template>
      </help-button>
    </v-card-title>
    <v-card-text>
      <info-alert :active="help">
        <template v-slot:content>
          <gene-search-help />
          <v-btn
            class="mt-2 primary"
            @click="startDemo()"
            :loading="demoRunning"
          >
            {{ $t('button.demo.text') }}
            <v-icon>mdi-play</v-icon>
          </v-btn>
        </template>
      </info-alert>
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
import { mapGetters, mapActions } from 'vuex'
import { Gene } from '@/types/panel-types'
import debounce from '@/utils/debounce'
import GeneSearchHelp from '@/components/help/GeneSearchHelp.vue'
import HelpButton from '../help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'

export default Vue.extend({
  components: { GeneSearchHelp, HelpButton, InfoAlert },
  name: 'UserInput',
  props: {
    help: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    isFormValid: true,
    geneList: String(),
    validSeparators: /[ ,;\s]+/,
    validCharacters: /^[-,;~\w\s]+$/,
    demoRunning: false,
  }),
  computed: {
    ...mapGetters({
      userGenes: 'getUserGenesSorted',
      lastSearch: 'getLastSearch',
      panels: 'getPanels',
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
    ...mapActions(['setUserGenes', 'updateLastSearch']),
    submitUserInput(userinput: string, withAlert: boolean) {
      if (!this.geneList || !this.isFormValid) {
        if (withAlert) {
          alert('Form is not valid')
        }
        return
      } else {
        let genes = userinput.toUpperCase().split(this.validSeparators)
        let uniqGenes = Array.from(new Set(genes)) //remove duplicates
        let userGenesList: Gene[] = []
        for (let symbol of uniqGenes) {
          if (symbol && symbol != '') {
            userGenesList.push(new Gene(symbol))
          }
        }
        this.setUserGenes(userGenesList).then(() => {
          this.$emit('userInputDone')
        })
        this.updateLastSearch(this.geneList)
      }
    },
    clear() {
      return new Promise((resolve) => {
        let form: any = this.$refs.form
        this.geneList = String()
        this.setUserGenes([])
        form.reset()
        this.demoRunning = false
        resolve('success')
      })
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
    handleHelp() {
      this.$emit('help')
    },
    startDemo() {
      if (this.demoRunning) {
        return
      }

      //just a few entries in geneList to show how the parsing works
      this.clear().then(() => {
        this.demoRunning = true
        const text = 'TP53\nBRCA1,BRCA2\nNOT_A_GENE, ALK_FUSION\nBRAF1'.split(
          ''
        )
        this.geneList = ''
        const interval = 75
        for (let i = 0; i < text.length; i++) {
          setTimeout(() => {
            //crude simulation of typing
            this.geneList += text[i]
          }, interval * i)
          setTimeout(() => {
            this.demoRunning = false
          }, interval * (text.length + 1))
        }
      })
      // this.geneList = 'TP53\nBRCA1,BRCA2\nNOT_A_GENE, ALK_FUSION\nBRAF1'
    },
  },
  mounted() {
    this.loadLastInput()
  },
})
</script>

<template>
  <div>
    <v-card outlined :raised="firstTime">
      <v-card-title>
        {{ $t('userInput.gene-list') }}
        <v-spacer></v-spacer>
        <v-scroll-x-transition>
          <v-alert
            dense
            text
            color="primary"
            class="body-1 ma-0 py-1 px-2"
            v-if="firstTime"
          >
            {{ $t('help.geneSearch.firstTime.text') }}

            <v-icon class="primary--text"> mdi-arrow-right-thick </v-icon>
          </v-alert>
        </v-scroll-x-transition>
        <help-button @action="handleHelp()" :active="help">
          <template v-slot:content>
            <span>
              {{ $t('button.showHide.tooltip') }}
              {{ $t('button.help.text') }}
            </span>
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
            clear-icon="mdi-close-circle-outline"
            rows="13"
            @click:clear="clear()"
            @blur="handleBlur"
          />
          <div>{{ $t('userInput.upload.text') }}:</div>
          <v-file-input
            v-model="geneFile"
            accept=".bed,.csv"
            label=".bed,.csv"
            prepend-icon="mdi-paperclip"
            @change="handleFileUpload"
            class="pr-2 pb-2"
          />
          <!-- <v-btn
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
          </v-btn> -->
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
// import { Gene } from '@/types/panel-types'
import debounce from '@/utils/debounce'
import GeneSearchHelp from '@/components/help/GeneSearchHelp.vue'
import HelpButton from '@/components/help/HelpButton.vue'
import InfoAlert from '@/components/help/InfoAlert.vue'
import { UserInputPayload } from '@/types/payload-types'
import { getPanelGenes } from '@/utils/csv-bed-parser'

export default Vue.extend({
  components: { GeneSearchHelp, HelpButton, InfoAlert },
  name: 'UserInput',
  props: {
    help: {
      type: Boolean,
      default: false,
    },
    firstTime: {
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
    geneFile: null,
  }),
  computed: {
    ...mapGetters({}),
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
    ...mapActions([
      'cleanUserInput',
      'updateLastSearch',
      'clearLastSearches',
      'updateInputNeedsReload',
    ]),
    submitUserInput(userinput: string, withAlert: boolean) {
      // console.log(userinput, withAlert)
      if (!userinput) {
        return
      }
      if (!this.geneList || !this.geneList.trim() || !this.isFormValid) {
        if (withAlert) {
          alert('Form is not valid')
        }
        return
      } else {
        this.cleanUserInput(
          new UserInputPayload(userinput, this.validSeparators)
        )
      }
    },
    clear() {
      return new Promise((resolve) => {
        let form: any = this.$refs.form
        this.geneList = String()
        form.reset()
        this.demoRunning = false
        this.cleanUserInput(new UserInputPayload('', this.validSeparators))
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
    handleBlur() {
      const valid = this.geneList && this.geneList.trim() && this.isFormValid
      this.$emit('afterBlur', [this.geneList, valid])
    },
    fillLastSearch(search: string) {
      this.geneList = search
    },
    handleFileUpload() {
      if (!this.geneFile) {
        return
      }
      var fr = new FileReader()
      // verify that panel doesn't already exist
      const fileName = (this.geneFile as any).name
      fr.readAsText(this.geneFile as any)
      fr.onload = () => {
        this.parseContent(fileName, fr.result as string)
      }
    },
    parseContent(fileName: string, content: string) {
      const extension = /\.csv$/.test(fileName) ? '.csv' : '.bed'
      const allRows = content.split(/\r?\n|\r/)
      const genes = getPanelGenes(allRows, extension)
      this.geneList = genes.map((g) => g.name).join('\n')
    },
  },
  mounted() {},
})
</script>

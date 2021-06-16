<template>
  <v-card outlined>
    <v-card-title>
      {{ $t("userInput.gene-list") }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-textarea outlined name="gene-list" :label="$t('userInput.label')" 
                    v-model="geneList" :rules="geneListRules" clearable
                    @click:clear="clear" rows="10" @blur="clearIfEmpty"
        ></v-textarea>
        <v-btn class="ma-2" large depressed color="primary" @click="saveUserInput()" :disabled="!isFormValid">{{ $t("userInput.button.submit") }}
        </v-btn>
        <v-btn class="ma-2" large depressed @click="clear()">{{ $t("userInput.button.clear") }}</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import {Gene} from "@/types/panel-types";

export default Vue.extend({
  name: 'UserInput',
  data: () => ({
    isFormValid: true,
    geneList: String(),
    validSeparators: /[ ,;\s]+/,
    validCharacters: /^[-,;~\w\s]+$/
  }),
  methods: {
    saveUserInput() {
      let validate:boolean = (this.$refs.form as Vue & { validate: () => boolean }).validate()
      if (!validate) {
        alert("Form is not valid")
      } else {
        let genes = this.geneList.split(this.validSeparators)
        let uniqGenes = Array.from(new Set(genes)); //remove duplicates
        let userGenes: Gene[] = [];
        for (let symbol of uniqGenes) {
          if (symbol && symbol != "") {
            userGenes.push(new Gene(symbol));
          }
        }
        this.$store.commit("setUserGenes", userGenes)
      }
    },
    clear() {
      let form:any = this.$refs.form
      form.reset()
      this.geneList = ''
    },
    /** Clear the input if it doesn't contain any genes
     * This avoids error messages on blur
     */
    clearIfEmpty() {
      if (!this.geneList || this.geneList == "" || this.geneList.trim().length == 0) {
        this.clear();
      }
    }
  },
  computed: {
     geneListRules() {
      // const x = this.$t('userInput.validation.list-empty')
      const y = this.$t('userInput.validation.list-min-characters')
      const z = this.$t('userInput.validation.list-regex')
      // const emptyRule = (v:string) => (v != null && v.trim().length > 0) || x;
      const lengthRule = (v:string) => (v != null && v.trim().length >= 2) || y;
      const symbolRule = (v:string) => this.validCharacters.test(v) || z
      return [lengthRule, symbolRule]
    },
  }
})


</script>

<template>
  <v-card outlined>
    <v-card-title>
      {{ $t("userInput.gene-list") }}
    </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="isFormValid">
        <v-textarea outlined name="gene-list" :label="$t('userInput.label')" v-model="geneList" :rules="geneListRules"
                    required></v-textarea>
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
    geneList: String()
  }),
  methods: {
    saveUserInput() {
      let validate:boolean = (this.$refs.form as Vue & { validate: () => boolean }).validate()
      if (!validate) {
        alert("Form is not valid")
      } else {
        let genes = this.geneList.split(/[ ,\n]+/)
        let userGenes: Gene[] = genes.map(name => {
          return new Gene(name);
        })
        this.$store.commit("setUserGenes", userGenes)
      }
    },
    clear() {
      let form:any = this.$refs.form
      form.reset()
      this.geneList = ''
    },
  },
  computed: {
     geneListRules() {
      const x = this.$t('userInput.validation.list-empty')
      const y = this.$t('userInput.validation.list-min-characters')
      const z = this.$t('userInput.validation.list-regex')
      const emptyRule = (v:string) => !!v || x;
      const lengthRule = (v:string) => (v && v.length >= 2) || y;
      const symbolRule = (v:string) => /^[-,\w\s]+$/.test(v) || z
      return [emptyRule, lengthRule, symbolRule]
    },
  }
})


</script>

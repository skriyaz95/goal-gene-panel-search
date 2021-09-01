<template>
  <main-content-template :twoCols="false" inner>
    <template v-slot:one-col>
      <v-card outlined>
        <v-card-title>
          <span class="mr-2"> {{ $t('help.fileFormats.title.text') }} </span>
        </v-card-title>
        <v-card-text>
          <div class="pb-2">
            {{ $t('help.fileFormats.part1') }}
          </div>
          <v-row>
            <v-col cols="12" md="6">
              <div class="title">CSV</div>
              <div class="pb-2">
                {{ $t('help.fileFormats.csv.part1') }}
              </div>
              <div class="pb-2">
                {{ $t('help.fileFormats.csv.part2') }}
              </div>
              <div class="grey lighten-4 code pa-2">
                <div v-for="(line, index) in csvContent" :key="index">
                  {{ line }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="title">BED</div>
              <div class="pb-2">
                {{ $t('help.fileFormats.bed.part1') }}
                <span class="grey lighten-4 code"> CHR START END NAME </span>
              </div>
              <div class="pb-2">
                {{ $t('help.fileFormats.bed.part2') }}
                <span class="grey lighten-4 code">:</span>
              </div>
              <div class="grey lighten-4 code pa-2">
                <div v-for="(line, index) in bedContent" :key="index">
                  {{ line.line[0] }} {{ line.line[1] }}{{ line.line[2] }}
                </div>
              </div>
              <div class="pt-2">
                <table>
                  <thead>
                    <tr>
                      <th>{{ $t('help.fileFormats.bed.header1') }}</th>
                      <th>{{ $t('help.fileFormats.bed.header2') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(line, index) in bedContent" :key="index">
                      <td>
                        {{ line.line[0] }} <b>{{ line.line[1] }}</b
                        >{{ line.line[2] }}
                      </td>
                      <td class="text-no-wrap">
                        {{ line.validation }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-col>
          </v-row>
          <div class="pt-2">
            <div>
              {{ $t('help.fileFormats.part2') }}
            </div>
            <div>
              {{ $t('help.fileFormats.part3') }}
            </div>
          </div>
        </v-card-text>
      </v-card>
    </template>
  </main-content-template>
</template>

<script lang="ts">
import Vue from 'vue'
import MainContentTemplate from '@/components/MainContentTemplate.vue'

export default Vue.extend({
  components: { MainContentTemplate },
  name: 'FileFormats',
  props: {},
  data() {
    return {
      csvContent: ['Gene.symbol', 'ACTA2', 'ACTC1', 'TSC2', 'VHL', 'WT1'],
      bedContent: [
        {
          line: [
            'chr1	1787293	1787413	',
            'GNB1',
            ':GNB1_chr1:1718769-1718876:275744_14961302_GNB1_chr1:1718769-1718876_1',
          ],
          validation: 'GNB1',
        },
        {
          line: ['chr1	3345058	3345178	', 'SNP', ':rs4415513'],
          validation: 'SNP ' + this.$t('help.fileFormats.notValid'),
        },
        {
          line: ['chr8	127730434	127736593	', 'MYC_upstream', ''],
          validation: 'MYC_upstream ' + this.$t('help.fileFormats.notValid'),
        },
        {
          line: [
            'chr8	127736518	127736638	',
            'MYC',
            ':MYC_chr8:128748839-128748869:275761_14977530_MYC_chr8:128748839-128748869_1',
          ],
          validation: 'MYC',
        },
        {
          line: [
            'chr12	11853597	11853717	',
            'ETV6_Fusion',
            ':ETV6:278717_15649951_ETV6_5',
          ],
          validation: 'ETV6_FUSION',
        },
        {
          line: [
            'chrX	155071469	155071589	',
            'BRCC3',
            ':BRCC3_chrX:154299802-154299925:275728_14960831_BRCC3_chrX:154299802-154299925_1',
          ],
          validation: 'BRCC3',
        },
      ],
    }
  },
  computed: {},
  methods: {},
  watch: {},
  mounted() {},
})
</script>

<style scoped>
.code {
  font-family: monospace;
}
</style>
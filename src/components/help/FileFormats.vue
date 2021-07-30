<template>
  <main-content-template :twoCols="false" inner>
    <template v-slot:one-col>
      <v-card outlined>
        <v-card-title>
          <span class="mr-2"> {{ $t('help.fileFormats.title.text') }} </span>
        </v-card-title>
        <v-card-text>
          <div>
            GTI accepts two file formats to import new panels: .csv and .bed.
          </div>
          <v-row>
            <v-col>
              <div>CSV</div>
              <div>
                It's a simple text file: one column with a list of genes.
              </div>
              <div>
                The first row needs to be the column header (the label doesn't
                matter). Other columns are ignored.
              </div>
              <div class="grey lighten-4 code pa-2">
                <div v-for="(line, index) in csvContent" :key="index">
                  {{ line }}
                </div>
              </div>
            </v-col>
            <v-col>
              <div>BED</div>
              <div>
                Bed files have at least 4 columns, separated by tabs (no
                header):
                <span class="grey lighten-4 code"> CHR START END NAME </span>
              </div>
              <div>
                At the moment, only the NAME column is parsed. The gene name is
                extracted by taking the first term before
                <span class="grey lighten-4 code">:</span>
              </div>
              <div class="grey lighten-4 code pa-2">
                <div v-for="(line, index) in bedContent" :key="index">
                  {{ line.line[0] }} {{ line.line[1] }}{{ line.line[2] }}
                </div>
              </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>Bed File Content</th>
                      <th>Gene Extracted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(line, index) in bedContent" :key="index">
                      <td>
                        {{ line.line[0] }} <b>{{ line.line[1] }}</b
                        >{{ line.line[2] }}
                      </td>
                      <td>
                        {{ line.validation }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-col>
          </v-row>
          <div>
            When parsing a file, GTI only uses the gene name, it could be a
            symbol or a synonym. If it cannot find a matching term, the gene is
            considered 'Not Found' and ignored during searches.
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
          validation: 'SNP is not a valid gene',
        },
        {
          line: ['chr8	127730434	127736593	', 'MYC_upstream', ''],
          validation: 'MYC_upstream is not a valid gene',
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
          validation: 'ETV6_Fusion is not a valid gene',
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
/* eslint-disable vue/html-indent */
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card outlined>
          <v-card-text>
            <div class="mb-1 mt-1">{{$t("buildPanels.existingPanels.text")}}</div>
            <v-chip
              text-color="black"
              class="ma-2 secondary"
              v-for="panel in panels"
              :key="panel.name"
            >{{ panel.name }} ({{ $tc("count.gene", panel.genes.length) }})</v-chip
            >
            <div class="mb-1 mt-1">{{$t("buildPanels.rawPanels.text")}}</div>
            <v-chip
              class="ma-2 primary"
              v-for="panelName in panelNames"
              :key="panelName"
            >{{ panelName }}</v-chip
            >
          </v-card-text>
          <v-card-actions>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" @click="buildPanels" class="primary"
                >{{ $t("button.buildPanels.text")}}</v-btn
                >
              </template>
              <span>{{ $t("button.buildPanels.tooltip")}}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  @click="downloadAllPanels"
                  class="primary ml-2"
                  :disabled="isEmptyPanels()"
                >{{ $t("button.saveAllPanels.text")}}</v-btn
                >
              </template>
              <span>{{ $t("button.saveAllPanels.tooltip")}}</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-card outlined class="mb-2"
        ><v-card-text>
          <span v-html="$t('buildPanels.help.text')"></span>
        </v-card-text></v-card
        >
        <v-card outlined v-if="tempPanels.length  > 0">
          <v-expansion-panels flat focusable>
            <v-expansion-panel v-for="panel in tempPanels" :key="panel.name">
              <v-expansion-panel-header disable-icon-rotate
              >{{ panel.name }} ({{ $tc("count.gene", panel.genes.length) }})
                <template v-slot:actions>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" @click.stop="downloadPanel(panel)" icon>
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>
                    </template>
                    <span>{{ $t("button.saveOnePanel.tooltip")}}</span>
                  </v-tooltip>
                  <v-icon> mdi-chevron-down </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <div class="pa-2" v-text="formatPanel(panel, true)"></div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { mapGetters } from "vuex";
import { Gene, GenePanel, PanelPayload } from "@/types/panel-types";

export default Vue.extend({
  name: "BuildPanel",

  data: () => ({
    rawDir: "raw_panels/",
    sourceDir: "source_panels/",
    panelNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
  }),
  methods: {
    buildPanels() {
      this.$store.commit("resetTempPanels");
      for (var i = 0; i < this.panelNames.length; i++) {
        var path = this.publicPath + this.rawDir + this.panelNames[i];
        axios
          .get(path, {
            params: {},
          })
          .then((response) => {
            var reponseURLItems = response.request.responseURL.split("/");
            var panelName =
              reponseURLItems[reponseURLItems.length - 1].split(".csv")[0];
            var allRows = response.data.split(/\r?\n|\r/);
            //remove dups
            var uniqueRows = new Set<string>();
            for (let j = 1; j < allRows.length; j++) {
              //skip header row
              var row = allRows[j];
              if (!row || row.length == 0) {
                continue;
              }
              var rowItems = row.split(",");
              uniqueRows.add(rowItems[0].trim());
            }
            var uniqueRowsArray = Array.from(uniqueRows);
            var panelGenes: Gene[] = [];
            for (let j = 0; j < uniqueRowsArray.length; j++) {
              var geneSymbol = uniqueRowsArray[j];
              if (!geneSymbol || geneSymbol.length == 0) {
                continue;
              }
              panelGenes.push({
                name: geneSymbol,
              });
            }
            var panel = new GenePanel(panelName, panelGenes);
            this.$store.commit("addTempPanel", new PanelPayload(panel));
          })
          .catch((error) => {
            alert(error);
          });
      }
    },
    formatPanel(panel: GenePanel, pretty: boolean) {
      var string = pretty
        ? JSON.stringify(panel, null, 2)
        : JSON.stringify(panel);
      return string;
    },
    downloadPanel(panel: GenePanel) {
      var content = this.formatPanel(panel, false);
      var a = document.createElement("a");
      var file = new Blob([content], { type: "text/json" });
      a.href = URL.createObjectURL(file);
      a.download = panel.name + ".json";
      a.click();
      URL.revokeObjectURL(a.href);
      a.remove();
    },
    downloadAllPanels() {
      for (var i = 0; i < this.tempPanels.length; i++) {
        this.downloadPanel(this.tempPanels[i]);
      }
    },
    isEmptyPanels() {
      return !this.tempPanels || this.tempPanels.length == 0;
    },
    listCSVFiles(r: any) {
      this.panelNames = [];
      r.keys().forEach((key: any) => this.panelNames.push(key));
    },
  },
  computed: {
    ...mapGetters({
      tempPanels: "getTempPanels",
      panels: "getPanels",
    }),
  },
  mounted() {
    this.listCSVFiles(
      require.context("../../public/raw_panels/", false, /\.csv$/)
    );
  },
});
</script>

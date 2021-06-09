<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" lg="4">
        <v-card>
          <v-card-text>
            <div class="mb-2">Raw Panel Files:</div>
            <v-chip class="ml-2 mr-2 primary" v-for="panelName in panelNames" :key="panelName" >{{panelName}}</v-chip>
         
          </v-card-text>
          <v-card-actions>   <v-btn @click="buildPanels" class="primary" >Build Panels</v-btn>
            <v-btn @click="downloadAllPanels" class="primary" :disabled="isEmptyPanels()">Save All</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" lg="8">
        <v-expansion-panels>
          <v-expansion-panel v-for="panel in tempPanels" :key="panel.name">
            <v-expansion-panel-header disable-icon-rotate>{{panel.name}}
              <template v-slot:actions>
                <v-btn @click.stop="downloadPanel(panel)" icon>
                  <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-icon>
                  mdi-chevron-down
                </v-icon>

              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content >
              <div class="pa-2" v-text="formatPanel(panel, true)"></div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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
    sourceDir: "raw_panels/",
    panelNames: ["GOAL_497_Core_Set.csv", "GOAL_2640.csv", "GS700_V2.csv"],
    publicPath: process.env.BASE_URL
  }),
  methods: {
    buildPanels() {
      this.$store.commit("resetPanels");
      for (var i = 0; i < this.panelNames.length; i++) {
        var path = this.publicPath + this.sourceDir + this.panelNames[i];
        axios
          .get(path, {
            params: {},
          })
          .then((response) => {
            var reponseURLItems = response.request.responseURL.split("/");
            var panelName = reponseURLItems[reponseURLItems.length -1].split(".csv")[0];
            var allRows = response.data.split(/\r?\n|\r/);
            var panelGenes: Gene[] = [];
            for (var j = 1; j < allRows.length; j++) { //skip header row
              var row = allRows[j];
              if (!row || row.length == 0) {
                continue;
              }
              var rowItems = row.split(",");
              panelGenes.push({
                name: rowItems[0]
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
      var string = pretty ? JSON.stringify(panel, null, 2) : JSON.stringify(panel);
      return "const " + panel.name + "= " + string;
    },
    downloadPanel(panel: GenePanel) {
      var content = this.formatPanel(panel, false);
      var a = document.createElement("a");
      var file = new Blob([content], {type: 'text/json'});
      a.href= URL.createObjectURL(file);
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
    }
  },
  computed: {
    ...mapGetters({
      tempPanels: "getTempPanels"
    })
  }
});
</script>

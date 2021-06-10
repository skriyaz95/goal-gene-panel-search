<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <span class="title">Gene Panel Search</span>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/skriyaz95/goal-gene-panel-search"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import axios from "axios";
import { mapGetters } from "vuex";
import { PanelPayload } from "@/types/panel-types";

export default Vue.extend({
  name: "App",

  data: () => ({
    sourceDir: "source_panels/",
    panelNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
  }),
  methods: {
    importExistingPanels(r: any) {
      this.$store.commit("resetPanels");
      var jsonPanels = new Array<any>();
      r.keys().forEach((key: any) => jsonPanels.push(key));
      for (var i = 0; i < jsonPanels.length; i++) {
        var path = this.publicPath + this.sourceDir + jsonPanels[i];
        axios
          .get(path, {
            params: {},
          })
          .then((response) => {
            var panel = response.data;
            this.$store.commit("addPanel", new PanelPayload(panel));
          })
          .catch((error) => {
            alert(error);
          });
      }
    },
  },
  mounted() {
    this.importExistingPanels(
      require.context("../public/source_panels/", false, /\.json$/)
    );
  },
  computed: {
    ...mapGetters({
      panels: "getPanels",
    }),
  },
});
</script>

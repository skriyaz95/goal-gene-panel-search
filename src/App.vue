<template>
  <v-app :style="getBackgroundStyle()">
    <navigation-menu/>
    <v-app-bar app color="primary" dark flat clipped-left>
      <div class="d-flex align-center">
        <span class="title">Find Genes in Panels</span>
      </div>

      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{on}">
          <v-btn
            v-on="on"
            href="https://github.com/skriyaz95/goal-gene-panel-search"
            target="_blank"
            text
          >
            <span class="mr-2">{{$t("button.link.repo.text")}}</span>
            <v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </template>
        <span>{{$t("button.link.repo.tooltip")}}</span>
      </v-tooltip>
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
import NavigationMenu from "@/components/NavigationMenu.vue"

export default Vue.extend({
  name: "App",
  components: {NavigationMenu},

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
    getBackgroundStyle(lighten : boolean) {
      var background:any = this.$vuetify.theme.themes[this.theme].background;
      var backgroundString = "";
      if (lighten && background.base) { //check if string or object
        backgroundString = background.lighten5;
      }
      else {
        backgroundString = background;
      }
      return {background: backgroundString}
     }
  },
   computed: {
     theme() {
       if (this.$vuetify.theme.dark) {
         return "dark";
       }
       else {
         return "light";
       }
     },
    ...mapGetters({
      panels: "getPanels",
    }),
    
  },
  mounted() {
    this.importExistingPanels(
      require.context("../public/source_panels/", false, /\.json$/)
    );
  },
 
});
</script>

<style scoped>
.no-transition {
  transition: none;
}
</style>
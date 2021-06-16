<template>
  <v-app :style="getBackgroundStyle()">
    <v-navigation-drawer
      expand-on-hover
      bottom
      clipped
      app
      :mini-variant.sync="mini"
    >
      <v-card v-show="mini" flat min-height="256" >
        <v-img src="./assets/gti/gti_logo_nolabel_128.png"
               alt="GTI Logo" width="80%" 
               class="mt-2"
               style="margin:auto"></v-img>
        <v-img src="./assets/gti/gti_acronym_orig.png"
               alt="GTI Logo" 
               class="ml-2 mr-2 mt-10"
               width="35px" min-width="35px" max-width="35px"
        ></v-img>  
      </v-card>
      <v-card v-show="!mini" flat min-height="256" >  
        <v-img src="./assets/gti/gti_logo_256.png"
               alt="GTI Logo" width="70%" 
               class="mt-2 mb-4"
               style="margin:auto"></v-img>     
        <v-img src="./assets/gti/gti_label_512.png"
               alt="GTI Title"
               class="ma-2"
               width="225px" min-width="225px" max-width="225px"
        ></v-img>
      </v-card>
      <v-divider></v-divider>
      <v-list
        nav
        dense
      >
        <v-list-item link :to="{name: 'Home'}" active-class="primary" exact>
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item link :to="{name: 'Utils'}" active-class="primary" exact>
          <v-list-item-icon>
            <v-icon>mdi-cog</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Utils</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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

export default Vue.extend({
  name: "App",

  data: () => ({
    sourceDir: "source_panels/",
    panelNames: new Array<string>(),
    publicPath: process.env.BASE_URL,
    mini: true
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
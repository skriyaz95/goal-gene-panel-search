/* eslint-disable vue/html-indent */
<template>
  <v-navigation-drawer
    expand-on-hover
    bottom
    clipped
    app
    :mini-variant.sync="mini"
  >
    <v-card v-show="mini" flat min-height="256" >
      <v-img src="../assets/gti/gti_logo_nolabel_128.png"
             alt="GTI Logo" width="80%" 
             class="mt-2"
             style="margin:auto"></v-img>
      <v-img src="../assets/gti/gti_acronym_orig.png"
             alt="GTI Logo" 
             class="ml-2 mr-2 mt-10"
             width="35px" min-width="35px" max-width="35px"
      ></v-img>  
    </v-card>
    <v-card v-show="!mini" flat min-height="256" >  
      <v-img src="../assets/gti/gti_logo_256.png"
             alt="GTI Logo" width="70%" 
             class="mt-2 mb-4"
             style="margin:auto"></v-img>     
      <v-img src="../assets/gti/gti_label_512.png"
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
      <v-list-item link :to="{name: 'Home'}" active-class="primary lighten-2" exact>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t("navigation.home.text") }}</v-list-item-title>
      </v-list-item>
      <v-list-item link :to="{name: 'Utils'}" active-class="primary lighten-2" exact>
        <v-list-item-icon>
          <v-icon>mdi-cog</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ $t("navigation.utils.text") }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
          
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "NavigationMenu",
  props: {
  },
  data: () => ({
        mini: true
  }),
  methods: {
  },
  computed: {
  },
  mounted() {
  },
});
</script>

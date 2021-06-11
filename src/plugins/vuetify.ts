import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            // primary: colors.cyan,
            // secondary: colors.amber.lighten2,
            // background: colors.cyan, //App.vue applies a lighten5 on it
            primary: colors.indigo.lighten2,
            secondary: colors.amber.lighten2,
            background: colors.grey.base //App.vue applies a lighten5 on it
          },
        //   dark: {
        //     primary: colors.blue.lighten3,
        //   },
        },
      },
});





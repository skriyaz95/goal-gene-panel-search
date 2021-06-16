import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export const lightThemes = [
  {
    primary: colors.indigo.lighten2,
    secondary: colors.amber.lighten2,
    background: "#f2f3f8"
  },
  {
    primary: "#40978D",
    secondary: colors.amber.lighten2,
    background: "#f2f3f8"
  },
];


export default new Vuetify({
    theme: {
        themes: {
          light: lightThemes[1]
          ,
        //   dark: {
        //     primary: colors.blue.lighten3,
        //   },
        },
      },
});





import institutionData from "@/assets/institutions.json"
import panels from "@/assets/panels.json"

export default {
  panels: panels,
  institutions: institutionData,
  uiProps: {
    chipOutlined: false,
  },
  inputNeedsReload: false,
  lastTabHome: "panels",
  lastTabExplore: "",
  lastTabUtils: "utils",
  lastItemExplore: -1 as Number,
  lastItemUtils: -1 as Number,
}

import institutionData from "@/assets/institutions.json"
import panels from "@/assets/panels.json"

export default {
  panels: panels,
  lastSearch: String(),
  institutions: institutionData,
  uiProps: {
    chipOutlined: false,
  },
}

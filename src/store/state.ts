import institutionData from "@/assets/institutions.json"
import panels from "@/assets/panels.json"
import { LastSelection } from "@/types/ui-types"

export default {
  panels: panels,
  institutions: institutionData,
  uiProps: {
    chipOutlined: false,
  },
  inputNeedsReload: false,
  lastTabHome: "panels",
  lastExplorePath: null,
  lastUtilsPath: null,
  lastSelections: new Map<String, LastSelection>(),
}

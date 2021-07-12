/**
 * Util function to download files from the application
 * @param filename
 * @param content
 * @param contentType eg. text/json
 */
export default function(
  filename: string,
  content: any,
  contentType: string,
): any {
  const a = document.createElement("a")
  const file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = filename
  a.click()
  URL.revokeObjectURL(a.href)
  a.remove()
}

export function formatObjetToJson(obj: any, pretty: boolean): string {
  const string = pretty ? JSON.stringify(obj, null, 2) : JSON.stringify(obj)
  return string
}

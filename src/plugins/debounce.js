/**
 * helper function to delay execution of things like submitting
 * the user input.
 * Eg. in UserInput.vue
 * import debounce from '@/plugins/debounce'
 * [...]
 *  watch: {
    geneList: debounce(function (this: any, value: string) {
      this.submitUserInput(value)
    }, 500),
  },
 * @param {callback function} fn
 * @param {delay in ms} delay
 * @returns
 */

export default function debounce(fn, delay) {
  var timeoutID = null
  return function() {
    clearTimeout(timeoutID)
    var args = arguments
    var that = this
    timeoutID = setTimeout(function() {
      fn.apply(that, args)
    }, delay)
  }
}

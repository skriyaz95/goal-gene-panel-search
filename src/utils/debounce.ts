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

export default function (fn: any, delay: number): any {
  let timeoutID: number | undefined = undefined
  return function(this: any, ...args: IArguments[]) {
    clearTimeout(timeoutID)
    const that = this
    timeoutID = setTimeout(function() {
      fn.apply(that, args)
    }, delay)
  }
}



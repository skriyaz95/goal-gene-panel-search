export class UserInputPayload {
  userinput: string
  validSeparators: RegExp

  constructor(userinput: string, validSeparators: RegExp) {
    this.userinput = userinput
    this.validSeparators = validSeparators
  }
}

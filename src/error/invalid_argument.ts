import { E } from '@mosteast/base-error'

export class Invalid_argument extends E {
  constructor(message: string, solution: string) {
    super(...arguments)
  }

}

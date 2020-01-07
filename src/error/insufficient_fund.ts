import { E } from '@mosteast/base-error'

export class Insufficient_fund extends E {
  constructor(message: string, solution?: string) {
    super(...arguments)
  }
}

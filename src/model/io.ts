import { IO } from '../type'
import { T_tx_hash } from './tx'

/**
 * A transaction related to an address
 */
export class Io {

  /**
   * Tx hash
   */
  tx_hash: T_tx_hash

  /**
   * As input or output
   *
   * Use this property to determine spending or receiving
   *
   * as input: spending
   * as output: receiving
   */
  as: IO

  /**
   * IO in index
   */
  index_io: number

  /**
   * Transfer value
   */
  value: number

  confirmations: number

  script: string

  address: string
}

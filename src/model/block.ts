/**
 * To see how block works:
 * https://github.com/bitcoin-documentation/website/blob/master/devguide/block_chain.rst
 *
 * Datasource: `getblock`
 */
import { T_tx } from './tx'

export class Block {

  /**
   * the block hash.
   */
  hash: T_block_hash

  depth: number

  /**
   * The block height or index.
   */
  height: number

  /**
   * The block version.
   */
  version: number

  /**
   * The merkle root.
   */
  merkle_root: string

  /**
   * The block time in seconds since epoch (Jan 1 1970 GMT).
   */
  time: number

  /**
   * The nonce.
   */
  nonce: number

  /**
   * The difficulty.
   */
  difficulty: number

  /**
   * The bits.
   */
  bits: string

  /**
   * The number of transactions in the block.
   */
  tx_count: number

  /**
   * The hash of the previous block.
   */
  prev_block: string

  /**
   * The transaction ids.
   */
  txs: T_tx[]
}

export type T_block_hash = string


import { T_vin, T_vout } from '../type'

export class Tx implements T_tx {
  block: string
  coinbase: boolean
  confirmations: number
  hash: string
  height: number
  hex: string
  index: number
  input_count: number
  inputs: T_vin[]
  locktime: number
  mtime: number
  output_count: number
  outputs: T_vout[]
  time: number
  version
  witness_hash: string
  // content
}

export interface T_tx {
  block?: string
  confirmations?: number
  coinbase?: boolean
  hash?: string
  height?: number
  hex?: string
  index?: number
  input_count?: number
  inputs?: T_vin[]
  locktime?: number
  mtime?: number
  output_count?: number
  outputs?: T_vout[]
  time?: number
  version
  witness_hash?: string
  // content
}

export type T_tx_hash = string

export interface T_tx_bcoin {
  hash?: string
  witnessHash?: string
  fee?: number
  rate?: number
  mtime?: number
  height?: number
  block?: string
  time?: number
  index?: number
  version?: number
  inputs?: T_input_bcoin[]
  outputs?: T_output_bcoin[]
  locktime?: number
  hex?: string
  confirmations?: number
}

export interface T_input_bcoin {
  prevout?: {
    hash?: string
    index?: number
  }
  script?: number
  witness?: string
  sequence?: number
  coin?: {
    version?: number
    height?: number
    value?: number
    script?: string
    address?: string
    coinbase?: boolean
  }
}

export interface T_output_bcoin {
  value?: number
  script?: string
  address?: string
}

export interface T_wallet_pure {
  wif?: string
  address?: string
}

export interface T_manager {
  spend(from: T_address, to: T_address)

  wallet_generate(opt?: any): Promise<T_wallet_pure> | T_wallet_pure

  wallet_refresh(address: T_address)
}

export interface T_wallet_detail<T> {
  balance: number
  tx_count: number
  txs: T[]
}

/**
 * Supported crypto
 */
export enum CRYPTO {
  bitcoin = 'bitcoin'
}

export enum IO {
  input  = 'input',
  output = 'output',
}

export type T_address = string
export type T_wif = string
export type T_private_key = string

export enum N_wallet_source {random = 'random', seed = 'seed'}

export enum N_network {mainnet = 'mainnet', testnet = 'testnet'}

export enum N_currency {
  btc = 'btc'
}

export enum N_unit {
  btc = 'btc',
  sat = 'sat',
}

export interface T_io {
  addresses: string[] // NON-NATIVE
  value: number // NON-NATIVE
  n: number // NON-NATIVE
}

export interface T_vin extends T_io {
  coinbase: string, // Coinbase only.
  txid?: string
  vout?: number
  scriptSig?: {
    asm?: string,
    hex?: string
  }
  sequence?: number
  txinwitness?: string[]
}

export interface T_vout extends T_io {
  value: number
  n: number
  scriptPubKey: {
    asm: string
    hex: string
    reqSigs: number
    type: string
    addresses: string[]
  }
  sequence: number
  txinwitness: string[]
}


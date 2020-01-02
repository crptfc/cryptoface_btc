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

export type T_address = string
export type T_wif = string

export enum N_wallet_source {random = 'random', seed = 'seed'}

export enum N_network {mainnet = 'mainnet', testnet = 'testnet'}

export enum N_currency {
  btc = 'btc'
}

export enum N_unit {
  btc = 'btc',
  sat = 'sat',
}

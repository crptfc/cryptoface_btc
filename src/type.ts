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

export type T_btc_wallet_source = 'random' | 'seed'

export type T_btc_network = 'mainnet' | 'testnet'

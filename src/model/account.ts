import { T_account as T_account_common } from '@crptfc/cryptoface'
import { T_address, T_wallet_pure, T_wif } from '../type'
import { Io } from './io'
import { T_tx } from './tx'

export interface T_account extends T_account_common, T_wallet_pure {
  /**
   * Bitcoin address
   */
  address?: T_address

  /**
   * Wallet import format string
   */
  wif?: T_wif

  total_received?: number

  total_sent?: number

  balance_unconfirmed?: number

  balance_final?: number

  tx_count?: number

  ios?: Partial<Io>[]
}

export class Account implements T_account {
  address: T_address
  balance_final: number
  balance_unconfirmed: number
  id: string
  total_received: number
  total_sent: number
  tx_count: number
  ios: Io[]
  wif: T_wif
}

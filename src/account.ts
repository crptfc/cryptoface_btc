import { T_account } from '@crptfc/cryptoface'
import { T_wallet_pure } from './type'

export class Account implements T_account, T_wallet_pure {
  /**
   * Same as `address`
   */
  id: string

  /**
   * Bitcoin address
   */
  address: string

  /**
   * Wallet import format string
   */
  wif: string
}

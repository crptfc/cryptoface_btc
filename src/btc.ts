import { Cryptoface } from 'cryptoface/build'
import { Invalid_argument } from './error/invalid_argument'
import { T_address, T_btc_network, T_btc_wallet_source, T_wallet_pure, T_wif } from './type'

const bitcore = require('bitcore-lib')

export class Btc extends Cryptoface<T_opt, T_IN_create_account, T_IN_get_account, T_IN_create_transaction, T_IN_get_transaction> {
  create_account(opt?: T_IN_create_account): T_wallet_pure {
    const SOLUTION = 'Checkout `T_create_wallet_opt`, make sure all arguments\' types are correct'

    if (typeof opt === 'string') {
      opt = {
        source: opt,
      }
    }

    const { type } = {
      type: 'random',
      ...opt,
    }

    let wallet: T_wallet_pure, k

    switch (type) {
      case 'random':
        k = new bitcore.PrivateKey()

        wallet = {
          address: k.toAddress().toString(),
          wif: k.toWIF(),
        }

        break
      case 'seed':
        const seed = opt.seed

        if (!seed) {
          throw new Invalid_argument(`\`opt.magic\` is required when \`opt.type\` is \`"${type}"\``, SOLUTION)
        }

        const buf = Buffer.from(seed)
        const hash = bitcore.crypto.sha256(buf)
        const bn = bitcore.crypto.BN.fromBuffer(hash)
        k = new bitcore.PrivateKey(bn)

        wallet = {
          address: k.toAddress().toString(),
          wif: k.toWIF(),
        }
        break
      default: {
        throw new Invalid_argument('Invalid `opt.type`', SOLUTION)
      }
    }

    return wallet

  }

  create_accountS(optS: T_IN_create_account[]): T_wallet_pure[] {
    return optS.map(opt => this.create_account(opt))
  }

  get_account(opt: T_IN_get_account): any {
  }

  get_accountS(optS?: T_IN_get_account[]): any {
  }

  create_transaction(opt?: T_IN_create_transaction): any {
  }

  create_transactionS(optS?: T_IN_create_transaction[]): any {
  }

  get_transaction(opt?: T_IN_get_transaction): any {
  }

  get_transactionS(opt?: T_IN_get_transaction[]): any {
  }

  wif_import(wif: T_wif): T_wallet_pure {
    const k = new bitcore.PrivateKey(wif)
    return {
      wif: k.toWIF(),
      address: k.toAddress().toString(),
    }
  }
}

export interface T_opt {
  network: T_btc_network
}

export type T_IN_create_account = T_btc_wallet_source | {
  /**
   * How the wallet will be generated
   */
  source?: T_btc_wallet_source

  /**
   * Only required when `source` type is `'seed'`
   */
  seed?: string
}

export type T_IN_get_account = T_address

export interface T_IN_create_transaction {
  // content
}

export interface T_IN_get_transaction {
  // content
}


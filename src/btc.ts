import { T_account, T_cryptoface } from '@crptfc/cryptoface'
import { Invalid_argument } from './error/invalid_argument'
import { T_address, N_network, N_wallet_source, T_wallet_pure, T_wif, N_unit, N_currency } from './type'
import { Account } from './account'

const bitcoin = require('bitcoinjs-lib')

export interface T_cryptoface_btc extends T_cryptoface<T_opt, N_currency, N_unit, T_IN_create_account, T_IN_get_account, T_IN_create_transaction, T_IN_get_transaction> {
  wif_import(wif: T_wif): T_wallet_pure

  create_account(opt?: T_IN_create_account): Account
}

export const btc: T_cryptoface_btc = {
  create_account(opt?: T_IN_create_account): Account {
    const SOLUTION = 'Checkout `T_create_wallet_opt`, make sure all arguments\' types are correct'

    if (typeof opt === 'string') {
      opt = {
        source: opt,
      }
    }

    const { source } = opt = {
      source: N_wallet_source.random,
      ...opt,
    }

    let account: Account = new Account(), key

    switch (source) {
      case 'random':
        key = bitcoin.ECPair.makeRandom()

        account.id = account.address = bitcoin.payments.p2pkh({ pubkey: key.publicKey }).address
        account.wif = key.toWIF()
        break
      case 'seed':
        const seed = opt.seed

        if (!seed) {
          throw new Invalid_argument(`\`opt.seed\` is required when \`opt.type\` is \`"${source}"\``, SOLUTION)
        }

        key = bitcoin.ECPair.fromPrivateKey(bitcoin.crypto.sha256(Buffer.from(opt.seed)))

        account.id = account.address = bitcoin.payments.p2pkh({ pubkey: key.publicKey }).address
        account.wif = key.toWIF()
        break
      default: {
        throw new Invalid_argument('Invalid `opt.type`', SOLUTION)
      }
    }

    return account

  },

  create_accountS(optS: T_IN_create_account[]): T_account[] {
    return optS.map(opt => this.create_account(opt))
  },

  get_account(opt: T_IN_get_account): any {
    if (typeof opt === 'string') {
      opt = { address: opt }
    }

  },

  get_accountS(optS?: T_IN_get_account[]): any {
  },

  create_transaction(opt?: T_IN_create_transaction): any {
  },

  create_transactionS(optS?: T_IN_create_transaction[]): any {
  },

  get_transaction(opt?: T_IN_get_transaction): any {
  },

  get_transactionS(opt?: T_IN_get_transaction[]): any {
  },

  wif_import(wif: T_wif): T_wallet_pure {
    const key = bitcoin.ECPair.fromWIF(wif)

    return {
      wif: key.toWIF(),
      address: bitcoin.payments.p2pkh({ pubkey: key.publicKey }).address,
    }
  },
}

export interface T_opt {
  network: N_network
}

export type T_IN_create_account = N_wallet_source | {
  /**
   * How the wallet will be generated
   */
  source?: N_wallet_source

  /**
   * Only required when `source` type is `'seed'`
   */
  seed?: string
}

export type T_IN_get_account = T_address | {
  address: T_address
}

export interface T_IN_create_transaction {
  // content
}

export interface T_IN_get_transaction {
  // content
}


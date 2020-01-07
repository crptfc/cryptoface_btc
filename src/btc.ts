import { T_account, T_cryptoface } from '@crptfc/cryptoface'
import { Account } from './model/account'
import { Invalid_argument } from './error/invalid_argument'
import { Client_blockcypher } from './lib/blockcypher/client'
import { N_currency, N_network, N_unit, N_wallet_source, T_address, T_private_key, T_wallet_pure, T_wif } from './type'

const env = process.env

const bitcoin = require('bitcoinjs-lib')
const bc = new Client_blockcypher()

export interface T_cryptoface_btc extends T_cryptoface<T_opt, N_currency, N_unit, T_IN_create_account, T_IN_get_account, T_IN_create_transaction, T_IN_get_transaction> {
  wif_import(wif: T_wif): T_wallet_pure

  create_account(opt?: T_IN_create_account): Account

  create_accountS(count: number): T_account[]

  create_accountS(optS: T_IN_create_account[]): T_account[]

  create_transaction(from: T_private_key, to: T_address): Promise<any>

  create_transaction(opt: T_IN_create_transaction): Promise<any>

  get_utxoS(address: T_address): Promise<any>

  get_utxoS(opt: T_IN_get_utxoS): Promise<any>
}

export class Btc implements T_cryptoface_btc {
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

  }

  /**
   * @param optS - option array or number of random account
   */
  create_accountS(optS: T_IN_create_account[] | number): T_account[] {
    if (typeof optS === 'number') {
      const count = optS
      optS = []
      for (let i = 0; i < count; i++) {
        optS.push(<T_IN_create_account>{
          source: N_wallet_source.random,
        })
      }
    }

    return optS.map(opt => this.create_account(opt))
  }

  get_account(opt: T_IN_get_account): Promise<Account> {
    if (typeof opt === 'string') {
      opt = { address: opt }
    }

    return bc.get_address(opt.address)
  }

  async create_transaction(a, b?): Promise<any> {

    let opt: Partial<T_IN_create_transaction> = {
      from: {},
      to: {},
    }

    switch (typeof a) {
      case 'string':
        opt.from.private_key = a
        opt.to.address = b
        break
      case 'object':
        opt = a
        break
      default:
        throw new Invalid_argument(`Invalid argument type "${typeof a}"`, 'Argument example: create_transaction("a_private_key", "an_addr") or create_transaction(obj_T_IN_create_transaction)')
    }

    let pk   = opt.from.private_key,
        wif  = opt.from.wif,
        addr = opt.to.address

    if ((!pk && !wif) || !addr) {
      throw new Invalid_argument('Missing private key or address', 'private key or address should both be passed')
    }
    let key
    try {
      key = bitcoin.ECPair.fromPrivateKey(Buffer.from(pk))
    } catch (e) {
      if (e.message.includes('Expected Buffer(Length:')) {
        throw new Invalid_argument('Invalid `from.private_key`, If you are passing WIF please use `from.wif` to assign it')
      }
    }

    if (!key) {
      try {
        key = bitcoin.ECPair.fromWIF(wif)
      } catch (e) {
        throw new Invalid_argument('Invalid `from.wif`, If you are passing private key please use `from.private_key` to assign it')
      }
    }

    const address = bitcoin.payments.p2pkh({ pubkey: key.publicKey }).address.toString()
    const r = await this.get_utxoS(address)
    console.log(r)
    return

    const tx = new bitcoin.TransactionBuilder()
    tx.addInput('d18e7106e5492baf8f3929d2d573d27d89277f3825d3836aa86ea1d843b5158b', 1)
    tx.addOutput('12idKQBikRgRuZEbtxXQ4WFYB7Wa3hZzhT', 149000)
    tx.sign(0, key)
    console.log(tx.build().toHex())

    return new Promise<any>(() => {})
  }

  create_transactionS(optS?: T_IN_create_transaction[]): any {
  }

  get_utxoS(a: T_IN_get_utxoS | T_address) {
    let opt: Partial<T_IN_get_utxoS> = {}

    switch (typeof a) {
      case 'string':
        opt.address = a
        break
      case 'object':
        opt = a
        break
      default:
        throw new Invalid_argument(`Invalid argument type ${typeof a}`, 'Argument example: get_utxoS("an_addr") or create_transaction(T_IN_get_utxoS)')
    }

    return bc.get_utxoS(opt.address)
  }

  get_transaction(opt?: T_IN_get_transaction): any {
  }

  get_transactionS(opt?: T_IN_get_transaction[]): any {
  }

  wif_import(wif: T_wif): T_wallet_pure {
    const key = bitcoin.ECPair.fromWIF(wif)

    return {
      wif: key.toWIF(),
      address: bitcoin.payments.p2pkh({ pubkey: key.publicKey }).address,
    }
  }
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
  from: {
    private_key?: T_private_key,
    wif?: T_wif,
  },
  to: {
    address?: T_address
  }
}

export interface T_IN_get_transaction {
  // content
}

export interface T_IN_get_utxoS {
  address: T_address
}


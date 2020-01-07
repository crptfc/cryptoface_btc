import { T_account, T_cryptoface } from '@crptfc/cryptoface'
import { Network } from 'bitcoinjs-lib/types/networks'
import { Payment, PaymentOpts } from 'bitcoinjs-lib/types/payments'
import { Insufficient_fund } from './error/insufficient_fund'
import { Invalid_argument } from './error/invalid_argument'
import { Client_bcoin } from './lib/bcoin/client'
import { Client_blockcypher } from './lib/blockcypher/client'
import { Account } from './model/account'
import { Fee } from './model/fee'
import { Io } from './model/io'
import { CURRENCY, NET, UNIT, WALLET_SOURCE, T_address, T_private_key, T_wallet_pure, T_wif } from './type'

const env = process.env

const bitcoin = require('bitcoinjs-lib')

export interface T_cryptoface_btc extends T_cryptoface<T_opt, CURRENCY, UNIT, T_IN_create_account, T_IN_get_account, T_IN_create_transaction, T_IN_get_transaction> {
  wif_import(wif: T_wif): T_wallet_pure

  create_account(opt?: T_IN_create_account): Account

  create_accountS(count: number): T_account[]

  create_accountS(optS: T_IN_create_account[]): T_account[]

  create_transaction(from: T_private_key, to: T_address, value: number): Promise<any>

  create_transaction(opt: T_IN_create_transaction): Promise<any>

  get_utxo(address: T_address): Promise<any>

  get_utxo(opt: T_IN_get_utxoS): Promise<any>
}

export class Btc implements T_cryptoface_btc {
  opt: T_opt = {
    network: NET.main,
  }

  client: Client_blockcypher

  constructor(opt?: T_opt | NET) {
    let o: T_opt = {}

    switch (typeof opt) {
      case 'string':
        o.network = opt
        break
      case 'object':
        o = opt
        break
    }
    this.opt_merge(o)
  }

  opt_merge(opt: T_opt) {
    this.opt = {
      network: NET.main,
      ...this.opt,
      ...opt,
    }

    this.client_init()
  }

  client_init() {
    this.client = new Client_blockcypher(this.opt)
  }

  create_account(opt?: T_IN_create_account): Account {
    const SOLUTION = 'Checkout `T_create_wallet_opt`, make sure all arguments\' types are correct'

    if (typeof opt === 'string') {
      opt = {
        source: opt,
      }
    }

    const { source } = opt = {
      source: WALLET_SOURCE.random,
      ...opt,
    }

    let account: Account = new Account(), key

    switch (source) {
      case 'random':
        key = bitcoin.ECPair.makeRandom()

        account.id = account.address = this._p2pkh({ pubkey: key.publicKey }).address
        account.wif = key.toWIF()
        break
      case 'seed':
        const seed = opt.seed

        if (!seed) {
          throw new Invalid_argument(`\`opt.seed\` is required when \`opt.type\` is \`"${source}"\``, SOLUTION)
        }

        key = this._from_private_key(bitcoin.crypto.sha256(Buffer.from(opt.seed)))

        account.id = account.address = this._p2pkh({ pubkey: key.publicKey }).address
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
          source: WALLET_SOURCE.random,
        })
      }
    }

    return optS.map(opt => this.create_account(opt))
  }

  get_account(opt: T_IN_get_account): Promise<Account> {
    if (typeof opt === 'string') {
      opt = { address: opt }
    }

    return this.client.get_address(opt.address)
  }

  async create_transaction(a: T_IN_create_transaction | T_private_key, b?: T_address, c?: number): Promise<any> {

    let opt: Partial<T_IN_create_transaction> = {
      from: {},
      to: {},
    }

    switch (typeof a) {
      case 'string':
        opt.from.private_key = a
        opt.to.address = b
        opt.value = c
        break
      case 'object':
        opt = a
        break
      default:
        throw new Invalid_argument(`Invalid argument type "${typeof a}"`, 'Argument example: create_transaction("a_private_key", "an_addr") or create_transaction(obj_T_IN_create_transaction)')
    }

    // f_ : from
    // t_ : to
    let f_pk   = opt.from.private_key,
        f_wif  = opt.from.wif,
        t_addr = opt.to.address,
        value  = opt.value,
        fee    = opt.fee

    if ((!f_pk && !f_wif) || !t_addr || !value) {
      throw new Invalid_argument('Options `form`, `to` and `value` are required', 'private key or address should both be passed')
    }

    let key
    if (f_pk) {
      try {
        key = this._from_private_key(f_pk)
      } catch (e) {
        if (e.message.includes('Expected Buffer(Length:')) {
          throw new Invalid_argument('Invalid `from.private_key`, If you are passing WIF please use `from.wif` to assign it')
        }
      }
    } else {
      try {
        key = this._from_wif(f_wif)
      } catch (e) {
        throw new Invalid_argument('Invalid `from.wif`, If you are passing private key please use `from.private_key` to assign it')
      }
    }

    const f_addr = this._p2pkh({
      pubkey: key.publicKey,
    }).address.toString()

    const ios = await this.get_utxo(f_addr)
    // const inputs = []
    // const outputs = []
    let total_input = 0

    // console.log(ios)
    //
    const tx = new bitcoin.TransactionBuilder(adapter_net_bitcoinjs(this.opt.network))
    for (let it of ios) {
      total_input += it.value
      tx.addInput(it.tx_hash, it.index_io)
      if (total_input >= value) {
        break
      }
    }

    if (total_input <= value) {
      throw new Insufficient_fund(`Expected balance >= ${value}, Actual balance: ${total_input}`)
    }

    tx.maximumFeeRate = (await this.get_fee_rate()).high

    tx.addOutput(this._to_output_script(t_addr), value)
    tx.sign(0, key)
    const hex = tx.build().toHex()

    const bcoin = new Client_bcoin()
    const r = await bcoin.broadcast_raw_transaction(hex).catch(console.log)
    console.log(hex, r)
  }

  create_transactionS(optS?: T_IN_create_transaction[]): any {
  }

  get_utxo(a: T_IN_get_utxoS | T_address): Promise<Io[]> {
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

    return this.client.get_utxo(opt.address)
  }

  get_fee_rate(): Promise<Fee> {
    return this.client.get_fee_rate()
  }

  get_transaction(opt?: T_IN_get_transaction): any {
  }

  get_transactionS(opt?: T_IN_get_transaction[]): any {
  }

  wif_import(wif: T_wif): T_wallet_pure {
    const key = bitcoin.ECPair.fromWIF(wif)

    return {
      wif: key.toWIF(),
      address: this._p2pkh({ pubkey: key.publicKey }).address,
    }
  }

  _to_output_script(address: string, network?: Network): Buffer {
    return bitcoin.address.toOutputScript(address, adapter_net_bitcoinjs(this.opt.network))
  }

  _p2pkh(a: Payment, opts?: PaymentOpts) {
    a = {
      network: adapter_net_bitcoinjs(this.opt.network),
      ...a,
    }

    return bitcoin.payments.p2pkh(a, opts)
  }

  _from_private_key(pk: T_private_key | Buffer) {
    const buf = typeof pk == 'string' ? Buffer.from(pk) : pk
    return bitcoin.ECPair.fromPrivateKey(buf, { network: adapter_net_bitcoinjs(this.opt.network) })
  }

  _from_wif(wif: T_wif) {
    return bitcoin.ECPair.fromWIF(wif, adapter_net_bitcoinjs(this.opt.network))
  }
}

export function adapter_net_bitcoinjs(net: NET) {
  const n = bitcoin.networks
  const map = {
    main: n.bitcoin,
    test: n.testnet,
    regtest: n.regtest,
  }

  return map[net.toString()]
}

export interface T_opt {
  network?: NET
}

export type T_IN_create_account = WALLET_SOURCE | {
  /**
   * How the wallet will be generated
   */
  source?: WALLET_SOURCE

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
  },
  value: number,
  fee?: number
}

export interface T_IN_get_transaction {
  // content
}

export interface T_IN_get_utxoS {
  address: T_address
}


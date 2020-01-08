import { T_opt } from '../../btc'
import { Account } from '../../model/account'
import { Fee } from '../../model/fee'
import { Io } from '../../model/io'
import { IO, NET, T_address } from '../../type'
import { adapter_account_blockcypher, T_account_blockcypher } from './adapter'

const Bc = require('blockcypher')

const { get } = require('axios')

const URL_ROOT = 'https://api.blockcypher.com/v1/btc'

class Client {
  opt: T_opt = {
    network: NET.main,
  }

  constructor(opt?) {
    this.opt = {
      ...this.opt,
      ...opt,
    }
  }

  api<T = any>(url = '', opt?, request_opt?): Promise<T> {

    const net_map = {
      main: 'main',
      test: 'test3',
    }

    const full = URL_ROOT + '/' + net_map[this.opt.network.toString()] + '/' + (url ? url + '/' : '')

    return get(full, {
      params: opt,
      ...request_opt,
    }).then(r => <any>r.data)
  }

  get_address(address: T_address, opt?): Promise<Account> {
    return this.api<T_account_blockcypher>('addrs/' + address, opt).then(adapter_account_blockcypher)
  }

  get_utxo(address: T_address, opt?): Promise<Io[]> {
    return this.get_address(address, { unspentOnly: true, ...opt })
      .then(r => r.ios.filter(it => it.confirmations >= 1 && it.as === IO.output))
  }

  get_fee_rate(): Promise<Fee> {
    return this.api().then(r => {
      const { ceil } = Math

      const fee = new Fee()
      fee.low = ceil(r.low_fee_per_kb / 1024)
      fee.medium = ceil(r.medium_fee_per_kb / 1024)
      fee.high = ceil(r.high_fee_per_kb / 1024)

      return fee
    })
  }

  broadcast_raw_transaction(hex: string) {
    return this.api(`txs/push?token=${process.env.key_blockcypher}`, {}, {
      method: 'post',
      data: { tx: hex },
    })
  }
}

export { Client as Client_blockcypher }

export interface T_blockcypher_opt {
  network: NET,
}

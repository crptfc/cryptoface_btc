import { Account } from '../../model/account'
import { T_address } from '../../type'
import { adapter_account_blockcypher, T_account_blockcypher } from './adapter'

const { get } = require('axios')

const URL_ROOT = 'https://api.blockcypher.com/v1/btc'

class Client {
  opt = {
    net: 'main',
  }

  constructor(opt?) {
    this.opt = {
      ...opt,
      ...this.opt,
    }
  }

  api<T = any>(url, opt?): Promise<T> {
    const full = URL_ROOT + '/' + this.opt.net + '/' + url + '/'

    return get(full, {
      params: opt,
    }).then(r => <any>r.data)
  }

  get_address(address: T_address, opt?): Promise<Account> {
    return this.api<T_account_blockcypher>('addrs/' + address, opt).then(adapter_account_blockcypher)
  }

  get_utxoS(address: T_address, opt?): Promise<Account> {
    return this.get_address(address, { unspentOnly: true, ...opt })
  }
}

export { Client as Client_blockcypher }

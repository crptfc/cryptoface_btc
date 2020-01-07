import { T_opt } from '../../btc'
import { Account } from '../../model/account'
import { N_network, T_address } from '../../type'
import { adapter_account_blockcypher, T_account_blockcypher } from './adapter'

const { get } = require('axios')

const URL_ROOT = 'https://api.blockcypher.com/v1/btc'

class Client {
  opt: T_opt = {
    network: N_network.main,
  }

  constructor(opt?) {
    this.opt = {
      ...this.opt,
      ...opt,
    }
  }

  api<T = any>(url, opt?): Promise<T> {

    const net_map = {
      main: 'main',
      test: 'test3',
    }

    const full = URL_ROOT + '/' + net_map[this.opt.network.toString()] + '/' + url + '/'

    return get(full, {
      params: opt,
    }).then(r => <any>r.data)
  }

  get_address(address: T_address, opt?): Promise<Account> {
    return this.api<T_account_blockcypher>('addrs/' + address, opt).then(adapter_account_blockcypher)
  }

  get_utxo(address: T_address, opt?): Promise<Account> {
    return this.get_address(address, { unspentOnly: true, ...opt })
  }
}

export { Client as Client_blockcypher }

export interface T_blockcypher_opt {
  network: N_network,
}

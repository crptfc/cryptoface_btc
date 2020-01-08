import { T_opt } from '../../btc'
import { Account } from '../../model/account'
import { Io } from '../../model/io'
import { IO, NET, T_address } from '../../type'
import { T_tx_bcoin } from './adapter'

const axios = require('axios')
const { post, get } = axios

export interface T_client_bcoin_opt extends T_opt {
  // Base url set
  base_url: { [key: string]: string }
}

class Client {
  opt: T_client_bcoin_opt = {
    network: NET.main,
    base_url: {
      main: 'http://114.55.242.36:1234',
      test: 'http://114.55.242.36:4321',
    },
  }

  constructor(opt?: T_opt) {
    this.opt = {
      ...this.opt,
      ...opt,
    }
  }

  get_base_url() {
    const net = this.opt.network.toString()
    return this.opt.base_url[net]
  }

  api<T = any>(url = '', opt?): Promise<T> {
    const full = this.get_base_url() + '/' + (url ?? '')

    return axios({
      url: full,
      method: 'get',
      ...opt,
    }).then(r => <any>r.data)
  }

  broadcast_raw_transaction(hex: string): Promise<any> {
    return post(this.get_base_url() + '/broadcast', { tx: hex })
  }

  get_address(address: T_address): Promise<Account> {
    return this.api(`tx/address/${address}`).then((r: T_tx_bcoin[]) => {
      if (!Array.isArray(r)) {return}

      const ins = new Account()
      ins.address = ins.id = address
      ins.balance_final = 0
      ins.total_received = 0
      ins.total_sent = 0
      ins.tx_count = r.length
      ins.ios = []

      r.forEach((tx: T_tx_bcoin) => {
        tx.inputs.forEach((input, i) => {
          const coin = input.coin

          if (!coin) {
            return
          }

          if (coin.address === address) {
            const io = new Io()
            io.address = coin.address
            io.tx_hash = tx.hash
            io.index_io = i
            io.value = coin.value
            io.confirmations = tx.confirmations
            io.script = coin.script

            ins.balance_final -= io.value
            ins.total_sent += io.value
            io.as = IO.input

            ins.ios.push(io)

          }
        })

        tx.outputs.forEach((output, i) => {

          if (output.address === address) {
            const io = new Io()
            io.address = address
            io.tx_hash = tx.hash
            io.index_io = i
            io.value = output.value
            io.confirmations = tx.confirmations
            io.script = output.script
            ins.balance_final += output.value
            ins.total_received += output.value
            io.as = IO.output
            ins.ios.push(io)
          }

        })
      })

      return ins
    })
  }
}

export { Client as Client_bcoin }

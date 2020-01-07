import { T_opt } from '../../btc'

const { post } = require('axios')

class Client {
  constructor(opt?: T_opt) {
  }

  broadcast_raw_transaction(hex: string): Promise<any> {
    return post('http://114.55.242.36:4321/broadcast', { tx: hex })
  }
}

export { Client as Client_bcoin }

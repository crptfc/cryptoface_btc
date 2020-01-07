import { Account } from '../../model/account'
import { Client_blockcypher } from './client'

const c = new Client_blockcypher()

jest.setTimeout(20000)

it('can get address', async done => {
  // @ts-ignore
  const r: Account = await c.get_address('12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX').catch(console.log)
  expect(r.total_received).toBeTruthy()
  done()
})

it('can get utxoS', async done => {
  const r = await c.get_utxo('12c6DSiU4Rq3P4ZxziKxzrL5LmMBrzjrJX')
  expect(r.total_received).toBeTruthy()
  done()
})

it('should ', async () => {
  class A {
    p1 = 1

    constructor(value) {
      this.p1 = value
    }
  }

 const a = new A(2)
  console.log(a)
})

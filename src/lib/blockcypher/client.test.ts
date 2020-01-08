import { Account } from '../../model/account'
import { NET } from '../../type'
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
  expect(r.length).toBeTruthy()
  done()
})

it('Can get fee rate', async done => {
  const r = await c.get_fee_rate()
  console.log(r)
  done()
})

it('create_transaction_skeleton()', async (done) => {
  const b = new Client_blockcypher({ network: NET.test })
  b.create_transaction_skeleton('mswaTiadP1ZeNWgRaMwkYK1AGqhr5YVdSk', 'mkRpD5mbp6cSXouU5Rk3oJPEbyyA8UBjZh', 1000)
    .then(r => {
      console.log(r.tx.inputs, r.tx.outputs)
    }).catch(r => {
      console.log(r.response.data)
    })
    .finally(done)
})

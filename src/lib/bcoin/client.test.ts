import { NET } from '../../type'
import { Client_blockcypher } from '../blockcypher/client'
import { Client_bcoin } from './client'

jest.setTimeout(200000)

it('can get address', async (done) => {
  const c = new Client_bcoin({ network: NET.test })
  const r = await c.get_address('n4eY3qiP9pi32MWC6FcJFHciSsfNiYFYgR')

  const c2 = new Client_blockcypher({ network: NET.test })
  const r2 = await c2.get_address('n4eY3qiP9pi32MWC6FcJFHciSsfNiYFYgR')
  console.log(r.balance_final, r2.balance_final)
  expect(r.balance_final).toBe(r2.balance_final)
  done()
})


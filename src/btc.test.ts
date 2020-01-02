import { Btc } from './btc'

it('should generate random wallet', async () => {
  const btc = new Btc()
  const wallet = btc.create_account('random')
  expect(wallet.address.length).toBeTruthy()
  expect(wallet.wif.length).toBeTruthy()
})

it('should be able to import wallet', async () => {
  const wallet1 = {
    address: '1PM8UPHT6iPkvyXqER7HuybnUKREfYHbWE',
    wif: 'Kz8ondNj5qzApEDAFuiGQfs4WbroNRRVQ4dXjdENemiS5jCRaFnB',
  }

  const btc = new Btc()
  const wallet2 = btc.wif_import(wallet1.wif)

  expect(wallet2.address).toBe(wallet1.address)
  expect(wallet2.wif).toBe(wallet1.wif)
})

it('can spend money', async () => {
  const wallet = {
    address: '1JXEqpCm2iQfSJ3JxwDbCGT2Jxes1j1FK',
    wif: 'KzdwB4VSxc6oAVtcQAFo98PjGYHsJ5grBacMResmP5oo6sg3q3xF',
  }
  const btc = new Btc()
  btc.create_transaction(wallet.address)
})

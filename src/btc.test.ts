import { Btc } from './btc'
import { N_network, N_wallet_source } from './type'

jest.setTimeout(15000)

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

it('should generate random wallet', async () => {
  const btc = new Btc()

  const wallet = btc.create_account(N_wallet_source.random)
  expect(wallet.address.length).toBeTruthy()
  expect(wallet.wif.length).toBeTruthy()

})

it('should generate multiple wallets', async () => {
  const btc = new Btc()

  const walletS = btc.create_accountS(10)
  expect(walletS.length).toBe(10)
  expect(walletS[0]?.id).toBeTruthy()
})

it('can get address info', async done => {
  const btc = new Btc(N_network.test)

  const r = await btc.get_account('mswaTiadP1ZeNWgRaMwkYK1AGqhr5YVdSk')
  console.log(r)
  expect(r.tx_count).toBeTruthy()
  expect(r.ios.length).toBeTruthy()
  done()
})

it('can get utxo', async (done) => {
  const btc = new Btc(N_network.test)

  // const account = await btc.get_utxoS('1HNBnHmJnBnGZrFGGzTq53DqYsr11RWKnn')
  const account = await btc.get_utxoS('mswaTiadP1ZeNWgRaMwkYK1AGqhr5YVdSk')
  console.log(account)
  done()
})

/**
 * ONE-TIME test
 */
it('can make tx', async (done) => {
  const btc = new Btc(N_network.test)

  btc.create_transaction({
    from: { wif: '91dNbAv2TsP7fiMMuQzKgqFVVFRLyNSzjKXk9mXjHwMzbDZjqtG' },
    to: { address: 'mkRpD5mbp6cSXouU5Rk3oJPEbyyA8UBjZh' },
    value: 10,
  }).then(r => {
    done()
  })
})

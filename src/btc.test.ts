import { btc } from './btc'
import { N_wallet_source } from './type'

jest.setTimeout(15000)

it('should be able to import wallet', async () => {
  const wallet1 = {
    address: '1PM8UPHT6iPkvyXqER7HuybnUKREfYHbWE',
    wif: 'Kz8ondNj5qzApEDAFuiGQfs4WbroNRRVQ4dXjdENemiS5jCRaFnB',
  }

  const wallet2 = btc.wif_import(wallet1.wif)

  expect(wallet2.address).toBe(wallet1.address)
  expect(wallet2.wif).toBe(wallet1.wif)
})

it('should generate random wallet', async () => {
  const wallet = btc.create_account(N_wallet_source.random)
  expect(wallet.address.length).toBeTruthy()
  expect(wallet.wif.length).toBeTruthy()

})

it('should generate multiple wallets', async () => {
  const walletS = btc.create_accountS(10)
  expect(walletS.length).toBe(10)
  expect(walletS[0]?.id).toBeTruthy()
})

it('can spend money', async () => {
  const wallet = {
    address: '1JXEqpCm2iQfSJ3JxwDbCGT2Jxes1j1FK',
    wif: 'KzdwB4VSxc6oAVtcQAFo98PjGYHsJ5grBacMResmP5oo6sg3q3xF',
  }
})

it('can get address info', async () => {
  const r = await btc.get_account('1HNBnHmJnBnGZrFGGzTq53DqYsr11RWKnn')
  console.log(r)
})

it('can get utxo', async (done) => {
  btc.get_utxoS('1HNBnHmJnBnGZrFGGzTq53DqYsr11RWKnn')
    .then(r => {
      console.log(r)
      done()
    })
})

it('can make tx', async (done) => {
  btc.create_transaction({
    from: { wif: 'L1UA6345MHsP5sat5hCu8WhsQbAd5oQy8iZCEoW6DweaMAz7qEou' },
    to: { address: '1EMmeU3fPTF9jzT4J3231yEBje3D6qCqMs' },
  }).then(r => {
    done()
  })
})

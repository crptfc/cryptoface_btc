import { Account } from '../../model/account'
import { Block } from '../../model/block'
import { Io } from '../../model/io'
import { IO } from '../../type'

export function adapter_block_blockcypher(raw): Block {
  throw new Error('adapter_block_blockcypher() has not been implemented!')
  return <Block>{}
}

export function adapter_tx_blockcypher(raw: T_io_blockcypher): Io {
  const ins = new Io()
  ins.tx = raw.tx_hash
  ins.value = raw.value
  ins.index_io = raw.spent ? raw.tx_input_n : raw.tx_output_n
  ins.as = raw.spent ? IO.input : IO.output
  return ins
}

export function adapter_account_blockcypher(raw: T_account_blockcypher): Account {
  const ins = new Account()
  ins.address = raw.address
  ins.total_sent = raw.total_sent
  ins.total_received = raw.total_received
  ins.balance_final = raw.final_balance
  ins.balance_unconfirmed = raw.unconfirmed_balance
  ins.tx_count = raw.n_tx
  ins.ios = raw.txrefs?.map(adapter_tx_blockcypher)

  return <Account>ins
}

export interface T_account_blockcypher {
  address: string
  total_received: number
  total_sent: number
  balance: number
  unconfirmed_balance: number
  final_balance: number
  n_tx: number
  unconfirmed_n_tx: number
  final_n_tx: number
  tx_url: string
  txrefs: T_io_blockcypher[]
}

export interface T_io_blockcypher {
  tx_hash: string,
  block_height: number,
  tx_input_n: number,
  tx_output_n: number,
  value: number,
  ref_balance: number,
  spent: false,
  confirmations: number,
  confirmed: string,
  double_spend: boolean
}

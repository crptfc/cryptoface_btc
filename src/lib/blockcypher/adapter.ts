import { Account } from '../../model/account'
import { Block } from '../../model/block'
import { Io } from '../../model/io'
import { IO } from '../../type'

export function adapter_block_blockcypher(raw): Block {
  throw new Error('adapter_block_blockcypher() has not been implemented!')
  return <Block>{}
}

export function adapter_io_blockcypher(raw: T_io_blockcypher): Io {
  const ins = new Io()
  ins.tx_hash = raw.tx_hash
  ins.value = raw.value
  ins.index_io = raw.spent ? raw.tx_output_n : raw.tx_input_n
  ins.as = raw.spent ? IO.output : IO.input
  ins.confirmations = raw.confirmations
  ins.address = raw.address
  ins.script = raw.script
  return ins
}

export function adapter_account_blockcypher(raw: T_account_blockcypher): Account {
  console.log(raw)
  const ins = new Account()
  ins.address = raw.address
  ins.total_sent = raw.total_sent
  ins.total_received = raw.total_received
  ins.balance_final = raw.final_balance
  ins.balance_unconfirmed = raw.unconfirmed_balance
  ins.tx_count = raw.n_tx
  ins.ios = raw.txrefs?.map(adapter_io_blockcypher)

  return <Account>ins
}

// ================================================================
// Source: https://www.blockcypher.com/dev/bitcoin/#objects
// ================================================================

/**
 * A Block represents the current state of a particular block from a Blockchain.
 * Typically returned from the Block Hash and Block Height endpoints.
 */
export interface T_block_blockcypher {
  hash?: string //	The hash of the block; in Bitcoin, the hashing function is SHA256(SHA256(block))
  height?: number //	The height of the block in the blockchain; i.e., there are height earlier blocks in its blockchain.
  depth?: number //	The depth of the block in the blockchain; i.e., there are depth later blocks in its blockchain.
  chain?: string //	The name of the blockchain represented, in the form of $COIN.$CHAIN
  total?: number //	The total number of satoshis transacted in this block.
  fees?: number //	The total number of fees---in satoshis---collected by miners in this block.
  size?: number //	Optional Raw size of block (including header and all transactions) in bytes. Not returned for bitcoin blocks earlier than height 389104.
  ver?: number //	Block version.
  time?: string //	Recorded time at which block was built. Note: Miners rarely post accurate clock times.
  received_time?: string //	The time BlockCypher's servers receive the block. Our servers' clock is continuously adjusted and accurate.
  relayed_by?: string //	Address of the peer that sent BlockCypher's servers this block.
  bits?: number //	The block-encoded difficulty target.
  nonce?: number //	The number used by a miner to generate this block.
  n_tx?: number //	Number of transactions in this block.
  prev_block?: string //	The hash of the previous block in the blockchain.
  prev_block_url?: string//	The BlockCypher URL to query for more information on the previous block.
  tx_url?: string //	The base BlockCypher URL to receive transaction details. To get more details about specific transactions, you must concatenate this URL with the desired transaction hash(es).
  mrkl_root?: string //	The Merkle root of this block.
  txids?: string[] //	An array of transaction hashes in this block. By default, only 20 are included.
  next_txids?: string//	Optional If there are more transactions that couldn't fit in the txids array, this is the BlockCypher URL to query the next set of transactions (within a Block object).
}

/**
 * A TX represents the current state of a particular transaction from
 * either a Block within a Blockchain, or an unconfirmed transaction
 * that has yet to be included in a Block. Typically returned from the
 * Unconfirmed Transactions and Transaction Hash endpoints.
 */
export interface T_tx_blockcypher {
  block_height?: number //	Height of the block that contains this transaction. If this is an unconfirmed transaction, it will equal -1.
  hash?: string //	The hash of the transaction. While reasonably unique, using hashes as identifiers may be unsafe.
  addresses?: string[] //	Array of bitcoin public addresses involved in the transaction.
  total?: number //	The total number of satoshis exchanged in this transaction.
  fees?: number //	The total number of fees---in satoshis---collected by miners in this transaction.
  size?: number //	The size of the transaction in bytes.
  preference?: string //	The likelihood that this transaction will make it to the next block; reflects the preference level miners have to include this transaction. Can be high, medium or low.
  relayed_by?: string //	Address of the peer that sent BlockCypher's servers this transaction.
  received?: string//	Time this transaction was received by BlockCypher's servers.
  ver?: number //	Version number, typically 1 for Bitcoin transactions.
  lock_time?: number //	Time when transaction can be valid. Can be interpreted in two ways: if less than 500 million, refers to block height. If more, refers to Unix epoch time.
  double_spend?: boolean //	true if this is an attempted double spend; false otherwise.
  vin_sz?: number //	Total number of inputs in the transaction.
  vout_sz?: number //	Total number of outputs in the transaction.
  confirmations?: number //	Number of subsequent blocks, including the block the transaction is in. Unconfirmed transactions have 0 confirmations.
  inputs?: T_input_blockcypher[]	//TXInput Array, limited to 20 by default.
  outputs?: T_input_blockcypher[] //	TXOutput Array, limited to 20 by default.
  opt_in_rbf?: boolean //	Optional Returns true if this transaction has opted in to Replace-By-Fee (RBF), either true or not present. You can read more about Opt-In RBF here.
  confidence?: number//	Optional The percentage chance this transaction will not be double-spent against, if unconfirmed. For more information, check the section on Confidence Factor.
  confirmed?: string//	Optional Time at which transaction was included in a block; only present for confirmed transactions.
  receive_count?: number //	Optional Number of peers that have sent this transaction to BlockCypher; only present for unconfirmed transactions.
  change_address?: string //	Optional Address BlockCypher will use to send back your change, if you constructed this transaction. If not set, defaults to the address from which the coins were originally sent.
  block_hash?: string //	Optional Hash of the block that contains this transaction; only present for confirmed transactions.
  block_index?: number //	Optional Canonical, zero-indexed location of this transaction in a block; only present for confirmed transactions.
  double_of?: string //	Optional If this transaction is a double-spend (i.e. double_spend == true) then this is the hash of the transaction it's double-spending.
  data_protocol?: string //	Optional Returned if this transaction contains an OP_RETURN associated with a known data protocol. Data protocols currently detected: blockchainid ; openassets ; factom ; colu ; coinspark ; omni
  hex?: string //	Optional Hex-encoded bytes of the transaction, as sent over the network.
  next_inputs?: string //	Optional If there are more transaction inptus that couldn't fit into the TXInput array, this is the BlockCypher URL to query the next set of TXInputs (within a TX object).
  next_outputs?: string //	Optional If there are more transaction outputs that couldn't fit into the TXOutput array, this is the BlockCypher URL to query the next set of TXOutputs(within a TX object).
}

/**
 * A TXInput represents an input consumed within a transaction.
 * Typically found within an array in a TX. In most cases,
 * TXInputs are from previous UTXOs, with the most prominent
 * exceptions being attempted double-spend and coinbase inputs.
 */
export interface T_input_blockcypher {
  prev_hash?: string //	The previous transaction hash where this input was an output. Not present for coinbase transactions.
  output_index?: number //	The index of the output being spent within the previous transaction. Not present for coinbase transactions.
  output_value?: number //	The value of the output being spent within the previous transaction. Not present for coinbase transactions.
  script_type?: string //	The type of script that encumbers the output corresponding to this input.
  script?: string //	Raw hexadecimal encoding of the script.
  addresses?: string[] //	An array of public addresses associated with the output of the previous transaction.
  sequence?: number //	Legacy 4-byte sequence number, not usually relevant unless dealing with locktime encumbrances.
  age?: number //	Optional Number of confirmations of the previous transaction for which this input was an output. Currently, only returned in unconfirmed transactions.
  wallet_name?: string //	Optional Name of Wallet or HDWallet from which to derive inputs. Only used when constructing transactions via the Creating Transactions process.
  wallet_token?: string //	Optional Token associated with Wallet or HDWallet used to derive inputs. Only used when constructing transactions via the Creating Transactions process.
}

/**
 * A TXOutput represents an output created by a transaction.
 * Typically found within an array in a TX.
 */
export interface T_output_blockcypher {
  value?: number //	Value in this transaction output, in satoshis.
  script?: string //	Raw hexadecimal encoding of the encumbrance script for this output.
  addresses?: string[] //	Addresses that correspond to this output; typically this will only have a single address, and you can think of this output as having "sent" value to the address contained herein.
  script_type?: string //	The type of encumbrance script used for this output.
  spent_by?: string //	Optional The transaction hash that spent this output. Only returned for outputs that have been spent. The spending transaction may be unconfirmed.
  data_hex?: string //	Optional A hex-encoded representation of an OP_RETURN data output, without any other script instructions. Only returned for outputs whose script_type is null-data.
  data_string?: string //	Optional An ASCII representation of an OP_RETURN data output, without any other script instructions. Only returned for outputs whose script_type is null-data and if its data falls into the visible ASCII range.
}

/**
 * An Address represents a public address on a blockchain,
 * and contains information about the state of balances and
 * transactions related to this address. Typically returned
 * from the Address Balance, Address, and Address Full Endpoint.
 */
export interface T_account_blockcypher {
  address?: string // Optional The requested address. Not returned if querying a wallet/HD wallet.
  wallet?: any // Wallet Optional The requested wallet object. Only returned if querying by wallet name instead of public address.
  hd_wallet?: any // HDWallet Optional The requested HD wallet object. Only returned if querying by HD wallet name instead of public address.
  total_received?: number // Total amount of confirmed satoshis received by this address.
  total_sent?: number // Total amount of confirmed satoshis sent by this address.
  balance?: number // Balance of confirmed satoshis on this address. This is the difference between outputs and inputs on this address, but only for transactions that have been included into a block (i.e., for transactions whose confirmations > 0).
  unconfirmed_balance?: number // Balance of unconfirmed satoshis on this address. Can be negative (if unconfirmed transactions are just spending outputs). Only unconfirmed transactions (haven't made it into a block) are included.
  final_balance?: number // Total balance of satoshis, including confirmed and unconfirmed transactions, for this address.
  n_tx?: number // Number of confirmed transactions on this address. Only transactions that have made it into a block (confirmations > 0) are counted.
  unconfirmed_n_tx?: number // Number of unconfirmed transactions for this address. Only unconfirmed transactions (confirmations == 0) are counted.
  final_n_tx?: number // Final number of transactions, including confirmed and unconfirmed transactions, for this address.
  tx_url?: string // Optional To retrieve base URL transactions. To get the full URL, concatenate this URL with a transaction's hash.
  txs?: T_tx_blockcypher[] // array[TX] Optional Array of full transaction details associated with this address. Usually only returned from the Address Full Endpoint.
  txrefs?: T_io_blockcypher[] // array[TXRef] Optional Array of transaction inputs and outputs for this address. Usually only returned from the standard Address Endpoint.
  unconfirmed_txrefs?: T_io_blockcypher[] // array[TXRef] Optional All unconfirmed transaction inputs and outputs for this address. Usually only returned from the standard Address Endpoint.
  hasMore?: boolean //	Optional If true, then the Address object contains more transactions than shown. Useful for determining whether to poll the API for more transaction information.
}

/**
 * A TXRef object represents summarized data about a
 * transaction input or output. Typically found in an
 * array within an Address object, which is usually
 * returned from the standard Address Endpoint.
 */
export interface T_io_blockcypher {
  address?: string //	Optional The address associated with this transaction input/output. Only returned when querying an address endpoint via a wallet/HD wallet name.
  block_height?: number //	Height of the block that contains this transaction input/output. If it's unconfirmed, this will equal -1.
  tx_hash?: string //	The hash of the transaction containing this input/output. While reasonably unique, using hashes as identifiers may be unsafe.
  tx_input_n?: number //	Index of this input in the enclosing transaction. It's a negative number for an output.
  tx_output_n?: number //	Index of this output in the enclosing transaction. It's a negative number for an input.
  value?: number //	The value transfered by this input/output in satoshis exchanged in the enclosing transaction.
  preference?: string //	The likelihood that the enclosing transaction will make it to the next block; reflects the preference level miners have to include the enclosing transaction. Can be high, medium or low.
  spent?: boolean //	true if this is an output and was spent. If it's an input, or an unspent output, it will be false.
  double_spend?: boolean //	true if this is an attempted double spend; false otherwise.
  confirmations?: number //	Number of subsequent blocks, including the block the transaction is in. Unconfirmed transactions have 0 confirmations.
  script?: string //	Optional Raw, hex-encoded script of this input/output.
  ref_balance?: number //	Optional The past balance of the parent address the moment this transaction was confirmed. Not present for unconfirmed transactions.
  confidence?: number //	Optional The percentage chance this transaction will not be double-spent against, if unconfirmed. For more information, check the section on Confidence Factor.
  confirmed?: string //	Optional Time at which transaction was included in a block; only present for confirmed transactions.
  spent_by?: string //	Optional The transaction hash that spent this output. Only returned for outputs that have been spent. The spending transaction may be unconfirmed.
  received?: string //	Optional Time this transaction was received by BlockCypher's servers; only present for unconfirmed transactions.
  receive_count?: number //	Optional Number of peers that have sent this transaction to BlockCypher; only present for unconfirmed transactions.
  double_of?: string //	Optional If this transaction is a double-spend (i.e. double_spend == true) then this is the hash of the transaction it's double-spending.
}


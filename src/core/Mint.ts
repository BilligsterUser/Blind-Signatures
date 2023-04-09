import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { hashToCurve } from '@noble/curves/secp256k1'
import { resolve } from 'path'
import { config } from '../config'
import {
	IBlindedSignatureParam, IInfo, IMeltReq, IMeltResp,
	IMintTokensResp, IProof,
	IRequestMintResp, ISplitReq, ISplitResp
} from '../model'
import { BlindedMessage } from '../model/BlindedMessage'
import { BlindedSignature } from '../model/BlindedSignature'
import { Keyset } from '../model/Keyset'
import { PrivateKey } from '../model/PrivateKey'
import { h2cToPoint, hexToUint8Arr, pointFromHex, splitAmount, uint8ArrToHex, verifyAmount, verifyNoDuplicateOutputs, verifyOutputs, verifyProofs, verifySecret } from '../utils'
import { decodeInvoice } from '../utils/bolt11'
import { IInvoicer } from './lightning'
import { FakeInvoicer } from './lightning/FakeInvoicer'
import { IStorage } from './storage'
import { FakeStorage } from './storage/FakeStorage'


export class Mint {
	readonly #storage: IStorage
	readonly #privateKey: PrivateKey
	readonly #keyset
	readonly #invoicer: IInvoicer
	constructor(privateKey: PrivateKey, derivationPath = '0/0/0/0', invoicer = FakeInvoicer, storage = FakeStorage) {
		this.#privateKey = privateKey
		this.#keyset = new Keyset(uint8ArrToHex(this.#privateKey.key), derivationPath)
		// eslint-disable-next-line new-cap
		this.#invoicer = new invoicer()
		// eslint-disable-next-line new-cap
		this.#storage = new storage()
	}
	// POST /checkfees
	public checkfees(pr: string): { fee: number } {
		const { msats, paymentHash } = decodeInvoice(pr)
		// check if it's internal
		if (this.#storage.getPayment(paymentHash).amount) {
			// if(!this.#invoicer.isPaid(paymentHash))
			return { fee: 0 }
		}
		return {
			fee: Math.ceil(Math.max(
				config.lightning.reserveFee,
				msats * config.lightning.feePercent / 100
			) / 1000)
		}
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public createBlindSignature({ id = '', amount = 1, B_ }: Omit<IBlindedSignatureParam, 'privateKey'>) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return BlindedSignature.newBlindedSignature({ id, amount, B_, privateKey: this.#keyset.keys[amount] })
	}
	// GET /keys
	public getKeys(): { [k: string]: string } { return this.#keyset.getKeys() }
	// GET /keysets
	public getKeysets() { return { keysets: [this.#keyset.id] } }
	public getPublicKey(amount: number) { return this.#keyset.keys[amount].getPublicKey() }
	// GET /info
	public info() {
		// TODO read from config
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
		const pkg = require(resolve('.') + '/package.json')
		const info: IInfo = {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
			version: `${pkg.name}/${pkg.version}`,
			contact: [],
			description: config.info.description,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			description_long: config.info.descriptionLong,
			motd: config.info.motd,
			name: config.info.name,
			nuts: [],
			pubkey: this.#privateKey.getPublicKey().toHex()
		}
		return info
	}
	public isPaid(paymentHash: string): Promise<boolean> { return this.#invoicer.isPaid(paymentHash) }
	// POST /melt
	public melt({ pr, proofs, outputs }: IMeltReq): IMeltResp {
		if (!proofs.every(p => this.verifyProofBdhk(p))) {
			throw new Error('could not verify proofs.')
		}
		if (!proofs.every(p => this.verifyProofSpendable(p.secret))) {
			throw new Error('tokens already spent.')
		}
		const pAmount = proofs.reduce((r, c) => r + c.amount, 0)
		if (!verifyNoDuplicateOutputs(outputs)) {
			throw new Error('duplicate outputs')
		}
		const { err } = verifyProofs(proofs)
		if (err) { throw err }
		const { fee } = this.checkfees(pr)
		const { msats } = decodeInvoice(pr)
		if (pAmount + fee < msats / 1000) {
			/*return {
				code: 0,
				error: 'provided proofs not enough for Lightning payment.'
			}*/
		}
		this.#storage.setSpend(...proofs.map(x => x.secret))
		// TODO pay invoice
		// TODO handel NUT-8 https://github.com/cashubtc/nuts/blob/main/08.md
		return { paid: true, preimage: 'da225c115418671b64a67d1d9ea6a...' }
	}
	// POST /mint&payment_hash=
	public async mintTokens(paymentHash: string, outputs: BlindedMessage[]): Promise<IMintTokensResp> {
		if (!paymentHash) { throw new Error('no payment_hash provided.') }
		// TODO get hash and amount from db
		const { amount, issued } = this.#storage.getPayment(paymentHash)
		if (!amount) { throw new Error('invoice not found.') }
		if (issued) { throw new Error('tokens already issued for this invoice.') }
		if (!await this.#invoicer.isPaid(paymentHash)) { throw new Error('not Paid') }
		if (outputs.reduce((r, cur) => r + cur.amount, 0) > amount) { throw new Error('too much outputs') }
		this.#storage.updatePayment(paymentHash)
		return {
			promises: outputs
				// eslint-disable-next-line @typescript-eslint/naming-convention
				.map(({ amount, B_ }) =>
					BlindedSignature.newBlindedSignature({
						amount,
						// eslint-disable-next-line @typescript-eslint/naming-convention
						B_,
						privateKey: this.#keyset.keys[amount]
					}).toJSON()
				)
		}
	}
	// GET /mint&?amount=1
	public async requestMint(amount: number): Promise<IRequestMintResp> {
		const data = await this.#invoicer.createInvoice(amount)
		this.#storage.savePayment(amount, data.hash)
		return data
	}
	// POST /split
	public split({ proofs, outputs, amount }: ISplitReq): ISplitResp {
		if (!verifyAmount(amount)) {
			throw new Error(`invalid amount: ${amount}`)
		}
		if (!proofs.every(verifySecret)) {
			throw new Error('invalid secret')
		}
		if (!verifyNoDuplicateOutputs(outputs)) {
			throw new Error('duplicate outputs')
		}
		const total = proofs.reduce((r, c) => r + c.amount, 0)
		if (!verifyOutputs(total, amount, outputs)) {
			throw new Error('split of promises is not as expected.')
		}
		if (total > amount) {
			throw new Error('split amount is higher than the total sum.')
		}
		this.#storage.setSpend(...proofs.map(x => x.secret))

		const outs = splitAmount(total - amount)
		const B_1 = outputs.slice(0, outs.length)
		const B_2 = outputs.slice(outs.length)

		const fst = BlindedSignature.newBlindedSignatures(B_1
			// eslint-disable-next-line @typescript-eslint/naming-convention
			.map(x => ({ ...x, B_: pointFromHex(x.B_), privateKey: this.#keyset.keys[x.amount] }))
		).map(x => x.toJSON())
		const snd = BlindedSignature.newBlindedSignatures(B_2
			// eslint-disable-next-line @typescript-eslint/naming-convention
			.map(x => ({ ...x, B_: pointFromHex(x.B_), privateKey: this.#keyset.keys[x.amount] }))
		).map(x => x.toJSON())
		return { fst, snd }
	}
	public verify(x: Uint8Array, unblinded: ProjPointType<bigint>, amount: number) {
		return hashToCurve(x).multiply(this.#keyset.keys[amount].toBigInt()).equals(unblinded)
	}
	public verifyProofBdhk(proof: IProof) {
		const C = pointFromHex(proof.C)
		const privKey = this.#keyset.keys[proof.amount]
		const Y = h2cToPoint(hashToCurve(hexToUint8Arr(proof.secret)))
		return C.equals(Y.multiply(privKey.toBigInt()))

	}
	public verifyProofSpendable(secret: string) {
		return this.#storage.isSpendable(secret)
	}
}

import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { hashToCurve } from '@noble/curves/secp256k1'
import { IBlindedSignatureParam, IMintTokensResp, IRequestMintResp } from '.'
import { BlindedMessage } from './BlindedMessage'
import { BlindedSignature } from './BlindedSignature'
import { Keyset } from './Keyset'
import { IInvoicer } from './lightning'
import { FakeInvoicer } from './lightning/FakeInvoicer'
import { PrivateKey } from './PrivateKey'
export class Mint {
	get privateKey() { return this.#privateKey }
	readonly #privateKey: PrivateKey
	readonly #keyset
	readonly #invoicer: IInvoicer
	constructor(privateKey: PrivateKey, derivationPath = '0/0/0/0', invoicer = FakeInvoicer) {
		this.#privateKey = privateKey
		this.#keyset = new Keyset(this.#privateKey.getPrivateKey().toString(), derivationPath)
		// eslint-disable-next-line new-cap
		this.#invoicer = new invoicer()
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public createBlindSignature({ id = '', amount = 0, B_ }: Omit<IBlindedSignatureParam, 'privateKey'>) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return BlindedSignature.newBlindedSignature({ id, amount, B_, privateKey: this.#privateKey })
	}
	// GET /keys
	public getKeys() { return this.#keyset.getKeys() }
	// GET /keysets
	public getKeysets() { return { keysets: [this.#keyset.id] } }
	public isPaid(paymentHash: string): boolean { return this.#invoicer.isPaid(paymentHash) }
	// POST /mint&payment_hash=
	public mintTokens(_amount: number, _paymentHash: string, outputs: BlindedMessage[]): IMintTokensResp  {
		// TODO get hash and amount from db
		// TODO handel errors
		// if (!this.#invoicer.isPaid(paymentHash)) { return { error: 'not Paid' } }
		// if (outputs.reduce((r, cur) => r + cur.amount, 0) > amount) { return { error: 'too much outputs' } }
		return {
			promises: outputs
				.map(x =>
					BlindedSignature.newBlindedSignature({
						amount: x.amount,
						// eslint-disable-next-line @typescript-eslint/naming-convention
						B_: x.B_,
						privateKey: this.#keyset.keys[x.amount]
					}).toJSON()
				)
		}
	}
	// GET /mint&?amount=1
	public requestMint(amount: number): IRequestMintResp {
		// TODO save hash and amount
		return this.#invoicer.createInvoice(amount)
	}
	public verify(r: PrivateKey, unblinded: ProjPointType<bigint>) {
		return hashToCurve(r.getPrivateKey()).multiply(this.#privateKey.toBigInt()).equals(unblinded)
	}
}

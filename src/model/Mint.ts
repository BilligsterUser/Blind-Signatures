import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { hashToCurve } from '@noble/curves/secp256k1'
import { resolve } from 'path'
import { IBlindedSignatureParam, IInfo, IMintTokensResp, IRequestMintResp } from '.'
import { uint8ArrToHex } from '../utils'
import { decodeInvoice } from '../utils/bolt11'
import { BlindedMessage } from './BlindedMessage'
import { BlindedSignature } from './BlindedSignature'
import { Keyset } from './Keyset'
import { IInvoicer } from './lightning'
import { FakeInvoicer } from './lightning/FakeInvoicer'
import { PrivateKey } from './PrivateKey'
import { IStorage } from './storage'
import { FakeStorage } from './storage/FakeStorage'


export class Mint {
	get privateKey() { return this.#privateKey }
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
	// GET /checkfees
	public checkfees(pr: string) {
		const { msats, paymentHash } = decodeInvoice(pr)
		// check if it's internal
		if (this.#storage.getPayment(paymentHash) !== undefined) {
			// if(!this.#invoicer.isPaid(paymentHash))
			return 0
		}
		// TODO load LightningReserveFeeMin & LightningFeePercent from config
		// math.Max(Config.Lightning.Lnbits.LightningReserveFeeMin, float64(amountMsat) * Config.Lightning.Lnbits.LightningFeePercent / 1000))
		return Math.ceil(Math.max(4000, msats * 1.0 / 100) / 1000)
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public createBlindSignature({ id = '', amount = 0, B_ }: Omit<IBlindedSignatureParam, 'privateKey'>) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return BlindedSignature.newBlindedSignature({ id, amount, B_, privateKey: this.#privateKey })
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
			description: '',
			// eslint-disable-next-line @typescript-eslint/naming-convention
			description_long: '',
			motd: '',
			name: 'Typescript Cashu mint',
			nuts: [],
			pubkey: this.#privateKey.getPublicKey().toHex()
		}
		return info
	}
	public isPaid(paymentHash: string): boolean { return this.#invoicer.isPaid(paymentHash) }
	// POST /mint&payment_hash=
	public mintTokens(_paymentHash: string, outputs: BlindedMessage[]): IMintTokensResp {
		// TODO get hash and amount from db
		// const amount = this.#storage.getPayment(paymentHash) || 0
		// TODO handel errors
		// if (!this.#invoicer.isPaid(paymentHash)) { return { error: 'not Paid' } }
		// if (outputs.reduce((r, cur) => r + cur.amount, 0) > amount) { return { error: 'too much outputs' } }
		// TODO mark payment as used
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
	public requestMint(amount: number): IRequestMintResp {
		const data = this.#invoicer.createInvoice(amount)
		this.#storage.savePayment(amount, data.hash)
		return data
	}
	public verify(r: PrivateKey, unblinded: ProjPointType<bigint>) {
		return hashToCurve(r.key).multiply(this.#privateKey.toBigInt()).equals(unblinded)
	}
}

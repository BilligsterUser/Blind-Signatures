
import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { hashToCurve, secp256k1 } from '@noble/curves/secp256k1'
import { randomBytes } from 'crypto'
import { IBlindedMessageParam, ISerializedBlindedMessage } from '.'
import { h2cToPoint, splitAmount } from '../utils'
import { PrivateKey } from './PrivateKey'


export class BlindedMessage {
	public static newBlindedMessages(amount: number): BlindedMessage[] {
		return splitAmount(amount)
			.map(x => BlindedMessage.newBlindedMessage({ amount: x }))
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static newBlindedMessage({ amount = 1, secret }: IBlindedMessageParam = {}): BlindedMessage {
		if (!secret) {
			secret = randomBytes(32)
		} else if (typeof secret === 'string') {
			secret = new TextEncoder().encode(secret)
		}
		const Y = secp256k1.ProjectivePoint.fromAffine(hashToCurve(secret).toAffine())
		const r = new PrivateKey()
		const T = Y.add(secp256k1.ProjectivePoint.BASE.multiply(r.toBigInt())) // blindedMessage
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return new BlindedMessage({ secret, r, amount, B_: T })
	}
	#amount: number
	// eslint-disable-next-line @typescript-eslint/naming-convention
	#B_: ProjPointType<bigint>
	#r: PrivateKey
	#secret: Uint8Array
	get secret() { return this.#secret }
	get r() { return this.#r }
	// eslint-disable-next-line @typescript-eslint/naming-convention
	get B_() { return this.#B_ }
	get amount() { return this.#amount }
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private constructor({ amount, B_, r, secret }: Required<IBlindedMessageParam>) {
		this.#amount = amount
		this.#B_ = B_
		this.#r = r
		if (typeof secret === 'string') { secret = new TextEncoder().encode(secret) }
		this.#secret = secret
	}
	public blind() {
		const Y = h2cToPoint(hashToCurve(this.#secret))
		const r = this.#r
		const T = Y.add(secp256k1.ProjectivePoint.BASE.multiply(r.toBigInt())) // blindedMessage
		return T
	}
	public toJSON(): ISerializedBlindedMessage {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const B_ = this.blind()
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { amount: this.#amount, B_: B_.toHex(true) }
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public unblind(C: ProjPointType<bigint>, pubKey: ProjPointType<bigint>) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { C: C.subtract(pubKey.multiply(this.#r.toBigInt())), secret: this.#secret }
	}
}

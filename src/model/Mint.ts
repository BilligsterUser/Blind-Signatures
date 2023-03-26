import { H2CPoint } from '@noble/curves/abstract/hash-to-curve'
import { hashToCurve } from '@noble/curves/secp256k1'
import { PrivateKey } from './PrivateKey'


export class Mint {
	readonly #privateKey: PrivateKey
	constructor(privateKey: PrivateKey) {
		this.#privateKey = privateKey
	}
	public createBlindSignature(B_: H2CPoint<bigint>): H2CPoint<bigint> {
		return B_.multiply(this.#privateKey.toBigInt())
	}
	public verify(r: PrivateKey, unblinded: H2CPoint<bigint>) {
		return hashToCurve(r.getPrivateKey()).multiply(this.#privateKey.toBigInt()).equals(unblinded)
	}
	get privateKey() { return this.#privateKey }
}

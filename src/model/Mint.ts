import { H2CPoint } from '@noble/curves/abstract/hash-to-curve'
import { hashToCurve } from '@noble/curves/secp256k1'
import { Keyset } from './Keyset'
import { PrivateKey } from './PrivateKey'


export class Mint {
	readonly #privateKey: PrivateKey
	readonly #keyset
	constructor(privateKey: PrivateKey, derivationPath = '0/0/0/0') {
		this.#privateKey = privateKey
		this.#keyset = new Keyset(this.#privateKey.getPrivateKey().toString(), derivationPath)
	}
	public createBlindSignature(B_: H2CPoint<bigint>): H2CPoint<bigint> {
		return B_.multiply(this.#privateKey.toBigInt())
	}
	public verify(r: PrivateKey, unblinded: H2CPoint<bigint>) {
		return hashToCurve(r.getPrivateKey()).multiply(this.#privateKey.toBigInt()).equals(unblinded)
	}
	get privateKey() { return this.#privateKey }
}

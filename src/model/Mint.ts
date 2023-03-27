import { ProjPointType } from '@noble/curves/abstract/weierstrass'
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
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public createBlindSignature(B_: ProjPointType<bigint>): ProjPointType<bigint> {
		return B_.multiply(this.#privateKey.toBigInt())
	}
	public verify(r: PrivateKey, unblinded: ProjPointType<bigint>) {
		return hashToCurve(r.getPrivateKey()).multiply(this.#privateKey.toBigInt()).equals(unblinded)
	}
	get privateKey() { return this.#privateKey }
}

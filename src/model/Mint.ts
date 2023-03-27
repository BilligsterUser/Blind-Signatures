import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { hashToCurve } from '@noble/curves/secp256k1'
import { IBlindedSignatureParam } from '.'
import { BlindedSignature } from './BlindedSignature'
import { Keyset } from './Keyset'
import { PrivateKey } from './PrivateKey'
export class Mint {
	get privateKey() { return this.#privateKey }
	readonly #privateKey: PrivateKey
	readonly #keyset
	constructor(privateKey: PrivateKey, derivationPath = '0/0/0/0') {
		this.#privateKey = privateKey
		this.#keyset = new Keyset(this.#privateKey.getPrivateKey().toString(), derivationPath)
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public createBlindSignature({ id = '', amount = 0, B_ }: Omit<IBlindedSignatureParam, 'privateKey'>) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return BlindedSignature.newBlindedSignature({id, amount, B_, privateKey: this.#privateKey})
	}
	// GET /keys
	public getKeys() { return this.#keyset.getKeys() }
	// GET /keysets
	public getKeysets() { return { keysets: [this.#keyset.id] } }
	public verify(r: PrivateKey, unblinded: ProjPointType<bigint>) {
		return hashToCurve(r.getPrivateKey()).multiply(this.#privateKey.toBigInt()).equals(unblinded)
	}
}

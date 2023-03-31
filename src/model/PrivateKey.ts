import { numberToBytesBE } from '@noble/curves/abstract/utils'
import { secp256k1 } from '@noble/curves/secp256k1'
import { byteArrToBigInt } from '../utils'


export class PrivateKey {
	#privateKey
	get key() { return this.#privateKey }
	constructor(hash?: string | Uint8Array) {
		if (!hash) {
			this.#privateKey = secp256k1.utils.randomPrivateKey()
		} else {
			this.#privateKey = this.#hashToPrivKey(hash)
		}
	}
	#hashToPrivKey(hash: string | Uint8Array): Uint8Array {
		const num = secp256k1.utils.normPrivateKeyToScalar(hash)
		return numberToBytesBE(num, 32)
	}
	public getPublicKey() {
		return secp256k1.ProjectivePoint.BASE.multiply(this.toBigInt())
	}
	public toBigInt() { return byteArrToBigInt(this.#privateKey) }
}



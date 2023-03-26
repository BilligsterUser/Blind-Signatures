import { secp256k1 } from '@noble/curves/secp256k1'
import { byteArrToBigInt } from '../utils'


export class PrivateKey {
	#privateKey = secp256k1.utils.randomPrivateKey()
	getPrivateKey() { return this.#privateKey }
	public getPublicKey() {
		return secp256k1.ProjectivePoint.BASE.multiply(this.toBigInt())
	}
	public toBigInt() { return byteArrToBigInt(this.#privateKey) }
}

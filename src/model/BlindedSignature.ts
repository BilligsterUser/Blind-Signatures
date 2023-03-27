import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { ISerializedBlindedSignature } from '.'
import { PrivateKey } from './PrivateKey'

export class BlindedSignature {
	#amount: number
	// eslint-disable-next-line @typescript-eslint/naming-convention
	#C_: ProjPointType<bigint>
	#id: string

	// eslint-disable-next-line @typescript-eslint/naming-convention
	get C_(){return this.#C_}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static newBlindedSignature(id: string, amount: number, B_: ProjPointType<bigint>, privateKey: PrivateKey) {
		return new BlindedSignature(id, amount, B_.multiply(privateKey.toBigInt()))
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private constructor(id: string, amount: number, C_: ProjPointType<bigint>) {
		this.#id = id
		this.#amount = amount
		this.#C_ = C_
	}
	public serialize(): ISerializedBlindedSignature{
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { id: this.#id, amount: this.#amount, C_: this.#C_.toHex(true) }
	}
}

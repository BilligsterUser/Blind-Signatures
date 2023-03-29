import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { IBlindedSignatureParam, ISerializedBlindedSignature } from '.'

export class BlindedSignature {
	#amount: number
	// eslint-disable-next-line @typescript-eslint/naming-convention
	#C_: ProjPointType<bigint>
	#id: string

	// eslint-disable-next-line @typescript-eslint/naming-convention
	get C_() { return this.#C_ }
	get amount(){return this.#amount}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static newBlindedSignature({ id = '', amount = 0, B_, privateKey }: IBlindedSignatureParam) {
		return new BlindedSignature(id, amount, B_.multiply(privateKey.toBigInt()))
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	private constructor(id: string, amount: number, C_: ProjPointType<bigint>) {
		this.#id = id
		this.#amount = amount
		this.#C_ = C_
	}
	public toJSON(): ISerializedBlindedSignature {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { id: this.#id, amount: this.#amount, C_: this.#C_.toHex(true) }
	}
}

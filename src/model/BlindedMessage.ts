
import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { hashToCurve, secp256k1 } from '@noble/curves/secp256k1'
import { randomBytes } from 'crypto'
import { PrivateKey } from './PrivateKey'


export class BlindedMessage {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static newBlindedMessage(amount: number, secret: Uint8Array): { B_: ProjPointType<bigint>; blindedMessage: BlindedMessage; }
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static newBlindedMessage(amount: number, secret: string): { B_: ProjPointType<bigint>; blindedMessage: BlindedMessage; }
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public static newBlindedMessage(amount: number, secret?: string | Uint8Array): { B_: ProjPointType<bigint>; blindedMessage: BlindedMessage; } {
		if (!secret) {
			secret = randomBytes(10)
		} else if (typeof secret === 'string') {
			secret = new TextEncoder().encode(secret)
		}
		const Y = secp256k1.ProjectivePoint.fromAffine(hashToCurve(secret).toAffine())
		const r = new PrivateKey()
		const T = Y.add(secp256k1.ProjectivePoint.BASE.multiply(r.toBigInt())) // blindedMessage
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { B_: T, blindedMessage: new BlindedMessage(secret, r, amount) }
	}
	get r() { return this._r }
	constructor(private _secret: Uint8Array, private _r: PrivateKey, private _amount: number) { }
	public blind() {
		const Y = secp256k1.ProjectivePoint.fromAffine(hashToCurve(this._secret).toAffine())
		const r = new PrivateKey()
		const T = Y.add(secp256k1.ProjectivePoint.BASE.multiply(r.toBigInt())) // blindedMessage
		return T
	}
	public serialize() {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const B_ = this.blind()
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { amount: this._amount, B_ }
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	public unblind(C: ProjPointType<bigint>, pubKey: ProjPointType<bigint>) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { C: C.subtract(pubKey.multiply(this._r.toBigInt())), secret: this._secret }
	}
}

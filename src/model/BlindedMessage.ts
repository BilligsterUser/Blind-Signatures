import { H2CPoint } from '@noble/curves/abstract/hash-to-curve'
import { hashToCurve, secp256k1 } from '@noble/curves/secp256k1'
import { randomBytes } from 'crypto'
import { PrivateKey } from './PrivateKey'


export class BlindedMessage {
	get r(){return this._r}
	constructor(private _secret: Uint8Array, private _r: PrivateKey) { }
	public static newBlindedMessage(secret: Uint8Array): { B_: H2CPoint<bigint>; blindedMessage: BlindedMessage; }
	public static newBlindedMessage(secret: string): { B_: H2CPoint<bigint>; blindedMessage: BlindedMessage; }
	public static newBlindedMessage(secret?: string | Uint8Array): { B_: H2CPoint<bigint>; blindedMessage: BlindedMessage; } {
		if (!secret) {
			secret = randomBytes(10)
		} else if (typeof secret === 'string') {
			secret = new TextEncoder().encode(secret)
		}
		const Y = hashToCurve(secret)
		const r = new PrivateKey()
		const T = Y.add(secp256k1.ProjectivePoint.BASE.multiply(r.toBigInt())) // blindedMessage
		return { B_: T, blindedMessage: new BlindedMessage(secret, r) }
	}
	public unblind(C: H2CPoint<bigint>, pubKey: H2CPoint<bigint>) {
		return { C: C.subtract(pubKey.multiply(this._r.toBigInt())), secret: this._secret }
	}
}

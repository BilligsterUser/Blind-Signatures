import { hashToCurve, secp256k1 } from '@noble/curves/secp256k1'
import { randomBytes } from 'crypto'
import { PrivateKey } from '../src/index.js'

test('test crypto simple', () => {
	// mint
	const k = new PrivateKey()
	const K = k.getPublicKey()

	// alice
	const x = randomBytes(10)
	const Y = hashToCurve(x)
	const r = new PrivateKey()
	const T = Y.add(secp256k1.ProjectivePoint.BASE.multiply(r.toBigInt()))  // blindedMessage

	// mint
	const Q = T.multiply(k.toBigInt()) // BlindedSignature

	// alice
	const Z = Q.subtract(K.multiply(r.toBigInt())) // unblinded

	// mint proof
	expect(hashToCurve(x).multiply(k.toBigInt()).equals(Z)).toBe(true)
})
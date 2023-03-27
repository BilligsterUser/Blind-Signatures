import { hashToCurve, secp256k1 } from '@noble/curves/secp256k1'
import { randomBytes } from 'crypto'
import { BlindedMessage, Mint, PrivateKey } from '../src/index.js'

test('test crypto', () => {
	// mint
	const mint = new Mint(new PrivateKey())

	// alice
	const bm = BlindedMessage.newBlindedMessage({secret:randomBytes(10)})  // blindedMessage
	// mint
	const bs = mint.createBlindSignature({B_:bm.B_})// BlindedSignature

	// alice
	const ub = bm.unblind(bs.C_, mint.privateKey.getPublicKey()) // unblinded

	// mint proof
	expect(mint.verify(bm.r, ub.C))
})

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
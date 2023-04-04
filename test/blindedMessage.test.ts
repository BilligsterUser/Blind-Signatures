import { randomBytes } from 'crypto'
import { BlindedMessage, Mint, PrivateKey } from '../src'
import { IProof } from '../src/model'
import { uint8ArrToHex } from '../src/utils'


describe('test crypto bdhke', () => {
	test('test BlindedMessage random Bytes', () => {
		// mint
		const mint = new Mint(new PrivateKey())

		// alice
		const bm = BlindedMessage.newBlindedMessage({ secret: randomBytes(10) })  // blindedMessage
		// mint
		const bs = mint.createBlindSignature({ B_: bm.B_ })// BlindedSignature

		// alice
		const ub = bm.unblind(bs.C_, mint.privateKey.getPublicKey()) // unblinded

		// mint proof
		expect(mint.verify(bm.secret, ub.C, bm.amount))
	})
	test('test BlindedMessage from string', async () => {
		// mint
		const mint = new Mint(new PrivateKey())
		// alice
		const bm = BlindedMessage.newBlindedMessage({ secret: 'xxxx' })
		// mint
		const bs = mint.createBlindSignature({ B_: bm.B_ })
		// alice
		const { C } = bm.unblind(bs.C_, mint.getPublicKey(bm.amount))

		expect(mint.verify(bm.secret, C, bm.amount)).toBe(true)
	})
	test('test crypto', () => {
		// mint
		const mint = new Mint(new PrivateKey())
		// alice
		const bm = BlindedMessage.newBlindedMessage({ amount: 1 })  // blindedMessage
		const B_ = bm.blind()

		expect(B_.toHex(true)).toBe(bm.B_.toHex(true))
		expect(bm.toJSON()).toStrictEqual({ amount: 1, B_: B_.toHex(true) })

		// mint
		const bs = mint.createBlindSignature({ B_ })// BlindedSignature
		// alice
		const ub = bm.unblind(bs.C_, mint.getPublicKey(bm.amount)) // unblinded
		// mint proof
		expect(mint.verify(bm.secret, ub.C, bm.amount)).toBe(true)
	})
	test('test toJSON', () => {
		const bm = BlindedMessage.newBlindedMessage({ amount: 1 })  // blindedMessage
		const str = JSON.stringify(bm)
		expect(str).toEqual(JSON.stringify({ amount: 1, B_: bm.B_.toHex(true) }))
		expect(bm.toJSON()).toStrictEqual({ amount: 1, B_: bm.B_.toHex(true) })
	})
	test('test proof', () => {
		// mint
		const mint = new Mint(new PrivateKey())
		// alice
		const bm = BlindedMessage.newBlindedMessage({ amount: 1 })  // blindedMessage
		// mint
		const bs = mint.createBlindSignature({ B_: bm.B_ })// BlindedSignature
		// alice
		const ub = bm.unblind(bs.C_, mint.getPublicKey(bm.amount)) // unblinded
		const p: IProof = {
			amount: bm.amount,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			C: ub.C.toHex(),
			secret: uint8ArrToHex(bm.secret)
		}
		// mint proof
		expect(mint.verify(bm.secret, ub.C, bm.amount)).toBe(true)

		expect(mint.verifyProofBdhk(p)).toBe(true)
	})
})
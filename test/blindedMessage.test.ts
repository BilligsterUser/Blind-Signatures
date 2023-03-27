import { BlindedMessage, Mint, PrivateKey } from '../src'


describe('test crypto bdhke', () => {
	test('test BlindedMessage from string', async() => {
		// mint
		const mint = new Mint(new PrivateKey())
		// alice
		const bm = BlindedMessage.newBlindedMessage({secret:'xxxx'})
		// mint
		const bs = mint.createBlindSignature({ B_: bm.B_ })
		// alice
		const { C } = bm.unblind(bs.C_, mint.privateKey.getPublicKey())

		expect(mint.verify(bm.r, C))
	})
	test('test crypto', () => {
		// mint
		const mint = new Mint(new PrivateKey())
		// alice
		const bm = BlindedMessage.newBlindedMessage({amount:1})  // blindedMessage
		const B_ = bm.blind()

		expect(B_.toHex(true)).toBe(bm.B_.toHex(true))
		expect(bm.toJSON()).toStrictEqual({ amount: 1, B_: B_.toHex(true) })

		// mint
		const bs = mint.createBlindSignature({B_})// BlindedSignature
		// alice
		const ub = bm.unblind(bs.C_, mint.privateKey.getPublicKey()) // unblinded
		// mint proof
		expect(mint.verify(bm.r, ub.C))
	})
	test('test toJSON', () => {
		const bm = BlindedMessage.newBlindedMessage({amount:1})  // blindedMessage
		const str = JSON.stringify(bm)
		expect(str).toEqual(JSON.stringify({ amount: 1, B_: bm.B_.toHex(true) }))
		expect(bm.toJSON()).toStrictEqual({ amount: 1, B_: bm.B_.toHex(true) })
	})
})
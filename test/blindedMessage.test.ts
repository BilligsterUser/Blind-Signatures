import { BlindedMessage, Mint, PrivateKey } from '../src'


describe('test crypto bdhke', () => {
	test('test', async() => {
		const mint = new Mint(new PrivateKey())
		const { B_, blindedMessage } = BlindedMessage.newBlindedMessage(1, 'xxxx')
		const bs = mint.createBlindSignature('', 1, B_)
		const { C } = blindedMessage.unblind(bs.C_, mint.privateKey.getPublicKey())

		expect(mint.verify(blindedMessage.r, C))
	})
	test('test crypto', () => {
		// mint
		const mint = new Mint(new PrivateKey())
		// alice
		const bm = BlindedMessage.newBlindedMessage(1)  // blindedMessage
		const B_ = bm.blindedMessage.blind()

		expect(B_.toHex(true)).toBe(bm.B_.toHex(true))
		expect(bm.blindedMessage.serialize()).toStrictEqual({ amount: 1, B_: B_.toHex(true) })

		// mint
		const bs = mint.createBlindSignature('', 1, B_)// BlindedSignature
		// alice
		const ub = bm.blindedMessage.unblind(bs.C_, mint.privateKey.getPublicKey()) // unblinded
		// mint proof
		expect(mint.verify(bm.blindedMessage.r, ub.C))
	})
})
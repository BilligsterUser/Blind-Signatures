import { BlindedMessage, Mint, PrivateKey } from '../src/index.js'
import { pointFromHex } from '../src/utils/index.js'

describe('Mint', () => {
	const mint = new Mint(new PrivateKey())
	test('test mint requestMint', () => {
		const requestMintResp = mint.requestMint(1)
		expect(requestMintResp).toStrictEqual({ pr: 'lnbc...', hash: '0000' })
		expect(mint.isPaid(requestMintResp.hash)).toBe(true)
	})
	test('test mint mintTokens', () => {
		const blindedMessages = BlindedMessage.newBlindedMessages(1)
		const mintTokensResp = mint.mintTokens('0000', blindedMessages)
		expect(mintTokensResp.promises).toHaveLength(1)
		expect(mintTokensResp.promises.reduce((r, cur) => r + cur.amount, 0)).toBe(1)
		const C_ = pointFromHex(mintTokensResp.promises[0].C_)
		const unblinded = blindedMessages[0].unblind(C_, mint.getPublicKey(mintTokensResp.promises[0].amount))
		expect(mint.verify(blindedMessages[0].r, unblinded.C))
	})
	test('test mint getKeys', () => {
		const keys = mint.getKeys()
		expect(Object.values(keys)).toHaveLength(64)
	})
	test('test mint info', () => {
		const info = mint.info()
		expect(info.name).toBe('Typescript Cashu mint')
		expect(info.version).toBe('blind-signatures/0.0.0')
	})
})
import { BlindedMessage, Mint, PrivateKey } from '../src/index.js'

describe('Mint', () => {
	const mint = new Mint(new PrivateKey())
	test('test mint requestMint', () => {
		const requestMintResp = mint.requestMint(1)
		expect(requestMintResp).toStrictEqual({ pr: 'lnbc...', hash: '0000' })
		expect(mint.isPaid(requestMintResp.hash)).toBe(true)
	})
	test('test mint mintTokens', () => {
		const mintTokensResp = mint.mintTokens(1,'',BlindedMessage.newBlindedMessages(1))
		expect(mintTokensResp.promises).toHaveLength(1)
		expect(mintTokensResp.promises.reduce((r,cur)=>r+cur.amount,0)).toBe(1)
	})
	test('test mint getKeys', () => {
		const keys = mint.getKeys()
		expect(Object.values(keys)).toHaveLength(64)
	})
})
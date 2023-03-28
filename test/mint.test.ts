import {  Mint, PrivateKey } from '../src/index.js'

describe('Mint', () => {
	test('test mint requestMint', () => {
		const mint = new Mint(new PrivateKey())
		const requestMintResp = mint.requestMint(1)
		expect(requestMintResp).toStrictEqual({ pr: 'lnbc...', hash: '0000' })
		expect(mint.isPaid(requestMintResp.hash)).toBe(true)
	})
})
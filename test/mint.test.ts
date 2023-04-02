import { config } from '../src/config/index.js'
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
		expect(Object.values(keys)).toHaveLength(config.maxOrder)
	})
	test('test mint info', () => {
		const info = mint.info()
		expect(info.name).toBe('Typescript Cashu mint')
		expect(info.version).toBe('blind-signatures/0.0.0')
	})
	test('test mint checkfees', () => {
		const fees = mint.checkfees('lnbc20u1p3u27nppp5pm074ffk6m42lvae8c6847z7xuvhyknwgkk7pzdce47grf2ksqwsdpv2phhwetjv4jzqcneypqyc6t8dp6xu6twva2xjuzzda6qcqzpgxqyz5vqsp5sw6n7cztudpl5m5jv3z6dtqpt2zhd3q6dwgftey9qxv09w82rgjq9qyyssqhtfl8wv7scwp5flqvmgjjh20nf6utvv5daw5h43h69yqfwjch7wnra3cn94qkscgewa33wvfh7guz76rzsfg9pwlk8mqd27wavf2udsq3yeuju')
		expect(fees).toStrictEqual({ fee: 20 })
	})
})

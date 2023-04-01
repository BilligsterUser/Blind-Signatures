import { decodeInvoice } from '../src/utils/bolt11.js'

describe('utils bolt11', () => {
	test('test bolt11 decodeInvoice', () => {
		const { msats, paymentHash } = decodeInvoice('lnbc20u1p3u27nppp5pm074ffk6m42lvae8c6847z7xuvhyknwgkk7pzdce47grf2ksqwsdpv2phhwetjv4jzqcneypqyc6t8dp6xu6twva2xjuzzda6qcqzpgxqyz5vqsp5sw6n7cztudpl5m5jv3z6dtqpt2zhd3q6dwgftey9qxv09w82rgjq9qyyssqhtfl8wv7scwp5flqvmgjjh20nf6utvv5daw5h43h69yqfwjch7wnra3cn94qkscgewa33wvfh7guz76rzsfg9pwlk8mqd27wavf2udsq3yeuju')

		expect(msats).toBe(2000000)
		expect(paymentHash).toBe('0edfeaa536d6eaafb3b93e347af85e3719725a6e45ade089b8cd7c81a556801d')
	})
})

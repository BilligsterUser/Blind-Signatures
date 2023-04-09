import { LNBitsWalletClass } from 'lnbits-ts/dist/wallet'
import { config } from '../../config'
import { IRequestMintResp } from '../../model'
import { IInvoicer } from './index'

export class LnBitsInvoicer implements IInvoicer {
	readonly #wallet
	constructor() {
		this.#wallet = new LNBitsWalletClass({
			adminKey: config.lnBits.apiKey,
			endpoint: config.lnBits.endpoint
		})
	}
	public async createInvoice(amount: number): Promise<IRequestMintResp> {
		const invoice = await this.#wallet.createInvoice({ amount, out: false })
		return { pr: invoice.payment_request, hash: invoice.payment_hash }
	}
	public async isPaid(paymentHash: string): Promise<boolean> {
		const data = await this.#wallet.checkInvoice(paymentHash)
		return data.paid
	}
}

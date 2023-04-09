import { IRequestMintResp } from '../../model'
import { IInvoicer } from './index'
export class FakeInvoicer implements IInvoicer {
	public createInvoice(_amount: number): Promise<IRequestMintResp> {
		return Promise.resolve({ pr: 'lnbc...', hash: '0000' })
	}
	public isPaid(_paymentHash: string): Promise<boolean> { return Promise.resolve(true) }
}

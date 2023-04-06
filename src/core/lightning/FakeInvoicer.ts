import { IRequestMintResp } from '../../model'
import { IInvoicer } from './index'
export class FakeInvoicer implements IInvoicer {
	public createInvoice(_amount: number): IRequestMintResp {
		return { pr: 'lnbc...', hash: '0000' }
	}
	public isPaid(_paymentHash: string): boolean { return true }
}

import { IRequestMintResp } from '../../model'

export interface IInvoicer {
	createInvoice(amount: number): Promise<IRequestMintResp>
	isPaid(paymentHash: string): Promise<boolean>
}
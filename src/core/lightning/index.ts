import { IRequestMintResp } from '../../model'

export interface IInvoicer {
	createInvoice(amount: number): IRequestMintResp
	isPaid(paymentHash: string): boolean
}
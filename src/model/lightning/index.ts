import { IRequestMintResp } from '..'

export interface IInvoicer {
	createInvoice(amount: number): IRequestMintResp
	isPaid(paymentHash: string): boolean
}
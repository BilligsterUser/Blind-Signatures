
export interface IStorage {
	getPayment(paymentHash: string): number | undefined
	savePayment(amount: number, paymentHash: string): void
}

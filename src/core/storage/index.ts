
export interface IStorage {
	getPayment(paymentHash: string): { amount: number, issued: boolean }
	isSpendable(secret: string): boolean
	savePayment(amount: number, paymentHash: string): void
	setSpend(...secrets: string[]): void
	updatePayment(paymentHash: string): void
}

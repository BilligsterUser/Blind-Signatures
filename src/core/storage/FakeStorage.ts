import { IStorage } from '.'

export class FakeStorage implements IStorage {
	#mapPayment = new Map<string, { amount: number, issued: boolean }>()
	#usedProofs = new Set<string>()
	public getPayment(paymentHash: string) { return this.#mapPayment.get(paymentHash) || { amount: 0, issued: true } }
	public isSpendable(secret: string) { return this.#usedProofs.has(secret) }
	public savePayment(amount: number, paymentHash: string) {
		this.#mapPayment.set(paymentHash, { amount, issued: false })
	}
	public setSpend(...secrets: string[]) { secrets.forEach(x => this.#usedProofs.add(x)) }
	public updatePayment(paymentHash: string) {
		const result = this.#mapPayment.get(paymentHash) || { amount: 0, issued: true }
		result.issued = true
		this.#mapPayment.set(paymentHash, result)
	}
}

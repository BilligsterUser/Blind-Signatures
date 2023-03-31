export class FakeStorage {
	#map = new Map<string, number>()
	public getPayment(paymentHash: string) { return this.#map.get(paymentHash) }
	public savePayment(amount: number, paymentHash: string) { this.#map.set(paymentHash, amount) }
}

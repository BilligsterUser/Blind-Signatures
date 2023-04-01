import { decode } from 'light-bolt11-decoder'

/* export function getFees(pr: string) {
	const msats: number = decode(pr).sections[2].value
	return { msats }
} */
export function decodeInvoice(pr: string) {
	const data = decode(pr).sections
	const msats: number = +data[2].value
	const paymentHash: string = data[5].value.toString()
	return { msats, paymentHash }
}


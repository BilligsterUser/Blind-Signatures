import { secp256k1 } from '@noble/curves/secp256k1'

export function byteArrToBigInt(b: Uint8Array): bigint {
	return BigInt(`0x${Buffer.from(b).toString('hex')}`)
}
export function pointFromHex(hex: string) {
	return secp256k1.ProjectivePoint.fromHex(hex)
}
export function uint8ArrToHex(arr: Uint8Array) { return Buffer.from(arr).toString('hex') }
export function splitAmount(amount: number): number[] {
	const result: number[] = []
	let total = 0
	for (let i = 0; i < 64; i++) {
		// tslint:disable-next-line: no-bitwise
		const mask: number = 1 << i
		// tslint:disable-next-line: no-bitwise
		if ((amount & mask) !== 0) {
			const v = Math.pow(2, i)
			result.push(v)
			total += v
			if (total >= amount) { break }
		}
	}
	return result
}



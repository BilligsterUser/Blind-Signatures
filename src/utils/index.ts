import { secp256k1 } from '@noble/curves/secp256k1'
import { config } from '../config'
import { IProof, ISerializedBlindedMessage } from '../model'

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
	for (let i = 0; i < config.maxOrder; i++) {
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


export function verifySecret({ secret }: IProof) {
	return secret && secret.length > 0 && secret.length <= 64
}
export function verifyAmount(amount: number) {
	return !isNaN(amount) && amount > 0 && amount < 2 ** config.maxOrder
}
export function verifyNoDuplicateOutputs(outputs: ISerializedBlindedMessage[]) {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	const B_s = outputs.map(x => x.B_)
	return B_s.length === new Set(B_s).size
}
export function verifyOutputs(total: number, amount: number, outputs: ISerializedBlindedMessage[]) {
	const amount1 = total - amount
	const amount2 = amount
	const outputs1 = splitAmount(amount1)
	const outputs2 = splitAmount(amount2)
	const expected = outputs1.reduce((r, c) => r + c) + outputs2.reduce((r, c) => r + c)
	const given = outputs.reduce((r, c) => r + c.amount, 0)
	return given === expected
}
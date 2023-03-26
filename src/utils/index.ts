export function byteArrToBigInt(b: Uint8Array): bigint {
	return BigInt(`0x${Buffer.from(b).toString('hex') }`)
}

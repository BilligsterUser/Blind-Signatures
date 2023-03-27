export interface ISerializedBlindedSignature {
	amount: number,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	C_: string,
	id?: string
}
export interface ISerializedBlindedMessage {
	amount: number,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	B_: string
}
export interface IProof {
	amount: number,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	C: string,
	id?: string,
	secret: number,
	// script=: P2SHScript,
}
export interface IMint {
	ids: string[]
	url: string,
}
export type TokenV1 = IProof[]
export interface ITokenV2 {
	mints: IMint[]
	proofs: IProof[]
}
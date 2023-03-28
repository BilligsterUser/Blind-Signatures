import { ProjPointType } from '@noble/curves/abstract/weierstrass'
import { PrivateKey } from './PrivateKey'

export interface ISerializedBlindedSignature {
	amount: number,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	C_: string,
	id?: string
}
export interface IBlindedSignatureParam{
	amount?: number,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	B_: ProjPointType<bigint>,
	id?: string,
	privateKey: PrivateKey
}
export interface ISerializedBlindedMessage {
	amount: number,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	B_: string
}
export interface IBlindedMessageParam{
	amount?: number,
	// eslint-disable-next-line @typescript-eslint/naming-convention
	B_?: ProjPointType<bigint>
	r?: PrivateKey
	secret?: string | Uint8Array
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
// https://github.com/cashubtc/nuts/blob/main/00.md#021---v1-tokens
export type TokenV1 = IProof[]
// https://github.com/cashubtc/nuts/blob/main/00.md#022---v2-tokens
export interface ITokenV2 {
	mints: IMint[]
	proofs: IProof[]
}
// https://github.com/cashubtc/nuts/blob/main/00.md#023---v3-tokens
export interface ITokenV3 {
	memo?: string
	token: { mint: string, proofs: IProof[] }[]
}
// Create Invoice
export interface IRequestMintResp{
	hash: string
	pr: string,
}

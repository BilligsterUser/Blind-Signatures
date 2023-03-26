import { createECDH, createHash } from 'crypto'

// https://github.com/cashubtc/cashu/blob/main/docs/specs/01.md
// https://github.com/cashubtc/cashu/blob/main/docs/specs/02.md
export class Keyset {
	#seed: string
	#derivationPath: string
	#keys: { amount: string, privateKey: Buffer, publicKey: Buffer }[] = []
	#keysetId = ''
	// GET /keysets
	get id() { return this.#keysetId }
	get amounts() { return this.#keys.map(x => x.amount) }
	constructor(seed: string, derivationPath = '0/0/0/0') {
		this.#derivationPath = derivationPath
		this.#seed = seed
		this.#deriveKeys()
		this.#deriveKeysetId()
	}
	#deriveKeys() {
		for (let i = 0; i < 64; i++) {
			const hash = createHash('sha256')
				.update(this.#seed + this.#derivationPath + i.toString())
				.digest()
			const keyPair = createECDH('secp256k1')
			keyPair.setPrivateKey(hash)
			this.#keys.push({
				amount: BigInt(2 ** i).toString(10),
				privateKey: keyPair.getPrivateKey(),
				publicKey: keyPair.getPublicKey(null, 'compressed')
			})
		}
	}
	#deriveKeysetId() {
		const pubkeysConcat = this.#keys.map(x => x.publicKey.toString('hex')).join('')
		this.#keysetId = createHash('sha256')
			.update(pubkeysConcat)
			.digest().toString('base64').slice(0, 12)
	}
	// GET /keys
	public getKeys() {
		return this.#keys.reduce((r, cur) => {
			r[cur.amount] = cur.publicKey.toString('hex')
			return r
		}, {} as { [k: string]: string })
	}
}
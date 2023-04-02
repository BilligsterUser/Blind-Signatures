
// https://github.com/cashubtc/cashu/blob/main/docs/specs/01.md

import { createHash } from 'crypto'
import { config } from '../config'
import { PrivateKey } from './PrivateKey'

// https://github.com/cashubtc/cashu/blob/main/docs/specs/02.md
export class Keyset {
	#seed: string
	#derivationPath: string
	#keys: { amount: string, privateKey: PrivateKey }[] = []
	#keysetId = ''
	// GET /keysets
	get id() { return this.#keysetId }
	get amounts() { return this.#keys.map(x => x.amount) }
	get keys() {
		return this.#keys.reduce((r, cur) => {
			r[cur.amount] = cur.privateKey
			return r
		}, {} as { [k: string]: PrivateKey })
	}
	constructor(seed: string, derivationPath = '0/0/0/0') {
		this.#derivationPath = derivationPath
		this.#seed = seed
		this.#deriveKeys()
		this.#deriveKeysetId()
	}
	#deriveKeys() {
		for (let i = 0; i < config.maxOrder; i++) {
			const hash = createHash('sha256')
				.update(this.#seed + this.#derivationPath + i.toString())
				.digest()
			const privateKey = new PrivateKey(hash)
			this.#keys.push({
				amount: BigInt(2 ** i).toString(10),
				privateKey
			})
		}
	}
	#deriveKeysetId() {
		const pubkeysConcat = this.#keys.map(x => x.privateKey.getPublicKey().toHex()).join('')
		this.#keysetId = createHash('sha256')
			.update(pubkeysConcat)
			.digest().toString('base64').slice(0, 12)
	}
	// GET /keys
	public getKeys() {
		return this.#keys.reduce((r, cur) => {
			r[cur.amount] = cur.privateKey.getPublicKey().toHex()
			return r
		}, {} as { [k: string]: string })
	}
}
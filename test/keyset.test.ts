import { Keyset } from '../src/index.js'

describe('Keyset', () => {
	const amounts = [
		1, 2, 4,
		8, 16, 32,
		64, 128, 256,
		512, 1024, 2048,
		4096, 8192, 16384,
		32768, 65536, 131072,
		262144, 524288, 1048576,
		2097152, 4194304, 8388608,
		16777216, 33554432, 67108864,
		134217728, 268435456, 536870912,
		1073741824, 2147483648, 
	]
	test('test Keyset', () => {
		const masterKeys = ['TEST_PRIVATE_KEY', 'master', 'masterkey']
		const ids = ['3LuA4vWlsSxj', 'ynPu3lfAyLdC', 'Nfbh/ydPD15H']
		for (let i = 0; i < masterKeys.length; i++) {
			const keyset = new Keyset(masterKeys[i], '0/0/0/0')
			expect(keyset.id).toBe(ids[i])
			expect(Object.entries(keyset.getKeys())).toHaveLength(32)
			expect(keyset.amounts).toStrictEqual(amounts)
		}
	})
})
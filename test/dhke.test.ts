import { hexToBytes } from '@noble/curves/abstract/utils';
import { hashToCurve, pointFromHex } from '../src/utils';
import { BlindedMessage } from '../src/model/BlindedMessage';
import { BlindedSignature, PrivateKey } from '../src';


const SECRET_MESSAGE = 'test_message';

describe('testing hash to curve', () => {
	test('testing string 0000....00', async () => {
		let secret = hexToBytes(
			'0000000000000000000000000000000000000000000000000000000000000000'
		);
		let Y = hashToCurve(secret);
		let hexY = Y.toHex(true);
		expect(hexY).toBe('0266687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925');
	});

	test('testing string 0000....01', async () => {
		let secret = hexToBytes(
			'0000000000000000000000000000000000000000000000000000000000000001'
		);
		let Y = hashToCurve(secret);
		let hexY = Y.toHex(true);
		expect(hexY).toBe('02ec4916dd28fc4c10d78e287ca5d9cc51ee1ae73cbfde08c6b37324cbfaac8bc5');
	});
});

/* describe('test blinding message', () => {
	test('testing string 0000....01', async () => {
		let { B_ } = BlindedMessage.newBlindedMessage({
			secret: SECRET_MESSAGE,
			r:new PrivateKey('0000000000000000000000000000000000000000000000000000000000000001')
		})
		expect(B_.toHex(true)).toBe(
			'03c509bbdd8aaa81d5e67468d07b4b7dffd5769ac596ff3964e151adcefc6b06d0'
		);
	});
}); */

describe('test unblinding signature', () => {
	test('testing string 0000....01', async () => {
		const bm = BlindedMessage.newBlindedMessage({
			r: new PrivateKey('0000000000000000000000000000000000000000000000000000000000000001')
		})
		let C_ = pointFromHex('02a9acc1e48c25eeeb9289b5031cc57da9fe72f3fe2861d264bdc074209b107ba2');
		let A = pointFromHex('020000000000000000000000000000000000000000000000000000000000000001');
		let {C} = bm.unblind(C_, A);
		expect(C.toHex(true)).toBe(
			'03c724d7e6a5443b39ac8acf11f40420adc4f99a02e7cc1b57703d9391f6d129cd'
		);
	});
});

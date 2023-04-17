import * as dotenv from 'dotenv'
dotenv.config()

export const config = {
	// TODO 64 maybe to big !!!
	// 2**64 as number 18446744073709552000 - as bigint 18446744073709551616n
	maxOrder: 64,
	derivationPath: process.env.MINT_DERIVATION_PATH || '0/0/0/0',
	info: {
		name: process.env.MINT_INFO_NAME || 'Typescript Cashu mint',
		description: process.env.MINT_INFO_DESCRIPTION || 'The short mint description',
		descriptionLong: process.env.DESCRIPTION_LONG || 'A long mint description that can be a long piece of text.',
		// contact: process.env.MINT_INFO_CONTACT || [],
		motd: process.env.MINT_INFO_MOTD || 'Message to users'
	},
	secret: process.env.MINT_PRIVATE_KEY || 'supersecretprivatekey',
	host: process.env.MINT_LISTEN_HOST || '127.0.0.1',
	port: +(process.env.MINT_LISTEN_PORT || 3338),
	lightning: {
		// # fee to reserve in percent of the amount
		feePercent: +(process.env.LIGHTNING_FEE_PERCENT || 1.0),
		// # minimum fee to reserve
		reserveFee: +(process.env.LIGHTNING_RESERVE_FEE_MIN || 4000),
	},
	lnBits: {
		endpoint: process.env.MINT_LNBITS_ENDPOINT || 'https://legend.lnbits.com',
		apiKey: process.env.MINT_LNBITS_ENDPOINT || 'yourApiKey'
	}

}

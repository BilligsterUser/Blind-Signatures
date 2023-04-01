declare module 'light-bolt11-decoder' {
	// import { decode } from 'light-bolt11-decoder'
	export function decode(pr: string): { sections: { value: number | string }[] }
}
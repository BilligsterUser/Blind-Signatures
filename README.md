# Blind Signatures

big thanks to Tim Bouma [@trbouma](https://github.com/trbouma)


This code in this repl is based on prior work and is intended to help in the understandng of blind signatures, which is the 'secret sauce' of Chaumian mints. The basic gist of the protocol is that the mint signs a secret value, which it cannot see. When this secret value is presented later on, the mint can confirm that it actually signed this secret value.

Protocol aside, the hardest thing to understand is how this scheme is actually useful, especially when the mint can't actually see what is being signed.

The original email from 1996 that proposed blind signature using elliptic curve cryptography (verus RST)

The original (and surprisingly readable) paper from David Chaum

https://chaum.com/wp-content/uploads/2022/01/Chaum-blind-signatures.pdf

https://cypherpunks.venona.com/date/1996/03/msg01848.html

An excellent explanatory gist by Adam Gibson with a corresponding video

A more recent post https://gist.github.com/RubenSomsen/be7a4760dd4596d06963d67baf140406

A minimal implementation https://github.com/phyro/minicash

And, finally, Cashu, a Chaumian Ecash wallet and mint with Bitcoin Lightning support

https://github.com/callebtc/cashu

This repo implementation is based on this spec:

https://github.com/callebtc/cashu/blob/main/docs/specs/cashu_client_spec.md

Please run npm run test to see the code in action!

https://youtu.be/BH1gE2oFrxQ



## Progress

https://github.com/cashubtc/cashu/blob/main/docs/specs/README.md


| Number   | Description                                                 |  |
|----------|-------------------------------------------------------------|---------|
| [00] | Notation and Models                          |
| [01] | Mint public keys                           | ✅
| [02] | Keysets and keyset IDs                           | ✅
| [03] | Requesting a mint                           |
| [04] | Mint tokens                           |
| [05] | Melt tokens                           |
| [06] | Split tokens                           |

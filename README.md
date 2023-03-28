# Blind Signatures

[![codecov](https://codecov.io/github/BilligsterUser/Blind-Signatures/branch/main/graph/badge.svg?token=VEr2pUyLw5)](https://codecov.io/github/BilligsterUser/Blind-Signatures)
![example workflow](https://github.com/BilligsterUser/Blind-Signatures/actions/workflows/node.js.yml/badge.svg)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)

[![chatroom icon](https://patrolavia.github.io/telegram-badge/chat.png)](https://t.me/CashuBTC)


## Progress

https://github.com/cashubtc/nuts/tree/main


| Number   | Description                                                 |  |
|----------|-------------------------------------------------------------|---------|
| [00](https://github.com/cashubtc/nuts/blob/main/00.md) | Notation and Models | ✅
| [01](https://github.com/cashubtc/nuts/blob/main/01.md) | Mint public keys | ✅
| [02](https://github.com/cashubtc/nuts/blob/main/02.md) | Keysets and keyset IDs | ✅
| [03](https://github.com/cashubtc/nuts/blob/main/03.md) | Requesting a mint | ✅
| [04](https://github.com/cashubtc/nuts/blob/main/04.md) | Mint tokens |
| [05](https://github.com/cashubtc/nuts/blob/main/05.md) | Melt tokens |
| [06](https://github.com/cashubtc/nuts/blob/main/06.md) | Split tokens |




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
https://github.com/cashubtc/nuts

This repo implementation is based on this spec:

https://github.com/callebtc/cashu/blob/main/docs/specs/cashu_client_spec.md

Please run npm run test to see the code in action!

https://youtu.be/BH1gE2oFrxQ



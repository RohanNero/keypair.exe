import { webcrypto } from "node:crypto";
import { colors } from "./constants.js";
import { sha512 } from "@noble/hashes/sha512";
import * as ed from "@noble/ed25519";
import bs58 from "bs58";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;

function create() {
  const privKey = ed.utils.randomPrivateKey();
  const pubKeyArray = ed.getPublicKey(privKey);
  const address = bs58.encode(pubKeyArray);
  // Combine private key (32 bytes) and public key (32 bytes) into a single 64-byte array
  const keypair = new Uint8Array(64);
  keypair.set(privKey, 0); // First 32 bytes: private key
  keypair.set(pubKeyArray, 32); // Next 32 bytes: public key

  // Encode the 64-byte keypair as Base58 (for importing into Solana wallets)
  const priv64b = bs58.encode(keypair);

  console.log(
    `${colors.cyan}${colors.bright} ╔═══════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bright} ║${colors.reset}${colors.yellow}       SOLANA KEY GENERATION${colors.cyan}${colors.bright}       ║${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bright} ╚═══════════════════════════════════╝${colors.reset}`
  );
  console.log(
    `${colors.bright} Base58 Private Key (importing):${colors.reset}`
  );
  console.log(`   ${colors.green}${priv64b}${colors.reset}`);
  console.log("\n");
  console.log(`${colors.bright} Hex Private Key (signing):${colors.reset}`);
  console.log(
    `   ${colors.blue}${Buffer.from(privKey).toString("hex")}${colors.reset}`
  );
  console.log("\n");
  console.log(`${colors.bright} Public Key (address):${colors.reset}`);
  console.log(`   ${colors.yellow}${address}${colors.reset}`);
  console.log("\n");
  console.log(`${colors.bright} Hex Public Key (verifying):${colors.reset}`);
  console.log(
    `   ${colors.magenta}${Buffer.from(pubKeyArray).toString("hex")}${
      colors.reset
    }`
  );
  console.log(
    `${colors.cyan}${colors.bright} ═════════════════════════════════════${colors.reset}${colors.reset}`
  );
  console.log(`${colors.red} Closing after 1 minute...${colors.reset}`);

  setTimeout(() => {
    process.exit();
  }, 60000);
}

create();

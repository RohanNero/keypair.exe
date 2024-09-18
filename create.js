import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";

secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;


const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
};

function create() {
  const privKey = secp.utils.randomPrivateKey();
  const pubKey = secp.getPublicKey(privKey, false);
  const compressedPubKey = secp.getPublicKey(privKey);
  const hashPubKey = secp.etc.bytesToHex(sha256(pubKey));

  
  console.log(`${colors.cyan}${colors.bright}╔═══════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}║${colors.reset}${colors.yellow}          KEY GENERATION${colors.cyan}${colors.bright}           ║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}╚═══════════════════════════════════╝${colors.reset}`);

  console.log(`${colors.bright}Private Key:${colors.reset}`);
  console.log(`${colors.green}${secp.etc.bytesToHex(privKey)}${colors.reset}`)
  console.log('\n')
  console.log(`${colors.bright}Address:${colors.reset}`);
  console.log(`${colors.blue}${hashPubKey.slice(-40)}${colors.reset}`)
  console.log('\n')
  console.log(`${colors.bright}Public Key:${colors.reset}`);
  console.log(`${colors.yellow}${secp.etc.bytesToHex(pubKey)}${colors.reset}`)
  console.log('\n')
  console.log(`${colors.bright}Compressed PubKey:${colors.reset}`);
  console.log(`${colors.magenta}${secp.etc.bytesToHex(compressedPubKey)}${colors.reset}`)
  console.log(`${colors.cyan}${colors.bright}═════════════════════════════════════${colors.reset}${colors.reset}`);
  console.log(`${colors.red}Closing after 1 minute...${colors.reset}`);

  setTimeout(() => {
    process.exit();
  }, 60000);
}

create();

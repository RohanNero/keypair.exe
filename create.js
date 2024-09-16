import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";

secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;

function create() {
  const privKey = secp.utils.randomPrivateKey();
  const pubKey = secp.getPublicKey(privKey, false);
  const compressedPubKey = secp.getPublicKey(privKey);
  const hashPubKey = secp.etc.bytesToHex(sha256(pubKey));
  const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    magenta: "\x1b[35m"
  };
  
  console.log(`
  ${colors.cyan}╔═══════════════════════════════════╗${colors.reset}
  ${colors.cyan}║${colors.reset}   ${colors.yellow}🔑     KEY GENERATION    🔑${colors.reset}     ${colors.cyan}║${colors.reset}
  ${colors.cyan}╚═══════════════════════════════════╝${colors.reset}
  
  ${colors.bright}Private Key:${colors.reset}  
  ${colors.green}${secp.etc.bytesToHex(privKey)}${colors.reset}
  
  ${colors.bright}Address:${colors.reset}      
  ${colors.blue}0x${hashPubKey.slice(-40)}${colors.reset}
  
  ${colors.bright}Public Key:${colors.reset}   
  ${colors.yellow}${secp.etc.bytesToHex(pubKey)}${colors.reset}
  
  ${colors.bright}Compressed PubKey:${colors.reset} 
  ${colors.magenta}${secp.etc.bytesToHex(compressedPubKey)}${colors.reset}
  
  ${colors.cyan}═════════════════════════════════════${colors.reset}
  
  ${colors.red}Closing after 1 minute...${colors.reset}
  `);
  
    // Keep the window open for 60 seconds before ending execution
    setTimeout(() => {
      
      process.exit();
    }, 60000);
}

create();

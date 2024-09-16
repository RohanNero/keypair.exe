import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";
import readline from "readline";

secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));

if (!globalThis.crypto) globalThis.crypto = webcrypto;

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

const sign = async (privKey, msgHash) => {
  const pubKey = secp.getPublicKey(privKey);
  const signature = await secp.signAsync(msgHash, privKey);
  const isValid = secp.verify(signature, msgHash, pubKey);

  console.log(`
  ${colors.cyan}╔═══════════════════════════════════╗${colors.reset}
  ${colors.cyan}║${colors.reset}   ${
    colors.yellow
  }✍️     MESSAGE SIGNING    ✍️${colors.reset}      ${colors.cyan}║${
    colors.reset
  }
  ${colors.cyan}╚═══════════════════════════════════╝${colors.reset}

  ${colors.bright}Signature:${colors.reset}      
  ${colors.yellow}r:${colors.reset}${colors.green} ${signature.r}${colors.reset}
  ${colors.yellow}s:${colors.reset}${colors.green} ${signature.s}${colors.reset}
  ${colors.yellow}recovery:${colors.reset}${colors.green} ${
    signature.recovery
  }${colors.reset}

  ${colors.bright}Compact Signature:${colors.reset}  
  ${colors.blue}0x${signature.toCompactHex()}${colors.reset}

  ${colors.bright}Is Valid:${colors.reset}       
  ${colors.magenta}${isValid}${colors.reset}

  ${colors.cyan}═════════════════════════════════════${colors.reset}

  ${colors.red}Closing after 1 minute...${colors.reset}
  `);

  setTimeout(() => {
    process.exit();
  }, 60000);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter private key: ", (privKey) => {
  rl.question("Enter message hash: ", (msgHash) => {
    if (!privKey || !msgHash) {
      console.error(
        `${colors.red}Error: Both private key and message hash are required.${colors.reset}`
      );
      rl.close();
    } else {
      sign(privKey, msgHash).then(() => rl.close());
    }
  });
});

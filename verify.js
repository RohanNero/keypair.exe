import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";
import readline from "readline";

secp.etc.hmacSha256Sync = (k, ...m) => hmac(sha256, k, secp.etc.concatBytes(...m));

if (!globalThis.crypto) globalThis.crypto = webcrypto;

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

const verify = async (signature, msgHash, pubKey) => {
  const isValid = secp.verify(signature, msgHash, pubKey);

  console.log(`
  ${colors.cyan}╔═══════════════════════════════════╗${colors.reset}
  ${colors.cyan}║${colors.reset}  ${colors.yellow}🔍   SIGNATURE VERIFICATION  🔍${colors.reset}  ${colors.cyan}║${colors.reset}
  ${colors.cyan}╚═══════════════════════════════════╝${colors.reset}

  ${colors.bright}Signature:${colors.reset}      
  ${colors.green}${signature}${colors.reset}

  ${colors.bright}Message Hash:${colors.reset}   
  ${colors.blue}${msgHash}${colors.reset}

  ${colors.bright}Public Key:${colors.reset}     
  ${colors.yellow}${pubKey}${colors.reset}

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

rl.question("Enter signature: ", (sig) => {
  rl.question("Enter message hash: ", (msgHash) => {
    rl.question("Enter public key: ", (pubKey) => {
      if (!sig || !msgHash || !pubKey) {
        console.error(`${colors.red}Error: Please provide a signature, message hash, and public key as parameters.${colors.reset}`);
        rl.close();
      } else {
        verify(sig, msgHash, pubKey).then(() => rl.close());
      }
    });
  });
});
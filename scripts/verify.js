import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";
import readline from "readline";
import {colors} from "./constants.js"


secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const verify = async (signature, msgHash, pubKey) => {
  const isValid = secp.verify(signature, msgHash, pubKey);

  console.log(`${colors.cyan}${colors.bright}╔══════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}║${colors.reset}${colors.yellow}      SIGNATURE VERIFICATION${colors.cyan}${colors.bright}      ║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}╚══════════════════════════════════╝${colors.reset}`);
  console.log(`${colors.bright}Signature:${colors.reset}`);
  console.log(`   ${colors.green}${signature}${colors.reset}`);
  console.log('\n');
  console.log(`${colors.bright}Message Hash:${colors.reset}`);
  console.log(`   ${colors.blue}${msgHash}${colors.reset}`);
  console.log('\n');
  console.log(`${colors.bright}Public Key:${colors.reset}`);
  console.log(`   ${colors.yellow}${pubKey}${colors.reset}`);
  console.log('\n');
  console.log(`${colors.bright}Is Valid:${colors.reset}`);
  console.log(`   ${colors.magenta}${isValid}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}═════════════════════════════════════${colors.reset}`);
  console.log(`${colors.red}Closing after 1 minute...${colors.reset}`);

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
        console.error(
          "Error: Please provide a signature, message hash, and public key as parameters."
        );
        rl.close();
      } else {
        verify(sig, msgHash, pubKey).then(() => rl.close());
      }
    });
  });
});

import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";
import { colors } from "./constants.js"
import readline from "readline";


secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const sign = async (privKey, msgHash) => {
  const pubKey = secp.getPublicKey(privKey);
  const signature = await secp.signAsync(msgHash, privKey);
  const isValid = secp.verify(signature, msgHash, pubKey);

  console.log(`${colors.cyan}${colors.bright}╔══════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}║${colors.reset}${colors.yellow}         MESSAGE SIGNING${colors.cyan}${colors.bright}          ║${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}╚══════════════════════════════════╝${colors.reset}`);
  console.log(`${colors.bright}Signature:${colors.reset}`);
  console.log(`   ${colors.yellow}r: ${colors.green}${signature.r}${colors.reset}`);
  console.log(`   ${colors.yellow}s: ${colors.green}${signature.s}${colors.reset}`);
  console.log(`   ${colors.yellow}recovery: ${colors.green}${signature.recovery}${colors.reset}`);
  console.log('\n');
  console.log(`${colors.bright}Compact Signature:${colors.reset}`);
  console.log(`   ${colors.blue}${signature.toCompactHex()}${colors.reset}`);
  console.log('\n');
  console.log(`${colors.bright}Is Valid:${colors.reset}`);
  console.log(`   ${colors.magenta}${isValid}${colors.reset}`);
  console.log(`${colors.cyan}${colors.bright}═════════════════════════════════════${colors.reset}`);
  console.log(`${colors.red}Closing in 1 minute...${colors.reset}`);

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
      console.error("Error: Both private key and message hash are required.");
      rl.close();
    } else {
      sign(privKey, msgHash).then(() => rl.close());
    }
  });
});

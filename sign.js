import { sha512 } from "@noble/hashes/sha512";
import * as ed from "@noble/ed25519";
import { webcrypto } from "node:crypto";
import { colors } from "./constants.js";
import readline from "readline";

ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const sign = async (privKey, msg) => {
  const pubKey = ed.getPublicKey(privKey);
  const signature = await ed.signAsync(msg, privKey);
  const isValid = ed.verify(signature, msg, pubKey);

  console.log(
    `${colors.cyan}${colors.bright} ╔══════════════════════════════════╗${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bright} ║${colors.reset}${colors.yellow}         MESSAGE SIGNING${colors.cyan}${colors.bright}          ║${colors.reset}`
  );
  console.log(
    `${colors.cyan}${colors.bright} ╚══════════════════════════════════╝${colors.reset}`
  );
  console.log(`${colors.bright} Signature:${colors.reset}`);
  console.log(
    `${colors.green} ${Buffer.from(signature).toString("hex")}${colors.reset}`
  );
  console.log("\n");
  console.log(`${colors.bright} Is Valid:${colors.reset}`);
  console.log(`   ${colors.blue}${isValid}${colors.reset}`);
  console.log(
    `${colors.cyan}${colors.bright} ═════════════════════════════════════${colors.reset}`
  );
  console.log(`${colors.red} Closing after 1 minute...${colors.reset}`);

  setTimeout(() => {
    process.exit();
  }, 60000);
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter private key: ", (privKey) => {
  rl.question("Enter message hash: ", (msg) => {
    if (!privKey || !msg) {
      console.error("Error: Both private key and message hash are required.");
      rl.close();
    } else {
      sign(privKey, msg).then(() => rl.close());
    }
  });
});

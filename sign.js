import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";
import readline from "readline";

secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const sign = async (privKey, msgHash) => {
  const pubKey = secp.getPublicKey(privKey);
  const signature = await secp.signAsync(msgHash, privKey);
  const isValid = secp.verify(signature, msgHash, pubKey);
  console.log("Message Signing");
  console.log("Signature:");
  console.log("   r:", signature.r);
  console.log("   s:", signature.s);
  console.log("   recovery:", signature.recovery);
  console.log("Compact Signature:", signature.toCompactHex());
  console.log("Is Valid:", isValid);
  console.log("Closing in 1 minute...");

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

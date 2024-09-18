import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { webcrypto } from "node:crypto";
import readline from "readline";

secp.etc.hmacSha256Sync = (k, ...m) =>
  hmac(sha256, k, secp.etc.concatBytes(...m));

// node.js 18 and older, requires polyfilling globalThis.crypto
if (!globalThis.crypto) globalThis.crypto = webcrypto;

const verify = async (signature, msgHash, pubKey) => {
  const isValid = secp.verify(signature, msgHash, pubKey);

  console.log("Signature Verification");
  console.log("Signature:", signature);
  console.log("Message Hash:", msgHash);
  console.log("Public Key:", pubKey);
  console.log("Is Valid:", isValid);
  console.log("Closing after 1 minute...");

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

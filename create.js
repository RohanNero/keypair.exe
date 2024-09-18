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

  console.log("Key Generation");
  console.log("Private Key:", secp.etc.bytesToHex(privKey));
  console.log("Address:", hashPubKey.slice(-40));
  console.log("Public Key:", secp.etc.bytesToHex(pubKey));
  console.log("Compressed PubKey:", secp.etc.bytesToHex(compressedPubKey));
  console.log("Closing after 1 minute...");

  setTimeout(() => {
    process.exit();
  }, 60000);
}

create();

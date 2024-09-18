# Executable Keypairs

Contains executables for generating a keypair, signing a message, and verifying a message.

_This repo relies entirely on [Paul Miller](https://github.com/paulmillr)'s [@noble/secp256k1](https://github.com/paulmillr/noble-secp256k1) and [@noble/hashes](https://github.com/paulmillr/noble-hashes) libraries._

## Scripts

You don't need to use the executables at all, you can interact with the source code directly.

### Generating a keypair

```shell
node scripts/create.js
```

### Signing a message

_Remove the `0x` prefix from hex strings before calling the function._

```shell
node scripts/sign.js
```

### Verifying a message

_The public key, `pubKey`, can be compressed or uncompressed. When inputting a hex string, remove the `0x` prefix before calling the function._

```shell
node scripts/verify.js
```

## Executables

### Details

- **Platform:** Windows
- **Arch:** x64
- **Node:** v16.17.1

### Checksum

#### Commands

There are `scripts` inside the `package.json` for both Powershell and Bash.

Powershell:

`Get-FileHash -Algorithm SHA256 <FILE_PATH>`

Bash:

`shasum -a256 <FILE_PATH>`

Package.json:

```json
"scripts": {
    "hash-shell-create": "powershell -Command \"get-FileHash executables/create.exe\"",
    "hash-shell-sign": "powershell -Command \"get-FileHash executables/sign.exe\"",
    "hash-shell-verify": "powershell -Command \"get-FileHash executables/verify.exe\"",
    "hash-bash-create": "bash -c \"shasum -a 256 executables/create.exe\"",
    "hash-bash-sign": "bash -c \"shasum -a 256 executables/sign.exe\"",
    "hash-bash-verify": "bash -c \"shasum -a 256 executables/verify.exe\""
  },
```

#### SHA256 Hashes

Create.exe

`adb0cd7567b0576d77409b85a1d6f273ff6f8eeb87861e37a8e780e159a403af`

Sign.exe

`286735ed35a366c01f4ecca09a3e502653258b3088b5810672d473b49c02f2e2`

Verify.exe

`d934fbb0cfe3df18ce391c6444e4d13fd3e3ec8275ed85b768f5c3e6c6e56aec`

### Rebuild

The steps I took to build the executables are listed below.

Install nexe globally (I used version `4.0.0-rc.6`):

```shell
npm i -g nexe
```

Create.js:

```shell
nexe scripts/create.js -o executables/create.exe --build --target windows-x64-16.17.1
```

Sign.js:

```shell
nexe scripts/sign.js -o executables/sign.exe --build --target windows-x64-16.17.1
```

Verify.js:

```shell
nexe scripts/verify.js -o executables/verify.exe --build --target windows-x64-16.17.1
```

## Output

Images of what will be displayed in the terminal after running the scripts/executables.

## Create

![image](./images/create-output.png)

## Sign

![image](./images/sign-output.png)

## Verify

![image](./images/verify-output.png)

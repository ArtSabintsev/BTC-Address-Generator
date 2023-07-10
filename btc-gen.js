/**Generate SegWit addresses for a provided Mnemonic**/

const bip39 = require('bip39');
const hdkey = require('hdkey');
const bitcoin = require('bitcoinjs-lib');

const generateAddresses = (mnemonic, numAddresses) => {
  // Derive the seed from the mnemonic
  const seed = bip39.mnemonicToSeedSync(mnemonic);

  // Derive the master private key from the seed
  const root = hdkey.fromMasterSeed(seed);
  const masterPrivateKey = root.privateKey.toString('hex');
  const masterPublicKey = root.publicKey.toString('hex');

  // Derive child keys and generate addresses
  const addresses = [];
  for (let i = 0; i < numAddresses; i++) {
    const childIndex = i; // Change index as needed
    const child = root.derive(`m/84'/0'/0'/0/${childIndex}`); // Generate SegWit Addresses
    const childPublicKey = child.publicKey.toString('hex');
    const network = bitcoin.networks.bitcoin;
    const publicKeyBuffer = Buffer.from(childPublicKey, 'hex');
    const { address } = bitcoin.payments.p2wpkh({ pubkey: publicKeyBuffer, network });
    addresses.push({ index: childIndex, address });
  }

  // Print the results
  console.log('Master Private Key:', masterPrivateKey);
  console.log('Master Public Key:', masterPublicKey);
  console.log('Addresses:');
  addresses.forEach(({ index, address }) => {
    console.log('Index:', index, 'Address:', address);
  });
};

// Get the mnemonic from the user
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your BIP39 mnemonic: ', (mnemonic) => {
  rl.close();
  generateAddresses(mnemonic, 100);
});
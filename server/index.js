const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;
const EC = require('elliptic').ec;
const SHA256 = require('crypto-js/sha256');
// initialise the ec object
const ec = new EC('secp256k1');

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

console.log('Starting server...');
console.log('Generating 3 accounts, showing public and private keys...');

// generate some public/private key pairs for 3 accounts and print them to console
const balances = {};
for (i = 0; i < 3; i++) {
  const key = ec.genKeyPair();
  const publicKey = key.getPublic('hex');
  balances[publicKey] = 100;
  console.log({
    account: i,
    privateKey: key.getPrivate().toString(16),  
    publicKey: publicKey,   // this is the public key in hex (one address rather than x,y)
  });
}

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  console.log('Received a transaction...');
  console.log(req.body);
  const {sender, recipient, amount, signature} = req.body;
  // verify request using sender public key and signature
  bodyToVerify = JSON.stringify({
    sender, amount, recipient
  });
  const key = ec.keyFromPublic(sender, 'hex');
  const bodyHash = SHA256(bodyToVerify).toString();
  const valid = key.verify(bodyHash, signature);
  console.log(`Signature is ${valid ? 'valid' : 'invalid'}`);
  if (!valid) {
    console.log('Transaction failed!');
    res.status(400).send('Invalid signature');
  }
  else {
    // update sender balance
    balances[sender] -= amount;
    balances[recipient] = (balances[recipient] || 0) + +amount;
    console.log(`Updated balances`);
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

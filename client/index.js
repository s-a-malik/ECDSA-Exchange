import "./index.scss";

const server = "http://localhost:3042";
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
// initialize the elliptic curve context
const ec = new EC('secp256k1');

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
});


document.getElementById("transfer-amount").addEventListener('click', () => {
  const sender = document.getElementById("exchange-address").value;
  const amount = document.getElementById("send-amount").value;
  const recipient = document.getElementById("recipient").value;
  // make signature of transaction using private key
  const privateKey = document.getElementById("private-key").value;
  // if no private key, give an error
  if(privateKey === "") {
    alert("Please enter your private key before sending a transaction");
    return;
  }
  else {
    // this body is the message that will be signed
    const body = JSON.stringify({
      sender, amount, recipient
    });
    // hash the body
    const key = ec.keyFromPrivate(privateKey);
    const hash = SHA256(body).toString();
    const signature = key.sign(hash).toDER(); // this gives signature in DER format
    // add signature to body
    const bodyWithSignature = JSON.stringify({
      sender, amount, recipient, signature
    });
    // send the transaction
    const request = new Request(`${server}/send`, { method: 'POST', body: bodyWithSignature });
    fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
      if (response.ok) {
        alert("Transaction sent successfully");
        return response.json();
      } else {
        alert("Transaction not verified, check private key");
        throw new Error(response.statusText);
      }
    }).then(({ balance }) => {
      document.getElementById("balance").innerHTML = balance;
    });
  }
});

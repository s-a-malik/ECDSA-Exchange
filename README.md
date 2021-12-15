# ECSDSA Exchange Project

ChainShot Ethereum Dev Bootcamp.

Uses private key encryption on the client side to sign a transaction. The signature is then sent with the transaction details to the server side, which then verifies the identity of the sender using its public key.

If the signature does not match the sender, the transaction fails and the client is given an alert. If it is successful, the account balances are updated.

## Installing the Dependencies

To install the dependencies, simply navigate to the directory and use `npm install` to install the dependencies listed in the `package.json`.

## Running the Server

To run the server, navigate to the `/server` folder in a terminal window and run `node index`. Alternatively, use `nodemon index` to restart the server any time your server code changes.

On launch, the server will generate some random public and private keys corresponding to 3 accounts (all initialised with a balance of 100) which can be used for experimentation. These are printed to the console.

## Running the Client

To run the client, go to the `/client` folder in the repository and use parceljs on the `index.html`:

```bash
npx parcel index.html
```

Now you can navigate to your [localhost](://localhost:1234/) to run the application. To send money from a given account to another, you need to input the corresponding private key. Use the wrong private key and it won't work!

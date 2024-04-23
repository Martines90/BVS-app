## Setup local environment and test accounts


### setup blockchain environment (blockchain network with deployed BVS smart contract)

<ol>
  <li>Clone repository: https://github.com/Martines90/bvs-v0</li>
  <li>Run: yarn</li>
  <li>Run: yarn hardhat node</li>
</ol>

### Add Metamask

<ol>
  <li>Install Metamask Chrome/Firefox extension on desktop</li>
  <li>Add network (RPC url: http://127.0.0.1:8545/ ,Chain id: 31337, symbol: ETH)</li>
  <li>Import accounts (check your running hardhat network listed accounts - 0th account is ADMIN)</li>
</ol>

### Start local dev server

<ol>
  <li>Run: yarn</li>
  <li>Run: yarn start</li>
  <li>Visit http://localhost:8080/</li>
</ol>


## Run unit tests

- Run: yarn test
- Run: yarn test:coverage

## Manual testing


### setup environment

Using Ganache + Truffle

Installation:
download and install ganache from: https://archive.trufflesuite.com/ganache/
npm install -g truffle

- Start Ganache custom network
- Add Truffle config file path

- Deploy BVS_Roles / BVS_Voting smart contract
- Run: truffle console

### Time manipulation

In truffle console

Add time amount (in seconds)
Run: ```new Promise((resolve, reject) => {web3.currentProvider.send({jsonrpc: '2.0', method: 'evm_increaseTime', params: [5157652], id: new Date().getTime()}, (error, result) => {return resolve(result);})});```

Mine new block (this updates block.timestamp)
Run: ```new Promise((resolve, reject) => {web3.currentProvider.send({jsonrpc: '2.0', method: 'evm_mine', id: new Date().getTime()}, (err, result) => {const newBlockHash = web3.eth.getBlock('latest').hash; return resolve(newBlockHash);})})```

To check latest block timestamp:

Run: blockNum = await web3.eth.getBlockNumber()
Run: block = await web3.eth.getBlock(blockNum)
Run: block.timestamp

in browser you can "change" system time using a cookie variable

First install and connect to metamask
Add cookie FAKE_NOW=[timestamp in milliseconds]

- [Simple Generic Example](#simple-generic-example)
  - [Blockchain Example in TypeScript](#blockchain-example-in-typescript)
  - [Explanation](#explanation)
  - [Running the Code](#running-the-code)
- [Supply Chain Example](#supply-chain-example)
  - [Problem: Supply Chain Transparency](#problem-supply-chain-transparency)
  - [Solution with Blockchain](#solution-with-blockchain)
  - [TypeScript Code](#typescript-code)
  - [Explanation of the Code](#explanation-of-the-code)
  - [Example Output](#example-output)
  - [How This Solves the Problem](#how-this-solves-the-problem)
  - [Running the Code](#running-the-code-1)

## Simple Generic Example

Here's a simple example of a blockchain implemented in TypeScript to demonstrate its usage. This basic blockchain supports adding transactions and validating the integrity of the chain.

### Blockchain Example in TypeScript

```typescript
class Block {
  index: number
  timestamp: string
  data: any
  previousHash: string
  hash: string

  constructor(index: number, timestamp: string, data: any, previousHash: string = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
  }

  calculateHash(): string {
    const dataToHash = `${this.index}${this.timestamp}${JSON.stringify(this.data)}${this.previousHash}`
    return require('crypto').createHash('sha256').update(dataToHash).digest('hex')
  }
}

class Blockchain {
  chain: Block[]

  constructor() {
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock(): Block {
    return new Block(0, new Date().toISOString(), 'Genesis Block', '0')
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash
    newBlock.hash = newBlock.calculateHash()
    this.chain.push(newBlock)
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }
}

// Example usage
const myBlockchain = new Blockchain()

// Adding blocks to the blockchain
myBlockchain.addBlock(new Block(1, new Date().toISOString(), { amount: 100 }))
myBlockchain.addBlock(new Block(2, new Date().toISOString(), { amount: 50 }))

// Display the blockchain
console.log(JSON.stringify(myBlockchain, null, 4))

// Verify the blockchain
console.log('Is blockchain valid?', myBlockchain.isChainValid())

// Tamper with the blockchain (for testing purposes)
myBlockchain.chain[1].data = { amount: 1000 } // Modifying the data
myBlockchain.chain[1].hash = myBlockchain.chain[1].calculateHash() // Recalculating the hash

console.log('Is blockchain valid after tampering?', myBlockchain.isChainValid())
```

### Explanation

1. **Block Class**: Represents a block in the blockchain. Each block contains:

   - `index`: Position in the chain.
   - `timestamp`: Time of creation.
   - `data`: Transaction data (e.g., amount transferred).
   - `previousHash`: Hash of the previous block.
   - `hash`: Current block's hash.

2. **Blockchain Class**: Represents the blockchain, which is an array of blocks.

   - **Genesis Block**: The first block in the chain, hardcoded for simplicity.
   - **Add Block**: Appends a new block to the chain after computing its hash.
   - **Validate Chain**: Checks if the blockchain is intact by verifying hashes.

3. **Example Usage**:
   - Creates a blockchain, adds blocks, and validates its integrity.
   - Demonstrates tampering and shows how validation detects inconsistencies.

### Running the Code

1. Save this file as `blockchain.ts`.
2. Run it using Node.js with `ts-node`:
   ```bash
   npx ts-node blockchain.ts
   ```

This example illustrates blockchain fundamentals like immutability and cryptographic hashing.

## Supply Chain Example

Here’s a real-world example of using blockchain for **supply chain management**. This implementation tracks the movement of products through the supply chain, ensuring transparency and immutability.

### Problem: Supply Chain Transparency

In a supply chain, products move through multiple stages (e.g., manufacturer → distributor → retailer). It's crucial to track the journey of products to ensure authenticity and detect tampering.

### Solution with Blockchain

Using blockchain, we can log each stage of the product's journey. Each block represents a stage in the supply chain, storing data like location, timestamp, and status.

### TypeScript Code

```typescript
class Block {
  index: number
  timestamp: string
  data: any
  previousHash: string
  hash: string

  constructor(index: number, timestamp: string, data: any, previousHash: string = '') {
    this.index = index
    this.timestamp = timestamp
    this.data = data
    this.previousHash = previousHash
    this.hash = this.calculateHash()
  }

  calculateHash(): string {
    const dataToHash = `${this.index}${this.timestamp}${JSON.stringify(this.data)}${this.previousHash}`
    return require('crypto').createHash('sha256').update(dataToHash).digest('hex')
  }
}

class SupplyChain {
  chain: Block[]

  constructor() {
    this.chain = [this.createGenesisBlock()]
  }

  createGenesisBlock(): Block {
    return new Block(0, new Date().toISOString(), 'Genesis Block - Product Created', '0')
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]
  }

  addBlock(data: any): void {
    const latestBlock = this.getLatestBlock()
    const newBlock = new Block(latestBlock.index + 1, new Date().toISOString(), data, latestBlock.hash)
    this.chain.push(newBlock)
  }

  isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]
      const previousBlock = this.chain[i - 1]

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false
      }
    }
    return true
  }
}

// Example usage: Supply Chain Tracking
const supplyChain = new SupplyChain()

// Step 1: Manufacturer creates the product
supplyChain.addBlock({ stage: 'Manufacturing', details: 'Product manufactured at factory A' })

// Step 2: Product shipped to distributor
supplyChain.addBlock({ stage: 'Shipping', details: 'Shipped to Distributor X' })

// Step 3: Product received by distributor
supplyChain.addBlock({ stage: 'Distributor', details: 'Received by Distributor X' })

// Step 4: Product delivered to retailer
supplyChain.addBlock({ stage: 'Retail', details: 'Delivered to Retailer Y' })

// Display the supply chain data
console.log('Supply Chain Data:')
console.log(JSON.stringify(supplyChain, null, 4))

// Validate the supply chain
console.log('Is supply chain valid?', supplyChain.isChainValid())

// Attempt to tamper with the supply chain (for testing)
supplyChain.chain[2].data = { stage: 'Tampering', details: 'Modified data' }

console.log('Is supply chain valid after tampering?', supplyChain.isChainValid())
```

### Explanation of the Code

1. **Genesis Block**: Represents the creation of the product.
2. **Stages**: Each new block represents a stage in the supply chain.
3. **Tamper Detection**: Modifying a block invalidates the chain, ensuring integrity.

### Example Output

1. Initial Blockchain:

   ```json
   [
     {
       "index": 0,
       "timestamp": "2024-11-28T12:00:00.000Z",
       "data": "Genesis Block - Product Created",
       "previousHash": "0",
       "hash": "..."
     },
     {
       "index": 1,
       "timestamp": "2024-11-28T12:01:00.000Z",
       "data": {
         "stage": "Manufacturing",
         "details": "Product manufactured at factory A"
       },
       "previousHash": "...",
       "hash": "..."
     }
   ]
   ```

2. Validation Status:

   ```
   Is supply chain valid? true
   ```

3. After Tampering:
   ```
   Is supply chain valid after tampering? false
   ```

### How This Solves the Problem

- **Immutability**: The blockchain prevents unauthorized changes.
- **Transparency**: All supply chain stages are traceable.
- **Accountability**: Each participant can verify the product's journey.

### Running the Code

1. Save the file as `supplyChain.ts`.
2. Run it with `ts-node`:
   ```bash
   npx ts-node supplyChain.ts
   ```

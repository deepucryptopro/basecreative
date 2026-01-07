# BaseCreative

A decentralized design studio built on Base. Create simple designs, save them to IPFS, and register them onchain.

## Features
- **Design Editor**: HTML5 Canvas-based editor (Fabric.js).
- **Decentralized Storage**: Save designs and metadata to IPFS via web3.storage.
- **Onchain Registry**: (Optional) Save your design CID to a smart contract on Base.
- **Wallet Connection**: Connect with Coinbase Wallet or Metamask via Wagmi.

## Getting Started

### Prerequisites
- Node.js 18+
- [web3.storage](https://web3.storage/) Account (Classic token)

### Installation
1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Set up environment variables:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   #### Setting the Token Locally
   1. Go to [web3.storage](https://web3.storage/) (Classic) or your storage provider.
   2. Create a new API Token.
   3. Open `.env.local` and set:
      ```
      NEXT_PUBLIC_WEB3_STORAGE_TOKEN=your_token_here
      ```
   
   #### Setting the Token in Vercel
   1. Go to your project settings in Vercel.
   2. Navigate to **Environment Variables**.
   3. Add a new variable:
      - **Key**: `NEXT_PUBLIC_WEB3_STORAGE_TOKEN`
      - **Value**: `paste_your_token_here`
   4. Redeploy your application.

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Deployment

### Vercel
1. Push to GitHub.
2. Import project to Vercel.
3. Add the Environment Variables in Vercel settings.
4. Deploy.

### Smart Contract
The current contract address is a placeholder. To enable onchain saves:
1. Deploy your registry contract to Base.
2. Update `src/utils/contract.ts` with the new address.
3. Update the ABI if necessary.

## Farcaster / Base Mini App
The project includes a `.well-known/farcaster.json` file for Mini App support.
- You must manually sign the `accountAssociation` and update the file before live testing as a Frame/App.

## License
MIT

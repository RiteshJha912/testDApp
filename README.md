# GAS.TIPS - Web3 Tip Jar

A decentralized application (dApp) built on Ethereum that allows users to send cryptocurrency tips with personalized messages. This project demonstrates a complete Web3 stack including smart contract development, deployment, and a modern React frontend.

##  Features

- **Send Tips**: Users can send ETH tips with their name and a custom message
- **View History**: Browse all previous tips and messages in chronological order
- **MetaMask Integration**: Seamless wallet connection using MetaMask
- **Real-time Updates**: Automatic refresh after successful transactions
- **Responsive Design**: Modern, mobile-friendly user interface

## 🛠 Tech Stack

### Backend (Smart Contract)

- **Solidity**: Smart contract programming language
- **Hardhat**: Ethereum development environment
- **Ethers.js**: Ethereum library for interacting with the blockchain
- **Sepolia Testnet**: Ethereum test network for deployment

### Frontend

- **React 19**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Ethers.js**: For blockchain interaction in the browser
- **CSS3**: Custom styling with modern design patterns

### Development Tools

- **Hardhat Toolbox**: Collection of Hardhat plugins
- **TypeChain**: TypeScript bindings for Ethereum smart contracts
- **ESLint**: Code linting and formatting
- **MetaMask**: Browser extension for Ethereum wallet management

##  Project Structure

```
chaidapp/
├── contracts/                 
│   └── chai.sol             
├── scripts/                  
│   └── deploy.js            
├── ignition/                 
│   └── modules/
│       └── Lock.js         
├── client/                   
│   ├── public/
│   ├── src/                 
│   │   ├── App.jsx          
│   │   ├── Buy.jsx          
│   │   ├── Memos.jsx       
│   │   │   ├── App.jsx      
│   │   │   ├── Buy.jsx      
│   │   │   └── Memos.jsx    
│   │   ├── contractJson/    
│   │   │   └── chai.json             
│   ├── package.json         
│   ├── vite.config.js     
│   └── eslint.config.js    
├── artifacts/             
├── cache/                   
├── hardhat.config.js        
├── package.json             
└── README.md               
```

##  Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension
- **Git** for version control

### Backend Setup (Smart Contracts)

1. **Clone the repository**

   ```bash
   git clone https://github.com/RiteshJha912/testDApp.git
   cd chaidapp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   - Create a `.env` file in the root directory
   - Add your Sepolia testnet RPC URL and private key:

   ```env
   SEPOLIA_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
   PRIVATE_KEY=your_private_key_without_0x_prefix
   ```

4. **Compile contracts**

   ```bash
   npx hardhat compile
   ```

5. **Deploy to Sepolia testnet**
   ```bash
   npx hardhat ignition deploy ./ignition/modules/Lock.js --network sepolia
   ```

### Frontend Setup (React App)

1. **Navigate to client directory**

   ```bash
   cd client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Update contract address** (if deployed to a new address)

   - Open `src/App.jsx`
   - Replace the `contractAddress` variable with your deployed contract address

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

##  Usage

1. **Connect Wallet**: Click to connect your MetaMask wallet
2. **Send a Tip**:
   - Enter your handle/name
   - Write a message
   - Click "SEND GAS.TIP" (sends 0.001 ETH)
3. **View Tips**: Scroll down to see all previous tips and messages

##  Smart Contract Details


**Struct**:

```solidity
struct Memo {
    string name;
    string message;
    uint timestamp;
    address from;
}
```

##  Security Considerations

- Contract requires payment > 0 ETH
- Owner receives all funds directly
- No reentrancy protection needed (simple transfer)
- Front-end validation for user inputs

##  Deployment

### Contract Deployment

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.js --network sepolia
```

### Frontend Deployment

```bash
cd client
npm run build
# Deploy the dist/ folder to your hosting service (Vercel, Netlify, etc.)
```

##  Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

The readme is full of AI bullshit will write when i get time!!

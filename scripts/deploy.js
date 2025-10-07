// scripts/deploy.js
const hre = require('hardhat')

async function main() {
  // 1. Fetching bytecode and ABI (Same in v5 and v6)
  const Chai = await hre.ethers.getContractFactory('chai')

  // 2. Creating an instance and deploying (Same in v5 and v6)
  // This line now waits for deployment to complete!
  const chai = await Chai.deploy()

  // 3. Get the contract address using the v6 method
  const address = await chai.getAddress()

  // 4. Log the deployed address
  console.log('Deployed contract address:', `${address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

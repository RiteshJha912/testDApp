import { useState, useEffect } from 'react'
import chaiJson from './contractJson/chai.json'
import { ethers } from 'ethers'
import './App.css'

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  })

  const [account, setAccount] = useState('Not connected')

  useEffect(() => {
    const template = async () => {
      const contractAddress = '0x0158180938B2595eDaFBF1216E6A261D77E55C27'
      const contractABI = chaiJson.abi

      try {
        const { ethereum } = window

        if (!ethereum) {
          alert('Please install MetaMask!')
          return
        }

        console.log('Requesting accounts...')
        const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
        })

        setAccount(accounts[0])
        console.log('Connected account:', accounts[0])

        let provider, signer
        if (ethers.providers && ethers.providers.Web3Provider) {
          provider = new ethers.providers.Web3Provider(ethereum)
        } else {
          provider = new ethers.BrowserProvider(ethereum)
        }
        signer = await provider.getSigner()

        console.log('Provider:', provider)
        console.log('Signer:', signer)

        console.log('Raw JSON:', chaiJson)
        console.log('Contract ABI:', contractABI)

        if (
          !contractABI ||
          !Array.isArray(contractABI) ||
          contractABI.length === 0
        ) {
          console.error(
            'Invalid ABI: Ensure chai.json contains a valid ABI array'
          )
          return
        }

        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        )
        
        const memos = await contract.getMemos()
        console.log('Memos:', memos)

        console.log('Contract:', contract)
        console.dir(contract, { depth: null })
        console.log('Contract Address:', contractAddress) // Use the provided address
        console.log('Contract Interface:', contract.interface)
        // Avoid contract.functions in v6; list functions via interface
        console.log(
          'Contract Function Names:',
          contract.interface.fragments
            .filter((f) => f.type === 'function')
            .map((f) => f.name)
        )
        console.log('Contract Filters:', contract.filters)

        setState({ provider, signer, contract })
      } catch (error) {
        console.error('Error connecting to contract:', error)
      }
    }
    template()
  }, [])

  return (
    <div className='App'>
      <h3>Connected Account: {account}</h3>
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import chaiJson from './contractJson/chai.json'
import { ethers } from 'ethers'
import Buy from './Buy'
import Memos from './Memos'
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

        // Handle ethers v6 (new) and v5 (legacy) compatibility
        let provider, signer

        if (ethers.BrowserProvider) {
          // ethers v6
          provider = new ethers.BrowserProvider(ethereum)
          signer = await provider.getSigner()
        } else if (ethers.providers && ethers.providers.Web3Provider) {
          // ethers v5
          provider = new ethers.providers.Web3Provider(ethereum)
          signer = provider.getSigner()
        }

        console.log('Provider:', provider)
        console.log('Signer:', signer)

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

        console.log('Contract:', contract)

        // Test contract connection
        try {
          const memos = await contract.getMemos()
          console.log('Memos fetched successfully:', memos)
        } catch (error) {
          console.error('Error fetching memos:', error)
        }

        setState({ provider, signer, contract })
      } catch (error) {
        console.error('Error connecting to contract:', error)
      }
    }

    template()
  }, [])

  return (
    <div className='App'>
      <header className='app-header'>
        <div className='header-content'>
          <h1 className='logo'>
            <span className='logo-bracket'>[</span>
            <span className='logo-text'>GAS.TIPS</span>
            <span className='logo-bracket'>]</span>
          </h1>
          <p className='tagline'>PROOF OF APPRECIATION</p>
        </div>
        <div className='account-info'>
          <span className='account-label'>CONNECTED WALLET</span>
          <div className='account-box'>
            <span className='account-indicator'></span>
            <span className='account-address'>{account}</span>
          </div>
        </div>
      </header>

      <main className='app-main'>
        <Buy state={state} />
        <Memos state={state} />
      </main>

      <footer className='app-footer'>
        <div className='footer-grid'>
          <div className='footer-item'>DECENTRALIZED</div>
          <div className='footer-divider'></div>
          <div className='footer-item'>TRUSTLESS</div>
          <div className='footer-divider'></div>
          <div className='footer-item'>IMMUTABLE</div>
        </div>
        <p className='footer-text'>
          Built with ❤️ on chain by{' '}
          <a
            href='https://github.com/RiteshJha912'
            target='_blank'
            rel='noopener noreferrer'
            style={{ color: 'inherit', textDecoration: 'underline' }} // Optional: basic styling, adjust as needed
          >
            Ritzardous
          </a>
        </p>{' '}
      </footer>
    </div>
  )
}

export default App

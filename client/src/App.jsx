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
          console.log('Please install MetaMask!')
          return
        }

        // Check for existing accounts WITHOUT prompting popup
        const accounts = await ethereum.request({
          method: 'eth_accounts',
        })

        if (accounts.length > 0) {
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
        } else {
          console.log('No authorized account found')
        }
      } catch (error) {
        console.error('Error connecting to contract:', error)
      }
    }
    template()
  }, [])

  const connectWallet = async () => {
    console.log('Connect button clicked')
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
      console.log('Accounts received:', accounts)
      
      if (!accounts || accounts.length === 0) {
        alert('No accounts found. Please unlock MetaMask.')
        return
      }

      setAccount(accounts[0])
      console.log('Connected account:', accounts[0])

      let provider, signer
      if (ethers.BrowserProvider) {
        provider = new ethers.BrowserProvider(ethereum)
        signer = await provider.getSigner()
      } else if (ethers.providers && ethers.providers.Web3Provider) {
        provider = new ethers.providers.Web3Provider(ethereum)
        signer = provider.getSigner()
      }

      const contract = new ethers.Contract(contractAddress, contractABI, signer)

      setState({ provider, signer, contract })
    } catch (error) {
      console.error('Error connecting to contract:', error)
      if (error.code === 4001) {
         alert('Please connect to MetaMask.')
      } else if (error.code === -32002 || (error.message && error.message.includes('already pending'))) {
         alert('A Meta Mask request is already pending. Please open your MetaMask extension to approve it.')
      } else {
         alert('Failed to connect wallet: ' + (error.message || error))
      }
    }
  }

  const switchAccount = async () => {
    try {
      const { ethereum } = window
      if (!ethereum) {
        alert('Please install MetaMask!')
        return
      }
      
      await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })
      
      // After permission change, we need to get the new accounts
      const accounts = await ethereum.request({
        method: 'eth_accounts',
      })
      
      if (accounts.length > 0) {
        setAccount(accounts[0])
        // Re-initialize provider/signer with new account
        let provider, signer
        if (ethers.BrowserProvider) {
          provider = new ethers.BrowserProvider(ethereum)
          signer = await provider.getSigner()
        } else if (ethers.providers && ethers.providers.Web3Provider) {
          provider = new ethers.providers.Web3Provider(ethereum)
          signer = provider.getSigner()
        }
        
        // Re-connect contract
        const contractAddress = '0x0158180938B2595eDaFBF1216E6A261D77E55C27'
        const contractABI = chaiJson.abi
        const contract = new ethers.Contract(contractAddress, contractABI, signer)
        
        setState({ provider, signer, contract })
      }
    } catch (error) {
      console.error('Error switching accounts:', error)
    }
  }

  const disconnectWallet = () => {
    setState({
      provider: null,
      signer: null,
      contract: null,
    })
    setAccount('Not connected')
    console.log('Wallet disconnected')
  }

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
          {account === 'Not connected' ? (
            <button className='account-box connect-btn' onClick={connectWallet}>
              <span className='account-indicator'></span>
              <span className='account-address'>CLICK TO CONNECT</span>
            </button>
          ) : (
            <div className='account-box'>
              <span className='account-indicator'></span>
              <span className='account-address'>{account}</span>
            </div>
          )}
          {account !== 'Not connected' && (
            <div className="button-group">
               <button className='action-btn switch-btn' onClick={switchAccount}>
                SWITCH
              </button>
              <button className='action-btn disconnect-btn' onClick={disconnectWallet}>
                DISCONNECT
              </button>
            </div>
          )}
        </div>
      </header>
      <main className='app-main'>
        <Buy state={state} />
        <Memos state={state} />
      </main>
      <footer className='app-footer'>
        <div className='footer-grid'>
          <div className='footer-item'>TRUSTLESS</div>
          <div className='footer-divider'></div>
          <div className='footer-item'>DECENTRALIZED</div>
          <div className='footer-divider'></div>
          <div className='footer-item'>IMMUTABLE</div>
        </div>
        <div className='footer-social'>
          <a
            href='https://github.com/RiteshJha912/testDApp'
            target='_blank'
            rel='noopener noreferrer'
            className='github-pill'
          >
            <svg
              className='github-icon'
              viewBox='0 0 16 16'
              width='20'
              height='20'
              fill='currentColor'
              aria-hidden='true'
            >
              <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z'></path>
            </svg>
            <span className='github-text'>Star on GitHub</span>
            <div className='star-badge'>
              <svg
                viewBox='0 0 16 16'
                width='12'
                height='12'
                fill='currentColor'
                className='star-icon'
              >
                <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z'></path>
              </svg>
            </div>
          </a>
        </div>
        <p className='footer-text'>
          Built with
          <svg
            className='heart-icon'
            viewBox='0 0 24 24'
            width='12'
            height='12'
            fill='none'
            stroke='red'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{ margin: '0 4px', verticalAlign: 'middle' }}
          >
            <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'></path>
          </svg>
          on chain by{' '}
          <a
            href='https://github.com/RiteshJha912'
            target='_blank'
            rel='noopener noreferrer'
            className='creator-link'
          >
            Ritzardous
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App

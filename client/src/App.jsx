import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import './App.css'

function App() {
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  })

  useEffect(() => {
    const template = async () => {
      const contractAddress = ''
      const contractABI = ''

      const { ethereum } = window

      const account = await ethereum.request({
        method: 'eth_requestAccounts',
      })
    }

    template()
  }, [])

  return <div className='App'></div>
}

export default App

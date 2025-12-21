import { ethers } from 'ethers'
import './Buy.css'

const Buy = ({ state }) => {
  const buyChai = async (event) => {
    event.preventDefault()
    const { contract } = state

    if (!contract) {
      alert('Contract not loaded. Please connect your wallet.')
      return
    }

    const name = document.querySelector('#name').value
    const message = document.querySelector('#message').value

    try {
      console.log('Sending transaction...')
      const amount = { value: ethers.parseEther('0.001') }
      const transaction = await contract.buyChai(name, message, amount)
      console.log('Transaction sent:', transaction.hash)

      await transaction.wait()
      console.log('Transaction confirmed!')

      alert('Transaction is successful')
      window.location.reload()
    } catch (error) {
      console.error('Transaction failed:', error)
      alert('Transaction failed: ' + (error.reason || error.message))
    }
  }

  return (
    <div className='center'>
      <div className='form-header'>
        <div className='header-decoration'>
          <div className='decoration-line'></div>
          <div className='decoration-square'></div>
          <div className='decoration-line'></div>
        </div>
        <h1>SEND GAS.TIP</h1>
        <p className='form-subtitle'>BLOCKCHAIN APPRECIATION PROTOCOL</p>
      </div>

      <form onSubmit={buyChai}>
        <div className='inputbox'>
          <input type='text' required='required' id='name' />
          <span>YOUR HANDLE</span>
          <div className='input-line'></div>
        </div>

        <div className='inputbox'>
          <input type='text' required='required' id='message' />
          <span>MESSAGE PAYLOAD</span>
          <div className='input-line'></div>
        </div>

        <div className='transaction-info'>
          <div className='info-row'>
            <span className='info-label'>AMOUNT</span>
            <span className='info-value'>0.001 ETH</span>
          </div>
          <div className='info-row'>
            <span className='info-label'>NETWORK</span>
            <span className='info-value'>ETHEREUM</span>
          </div>
        </div>

        <div className='inputbox'>
          <button
            type='submit'
            disabled={!state.contract}
            className={`submit-button ${!state.contract ? 'disabled' : ''}`}
          >
            EXECUTE TRANSACTION
          </button>
        </div>
      </form>
    </div>
  )
}

export default Buy

import { useState, useEffect } from 'react'
import './Memos.css'

const Memos = ({ state }) => {
  const [memos, setMemos] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(5)
  const { contract } = state

  useEffect(() => {
    const memosMessage = async () => {
      try {
        setLoading(true)
        const memos = await contract.getMemos()
        console.log('Fetched memos:', memos)
        // Reverse to show latest first (assuming contract returns chronological order)
        setMemos([...memos].reverse())
      } catch (error) {
        console.error('Error fetching memos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (contract) {
      memosMessage()
    }
  }, [contract])

  if (!contract) {
    return (
      <div className='memos-container'>
        <div className='status-message'>
          <div className='status-icon'>⚠</div>
          <p className='no-contract'>WALLET CONNECTION REQUIRED</p>
          <p className='status-subtitle'>
            Initialize Web3 provider to view transaction log
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='memos-container'>
        <div className='status-message'>
          <div className='loading-spinner'>
            <div className='spinner-square'></div>
            <div className='spinner-square'></div>
            <div className='spinner-square'></div>
            <div className='spinner-square'></div>
          </div>
          <p className='loading'>LOADING TRANSACTION LOG...</p>
        </div>
      </div>
    )
  }

  /* Helper functions */
  const shortenAddress = (address) => {
    return `${address.slice(0, 5)}...${address.slice(address.length - 4)}`
  }

  const loadMore = () => {
    setVisibleCount((prev) => prev + 5)
  }

  return (
    <div className='memos-container'>
      <div className='memos-header'>
        <div className='header-decoration'>
          <div className='decoration-line'></div>
          <div className='decoration-square'></div>
          <div className='decoration-line'></div>
        </div>
        <h3 className='memos-title'>TRANSACTION LOG</h3>
        <p className='memos-subtitle'>ON-CHAIN MESSAGE HISTORY</p>
        {memos.length > 0 && (
          <div className='memo-count'>
            <span className='count-number'>{memos.length}</span>
            <span className='count-label'>TRANSACTIONS</span>
          </div>
        )}
      </div>

      {memos.length === 0 ? (
        <div className='empty-state'>
          <div className='empty-icon'>[ ]</div>
          <p className='no-memos'>NO TRANSACTIONS RECORDED</p>
          <p className='empty-subtitle'>
            Be the first to execute a gas.tip transaction
          </p>
        </div>
      ) : (
        <div className='table-wrapper'>
          <table className='memos-table'>
            <thead>
              <tr>
                <th>
                  <span className='th-content'>HANDLE</span>
                </th>
                <th>
                  <span className='th-content'>TIMESTAMP</span>
                </th>
                <th>
                  <span className='th-content'>PAYLOAD</span>
                </th>
                <th>
                  <span className='th-content'>FROM ADDRESS</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {memos.slice(0, visibleCount).map((memo, index) => {
                return (
                  <tr key={index} className='memo-row'>
                    <td className='name-cell'>
                      <span className='cell-marker'>//</span>
                      {memo.name}
                    </td>
                    <td className='timestamp-cell'>
                      {new Date(Number(memo.timestamp) * 1000).toLocaleString()}
                    </td>
                    <td className='message-cell'>{memo.message}</td>
                    <td className='address-cell' title={memo.from}>
                      <span className='address-prefix'>0x</span>
                      {shortenAddress(memo.from)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {visibleCount < memos.length && (
            <div className='load-more-container'>
              <button className='load-more-btn' onClick={loadMore}>
                LOAD MORE TRANSACTIONS
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Memos

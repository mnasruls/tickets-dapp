import { ethers } from 'ethers'

const Navigation = ({ account, setAccount }) => {
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
  }
  return (
    <nav>
      <div className='nav__brand'>
        <h1>TicketsDapp</h1>

        <input className='nav__search' type='text' placeholder='Search...'/>

        <ul className='nav__links'>
          <li><a href='/'>Home</a></li>
          <li><a href='/'>Events</a></li>
          <li><a href='/'>Tickets</a></li>
        </ul>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...'+ account.slice(38, 42)}
        </button>
      ):(
        <button
          type="button"
          className='nav__connect'
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      )}
    </nav>
  );
}

export default Navigation;
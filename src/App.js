import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Sort from './components/Sort'
import Card from './components/Card'
import SeatChart from './components/SeatChart'

// ABIs
import TicketsDapp from './abis/TicketsDapp.json'

// Config
import config from './config.json'

function App() {
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)
  const [provider, setProvider] = useState(null)
  const [occasions, setOccasions] = useState([])

  const [occasion, setOccasion] = useState({})
  const [toggle, setToggle] = useState(false)
  const loadBlockchainData = async () => { 
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    const contract = new ethers.Contract(config[network.chainId].TicketsDapp.address, TicketsDapp, provider)
    setContract(contract)

    const totalOccasions = await contract.idCounter()
    const occasions = []
    for (let i = 1; i <= totalOccasions.toNumber(); i++) {
      const occasion = await contract.getOccasion(i)
      occasions.push(occasion)
    }
    setOccasions(occasions)

    window.ethereum.on('accountsChanged', async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0])
      setAccount(account)
    })
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])
  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount}/>
        <h2 className="header__title"><strong>Welcome to TicketsDapp</strong></h2>
      </header>

      <Sort occasions={occasions} setOccasions={setOccasions} />

      <div className='cards'>
        {occasions.map((occasion, index) => (
          <Card 
            occasion={occasion}
            id={index + 1}
            ticketsDapp={contract}
            provider={provider}
            account={account}
            toggle={toggle}
            setToggle={setToggle}
            setOccasion={setOccasion}
            key={index} 
          />
        ))}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          ticketsDapp={contract}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;
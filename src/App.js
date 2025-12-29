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

  return (
    <div>
      <header>

        <h2 className="header__title"><strong>Welcome to TicketsDapp</strong></h2>
      </header>

    </div>
  );
}

export default App;
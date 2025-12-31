import { useEffect, useState } from 'react'

// Import Components
import Seat from './Seat'

// Import Assets
import close from '../assets/close.svg'

const SeatChart = ({ occasion, ticketsDapp, provider, setToggle }) => {
  const [seatsTaken, setSeatsTaken] = useState(false)
  const [hasSold, setHasSold] = useState(false)

  const getSeatsTaken = async () => {
    const seatsTaken = await ticketsDapp.getSeatsHasTaken(occasion.id)
    setSeatsTaken(seatsTaken)
  }

  const buyHandler = async (_seat) => {
    setHasSold(false)

    const signer = await provider.getSigner()
    const tx = await ticketsDapp.connect(signer).mintTicket(occasion.id, _seat, {
      value: occasion.price,
    })
    await tx.wait()
    setHasSold(true)
  }

  useEffect(() => {
    getSeatsTaken()
  }, [hasSold])

  
  const total = Number(occasion.totalTickets)
  const sideMax = 25
  const sideEach = Math.min(sideMax, Math.floor(total / 4))
  const leftCount = sideEach
  const rightCount = sideEach
  const middleCount = Math.max(0, total - (leftCount + rightCount))
  const centerStep = leftCount + 1
  const rightStep = leftCount + middleCount + 1
  
  const leftRows = 5
  const centerRows = 15
  const rightRows = 5
  
  return (
    <div className="occasion">
      <div className="occasion__seating">
        <h1>{occasion.name} Seating Map</h1>

        <button onClick={() => setToggle(false)} className="occasion__close">
          <img src={close} alt="Close"/>
        </button>

        <div className="occasion__stage">
          <strong>STAGE</strong>
        </div>

        {seatsTaken && Array(leftCount).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={1}
            columnStart={0}
            maxColumns={5}
            rowStart={2}
            maxRows={leftRows}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--1">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(middleCount).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={centerStep}
            columnStart={6}
            maxColumns={15}
            rowStart={2}
            maxRows={centerRows}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}

        <div className="occasion__spacer--2">
          <strong>WALKWAY</strong>
        </div>

        {seatsTaken && Array(rightCount).fill(1).map((e, i) =>
          <Seat
            i={i}
            step={rightStep}
            columnStart={22}
            maxColumns={5}
            rowStart={2}
            maxRows={rightRows}
            seatsTaken={seatsTaken}
            buyHandler={buyHandler}
            key={i}
          />
        )}
      </div>
    </div >
  );
}

export default SeatChart;
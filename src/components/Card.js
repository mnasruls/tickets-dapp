import { ethers } from 'ethers'

const Card = ({ occasion, toggle, setToggle, setOccasion }) => {
  const togglePopup = () => {
    setOccasion(occasion)
    toggle ? setToggle(false) : setToggle(true)
  }
  return (
    <div className='card'>
      <div className='card__info'>
        <p className='card__date'>
          <strong>{occasion.date}</strong><br />{occasion.time}
        </p>

        <h3 className='card__name'>{occasion.name}</h3>

        <p className='card__location'>{occasion.location}</p>

        <p className='card__cost'>
          <strong>{ethers.utils.formatUnits(occasion.price.toString(), "ether")}</strong> ETH
        </p>

        {occasion.totalTickets.toString() === "0" ? (
          <button
            type="button"
            className='card__button-out'
            disabled
          >
            Sold Out
          </button>
        ) : (
          <button
            type="button"
            className='card__button'
            onClick={() => togglePopup()}
          >
            View Seats
          </button>
        )}
      </div>
      <hr />
    </div >
  );
}

export default Card;
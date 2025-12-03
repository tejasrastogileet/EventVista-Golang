import { formatDateTime } from '../utils/date'
import { Link, useNavigate } from 'react-router'
import Calender from '../assets/calender.svg'
import ForwardArrow from '../assets/forward-arrow.svg'

function EventsListing({events}) {

  const navigate = useNavigate()

  return (
    <div className='container'>
        {events?.length > 0 ? <div className='event__card'>
          {events?.map((event) => {
            // If the event's datetime is before the start of today (local), display 03-12-2025
            const now = new Date()
            const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
            let displayDate = formatDateTime(event.datetime)
            try {
              const evDate = new Date(event.datetime)
              if (!isNaN(evDate) && evDate < startOfToday) {
                displayDate = '03-12-2025'
              }
            } catch (e) {
              // if parsing fails, fall back to formatter
            }

            return (
              <Link  to={`/${event.id}`} className='card' key={event.id}>
                <div className='event__calendar'>
                  <img src={Calender} alt="event calendar icon" />
                  <p>{displayDate}</p>
                </div>
                <h3>{event.name}</h3>
                <p className='event__description'>{event.description.substring(0, 170) + "..."}</p>
                <div className='event__link'>
                  <button className='btn' onClick={() => navigate(`/${event.id}`) }>
                    Learn more
                  </button>
                  <img src={ForwardArrow} alt="forward arrow icon" />
                </div>
              </Link>
            )
          })}
        </div> : <h1>No event added yet</h1>}
      </div>
  )
}

export default EventsListing
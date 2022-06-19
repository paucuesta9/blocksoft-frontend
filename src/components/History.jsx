import styles from '@/styles/History.module.css'
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import React from 'react'

const History = ({ history }) => {
  return (
    <table className={styles.table}>
      <thead className={styles.head}>
        <tr>
          <th>Event</th>
          {/* <th>Price</th> */}
          <th>From</th>
          <th>To</th>
          <th>Date</th>
          <th />
        </tr>
      </thead>
      <tbody className={styles.body}>
        {history.map((event, index) => (
          <tr key={index} className={styles.row}>
            <td>{event.eventType === 'Transfer' && event.from === '0x0000000000000000000000000000000000000000' ? 'Minted' : event.eventType}</td>
            {/* <td><FontAwesomeIcon icon={faEthereum} /> {event.price} Eth</td> */}
            <td className={styles.link}><Link to={`/profile/${event.from}`}>{event.fromName}</Link></td>
            <td className={styles.link}><Link to={`/profile/${event.to}`}>{event.toName}</Link></td>
            <td>{event.date}</td>
            <td className={styles.link}><a href={`https://rinkeby.etherscan.io/tx/${event.hash}`} target='_blank' rel='noopener noreferrer'>View transaction <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></a></td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default History

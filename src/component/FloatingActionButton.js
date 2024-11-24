import { useState, useEffect  } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes, faCommentDots, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import styles from '../css/FloatingActionButton.module.css'

const actions = [
  { icon: faCommentDots, label: '채팅', color: styles.bgBlue, callback:()=>{} },
  { icon: faPhone, label: '전화', color: styles.bgGreen, callback:()=>{} },
  { icon: faEnvelope, label: '이메일', color: styles.bgRed, callback:()=>{} },
]

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.fabContainer}>
      <div className={`${styles.fabActions} ${isOpen ? styles.open : ''}`}>
        {actions.map((action, index) => (
          <button
            key={action.label}
            className={`${styles.fabAction} ${action.color}`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={action.callback()}
          >
            <FontAwesomeIcon icon={action.icon} />
            <span className={styles.fabTooltip}>{action.label}</span>
          </button>
        ))}
      </div>
      <button className={styles.fabMain} onClick={() => setIsOpen(!isOpen)}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faPlus} />
      </button>
      
    </div>
  )
}
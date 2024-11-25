import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useNavigate } from "react-router-dom";
import { faPlus, faTimes, faDownload, faHome, faCommentDots, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import styles from '../css/FloatingActionButton.module.css'

export function FloatingActionButton({buttomOption=1}) {

  const [isOpen, setIsOpen] = useState(false)
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const navigate = useNavigate();

  const handleInstallClick = () => {
    if (!deferredInstallPrompt) {
      console.log('설치 이벤트가 지원되지 않습니다.');
      return;
    }

    deferredInstallPrompt.prompt();

    deferredInstallPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('PWA 설치 완료');
      } else {
        console.log('PWA 설치 취소');
      }
      setDeferredInstallPrompt(null);
    });
  }

  const actions = [
    { icon: faDownload, label: '앱 설치', color: styles.bgBlue, callback: handleInstallClick },
    { icon: faHome, label: '홈으로 이동', color: styles.bgGreen, callback: () => { navigate("/"); } },
    // { icon: faEnvelope, label: '이메일', color: styles.bgRed, callback: () => {} },
  ]

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);


  return (
    <div style={{
      position: 'fixed',
      bottom: `${buttomOption}rem`,
      right: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 50,
    }}>
      <div className={`${styles.fabActions} ${isOpen ? styles.open : ''}`}>
        {actions.map((action, index) => (
          <button
            key={action.label}
            className={`${styles.fabAction} ${action.color}`}
            style={{ transitionDelay: `${index * 100}ms` }}
            onClick={action.callback}
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


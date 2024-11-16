import { useState } from 'react';
import styles from '../css/MakeGroupChat.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function CreateGroupChat() {
  const [groupName, setGroupName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Creating group:", groupName);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.iconButton}>
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
          </Link>
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.iconSection}>
            <FontAwesomeIcon icon={faUsers} className={styles.userIcon} />
            <h2 className={styles.formTitle}>새 그룹 채팅</h2>
            <p className={styles.formSubtitle}>그룹 채팅방의 이름을 입력하세요.</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              placeholder="그룹 채팅방 이름"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.submitButton}>
              그룹 만들기
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

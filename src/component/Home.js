import { useState } from 'react';
import styles from "../css/Home.module.css";
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function ChatMainScreen() {
  const [chats, setChats] = useState([
    { id: 1, name: "밥먹는 모임", lastMessage: "오늘 점심 뭐 먹을까요?", isGroup: true },
    { id: 2, name: "개발팀 채팅방", lastMessage: "새 기능 논의해요", isGroup: true },
    { id: 3, name: "주말 등산 모임", lastMessage: "이번 주 토요일 어떠세요?", isGroup: true },
  ]);

  return (
    <div className={styles.chatApp}>
      {/* Header */}
      <header className={styles.chatHeader}>
        <h1>채팅 앱</h1>
        <div className={styles.profileMenu}>
          <div className={styles.avatar}>
            <i className="fas fa-user-circle fa-2x"></i>
          </div>
        </div>
      </header>

      <main className={styles.chatMain}>
        <div className={styles.mainMessage}>
          <i className="fas fa-comments fa-4x text-gray-400"></i>
          <h2>채팅을 시작하세요</h2>
          <p>1:1 채팅을 시작하거나 그룹 채팅방을 만들어보세요.</p>
        </div>
        
        <div className={styles.actionButtons}>
          <Link to="/chat/random">
            <button className={styles.startChat}>
              <i className="fas fa-comment-alt"></i> 1:1 채팅 시작
            </button>
          </Link>
          <Link to="/create/groupchat">
            <button className={styles.createGroup}>
              <i className="fas fa-users"></i> 그룹 채팅 만들기
            </button>
          </Link>
          <Link to="/find/groupchat">
            <button className={styles.createGroup}>
              <i className="fas fa-users"></i> 그룹 채팅 찾기
            </button>
          </Link>
        </div>
      </main>

      {/* Recent Chats */}
      <footer className={styles.chatFooter}>
        <h2>최근 생성된 그룹 채팅</h2>
        <ul className={styles.chatList}>
          {chats.map((chat) => (
            <li key={chat.id} className={styles.chatItem}>
              <div className={styles.chatAvatar}>
                <i className="fas fa-user-circle fa-2x"></i>
              </div>
              <div className={styles.chatInfo}>
                <div className={styles.chatName}>{chat.name}</div>
                <div className={styles.chatMessage}>{chat.lastMessage}</div>
              </div>
              <i className="fas fa-users {styles.groupIcon}"></i>
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
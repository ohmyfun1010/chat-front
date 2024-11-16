import React, { useState } from 'react';
import styles from '../css/GroupChat.module.css'; // Import CSS module
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function GroupChatRoom() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: '김철수', content: '안녕하세요, 모두!', timestamp: '10:00 AM' },
    { id: 2, sender: '이영희', content: '반갑습니다 :)', timestamp: '10:02 AM' },
    { id: 3, sender: '박지성', content: '오늘 날씨가 좋네요.', timestamp: '10:05 AM' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: '나',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
      setMessage('');
    }
  };

  return (
    <div className={styles.groupChatContainer}>
      <header className={styles.groupChatHeader}>
        <Link to="/find/groupchat">
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon}/>
        </Link>
        <h1 className={styles.groupChatTitle}>밥먹는 모임</h1>
        <FontAwesomeIcon icon={faUsers} className={styles.groupIcon} />
      </header>
      <main className={styles.groupChatMain}>
        <div className={styles.groupMessages}>
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.groupMessage} ${msg.sender === '나' ? styles.groupMessageSelf : styles.groupMessageOther}`}>
              {msg.sender !== '나' && <p className={styles.groupSender}>{msg.sender}</p>}
              <div className="groupMessageContent">{msg.content}</div>
              <p className={styles.groupTimestamp}>{msg.timestamp}</p>
            </div>
          ))}
        </div>
      </main>
      <div className={styles.messageInput}>
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.inputField}
        />
        <button className={styles.sendButton} onClick={handleSendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

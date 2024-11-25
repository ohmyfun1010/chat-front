import { useState, useEffect } from "react";
import styles from "../css/Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import { callApi } from "../common/commonFunction";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "@fortawesome/fontawesome-free/css/all.min.css";
import FloatingActionButton from "./FloatingActionButton";

export default function ChatMainScreen() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([
    { id: 1, name: "밥먹는 모임", members: "5명" },
    { id: 2, name: "개발팀 채팅방", members: "5명" },
    { id: 3, name: "주말 등산 모임", members: "5명" },
  ]);

  useEffect(() => {
    findRecentGroupChat();
  }, []);

  const findRecentGroupChat = async () => {
    const url = "/api/chat/recent/group/3";
    try {
      const response = await callApi(url, "GET");
      if (response) {
        setChats(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const moveGroupChat = (roomId, roomName) => {
    const urlPath = "/chat/group/" + roomId + "/" + roomName;
    navigate(urlPath);
  };

  return (
    <div className={styles.chatApp}>
      {/* Header */}
      <header className={styles.chatHeader}>
        <Link to="/">
          <h1 className={styles.pointer}>뚠뚠이의 채팅교실</h1>
        </Link>
        <div className={styles.profileMenu}>
          <div className={styles.avatar}>
            <FontAwesomeIcon icon={faBullhorn} size="2x" />
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
        {chats.length > 0 ? (
          <ul className={styles.chatList}>
            {chats.map((chat, index) => (
              <li
                key={index}
                className={styles.chatItem}
                onClick={() => {
                  moveGroupChat(chat.roomId, chat.name);
                }}
              >
                <div className={styles.chatAvatar}>
                  <i className="fas fa-user-circle fa-2x"></i>
                </div>
                <div className={styles.chatInfo}>
                  <div className={styles.chatName}>
                    {"방이름 : " + chat.name}
                  </div>
                  <div className={styles.chatMessage}>
                    {"참가인원 : " + chat.members + "명"}
                  </div>
                </div>
                <i className="fas fa-users"></i>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.noChats}>
            <p>현재 생성된 그룹 채팅방이 없습니다.</p>
            <p>새로운 그룹 채팅을 만들어보세요.</p>
          </div>
        )}
      </footer>
      <FloatingActionButton />
    </div>
  );
}

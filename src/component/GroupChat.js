import React, { useState, useEffect } from "react";
import styles from "../css/GroupChat.module.css"; // Import CSS module
import { Link, useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUsers,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { wsGroupApi } from "../common/commonFunction";
import Swal from "sweetalert2";

export default function GroupChatRoom() {
  const [message, setMessage] = useState("");
  const [nickName, setNickName] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    // {
    //   id: 1,
    //   sender: "김철수",
    //   content: "안녕하세요, 모두!",
    //   timestamp: "10:00 AM",
    // },
    // {
    //   id: 2,
    //   sender: "이영희",
    //   content: "반갑습니다 :)",
    //   timestamp: "10:02 AM",
    // },
    // {
    //   id: 3,
    //   sender: "박지성",
    //   content: "오늘 날씨가 좋네요.",
    //   timestamp: "10:05 AM",
    // },
  ]);
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: "채팅방에서 사용할 닉네임을 입력하세요.",
      input: "text",
      inputAttributes: {
        autocapitalize: "off",
      },
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showLoaderOnConfirm: true,
      preConfirm: (result) => {
        setNickName(result);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/find/groupchat");
      }
    });

    const newSocket = new WebSocket(wsGroupApi(roomId));
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      let receivedMessage = "";

      try {
        receivedMessage = JSON.parse(event.data); // assuming JSON format
      } catch (error) {
        receivedMessage = event.data;
      }

      console.log(receivedMessage);

      // 새 메시지를 기존 메시지 목록에 추가
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: receivedMessage.sender,
          content: receivedMessage.content || receivedMessage,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    };

    return () => {
      newSocket.close();
    };
  }, [roomId, navigate]); // roomId와 navigate가 바뀔 때마다 새로 실행

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.trim()) {
      const newMessage = {
        sender: nickName,
        content: message,
      };
      socket.send(JSON.stringify(newMessage));

      // 보내는 메시지를 상태에 추가 (실시간으로 화면에 반영)
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          sender: nickName,
          content: message,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);

      setMessage(""); // 메시지 입력란 초기화
    }
  };

  return (
    <div className={styles.groupChatContainer}>
      <header className={styles.groupChatHeader}>
        <Link to="/find/groupchat">
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
        </Link>
        <h1 className={styles.groupChatTitle}>밥먹는 모임</h1>
        <FontAwesomeIcon icon={faUsers} className={styles.groupIcon} />
      </header>
      <main className={styles.groupChatMain}>
        <div className={styles.groupMessages}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.groupMessage} ${
                msg.sender === nickName
                  ? styles.groupMessageSelf
                  : styles.groupMessageOther
              }`}
            >
              {msg.sender !== nickName && (
                <p className={styles.groupSender}>{msg.sender}</p>
              )}
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

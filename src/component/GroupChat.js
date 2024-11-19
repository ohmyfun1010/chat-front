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
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const { roomId,name } = useParams();
  const navigate = useNavigate();
  let nickName = "";

  useEffect(() => {

    const newSocket = new WebSocket(wsGroupApi(roomId));
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      let receivedMessage = "";

      try {
        receivedMessage = JSON.parse(event.data); // assuming JSON format
      } catch (error) {
        receivedMessage = event.data;
      }

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

    newSocket.onopen = () => {
      // 소켓 연결시 이벤트
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
          nickName = result;
          if (nickName) {
            const newMessage = {
              sender: "system",
              content: `${nickName}님이 입장하셨습니다.`,
            };
            newSocket.send(JSON.stringify(newMessage));
          }
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/find/groupchat");
        } else if (result.dismiss === Swal.DismissReason.esc || result.dismiss === Swal.DismissReason.backdrop) {
          navigate("/find/groupchat"); // 필요한 로직을 추가하세요.
        }
      });
    };

    newSocket.onclose = () => {
      // 소켓 해제시 이벤트
    };

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        const newMessage = {
          sender: "system",
          content: `${nickName}님이 퇴장하셨습니다.`,
        };
        newSocket.send(JSON.stringify(newMessage)); // 퇴장 메시지 전송
        newSocket.close(); // 소켓 종료
      }
    };
  }, []);

  const handleSendMessage = (e) => {
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
        <h1 className={styles.groupChatTitle}>{name}</h1>
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
                  : msg.sender === "system"
                  ? styles.groupMessageSystem
                  : styles.groupMessageOther
              }`}
            >
              {msg.sender !== nickName && msg.sender !== "system" && (
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

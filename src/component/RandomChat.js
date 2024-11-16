import React, { useState, useEffect, useRef } from "react";
import { callApi, wsApi } from "../common/commonFunction";
import styles from "../css/RandomChat.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function OneOnOneChat() {
  const chatWindowRef = useRef(null);

  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, sender: "other", content: "안녕하세요! 오늘 어떻게 지내세요?" },
    {
      id: 2,
      sender: "me",
      content:
        "안녕하세요! 잘 지내고 있어요. 프로젝트는 어떻게 진행되고 있나요?",
    },
    {
      id: 3,
      sender: "other",
      content:
        "프로젝트가 순조롭게 진행 중이에요. 다음 주에 중간 발표가 있어서 준비 중입니다.",
    },
  ]);

  useEffect(() => {
    const newSocket = new WebSocket(wsApi());
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      if (event.data === "매칭 성공! 채팅을 시작하세요.") {
        setIsSendDisabled(false);
        displayMessage(event.data, "system");
      } else if (
        event.data ===
          "대기 중입니다. 다른 사용자가 입장할 때까지 기다려주세요." ||
        event.data ===
          "상대방이 나갔습니다. 대기 중인 사용자와 매칭을 시도합니다." ||
        event.data === "1분 동안 활동이 없어 연결이 종료됩니다."
      ) {
        setIsSendDisabled(true);
        displayMessage(event.data, "system");
      } else {
        displayMessage(event.data, "partner");
      }
    };

    newSocket.onclose = () => {
      setIsSendDisabled(true);
    };

  }, []);

  const displayMessage = (content, type) => {
    let displayContent;

    // 줄바꿈 문자를 기준으로 메시지를 나눕니다.
    const lines = content.split(/<br\s*\/?>/); // <br> 또는 <br />로 분할

    // 각 줄을 <div>로 감싸서 배열을 만듭니다.
    const messageElements = lines.map((line, index) => (
      <div key={index}>{line || <br />}</div> // 빈 줄인 경우 <br /> 추가
    ));

    if (type === "partner") {
      displayContent = (
        <>
          <strong>상대방</strong> <br />
          {messageElements} {/* 줄바꿈이 포함된 메시지 */}
        </>
      );
    } else {
      displayContent = messageElements; // 사용자 메시지인 경우
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender:type, content: displayContent },
    ]);

    setTimeout(() => {
      if (chatWindowRef.current) {
        chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      }
    }, 100);
  };

  const sendMessage = () => {
    if (!message.trim()) return; // 메시지가 비어있으면 종료

    // 줄바꿈을 <br />로 변환
    const formattedMessage = message.replace(/\n/g, "<br />");

    // 메시지 표시
    displayMessage(formattedMessage, "me");

    // 소켓이 존재하면 메시지 전송
    if (socket) {
      socket.send(formattedMessage); // 변환된 메시지 전송
    }

    setMessage(""); // 입력창 비우기
  };

  // const handleSendMessage = () => {
  //   if (message.trim()) {
  //     setChatHistory([
  //       ...chatHistory,
  //       { id: chatHistory.length + 1, sender: "me", content: message },
  //     ]);
  //     setMessage("");
  //   }
  // };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // If Shift is not held down, send the message
      if (!e.shiftKey) {
        e.preventDefault(); // Enter 키를 누르면 기본적으로 textarea에서 새 줄이 생성됩니다. 이 줄바꿈 동작을 방지하기 위해 preventDefault 메서드를 호출합니다.
        sendMessage(); // Call your send message function
        setMessage("");
      }
      // If Shift is held down, do nothing (allow the new line)
    }
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
        </Link>
      </header>

      <div ref={chatWindowRef} className={styles.chatHistory}>
        {messages.map((msg,index) => (
          <div
            key={index}
            className={`${styles.chatMessage} ${
              msg.sender === "me"
                ? styles.chatMessageSenderMe
                : msg.sender === "system"
                ? styles.chatMessageSenderSystem
                : styles.chatMessageSenderOther
            }`}
          >
            <div className={styles.messageBubble}>{msg.content}</div>
          </div>
        ))}
      </div>

      <div className={styles.messageInput}>
        <input
          type="text"
          placeholder="메시지를 입력하세요"
          value={message}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          className={styles.inputField}
          disabled={isSendDisabled}
        />
        <button 
          className={styles.sendButton} 
          onClick={sendMessage}
          disabled={isSendDisabled}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

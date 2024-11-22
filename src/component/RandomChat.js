import React, { useState, useEffect, useRef } from "react";
import { callApi, wsApi } from "../common/commonFunction";
import styles from "../css/RandomChat.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSync, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function OneOnOneChat() {

  //ref
  const chatWindowRef = useRef(null);
  const messageRef = useRef(null); // 입력창을 참조하는 ref 생성

  //state
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [inputKey, setInputKey] = useState(0);

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

    return () => {
      newSocket.close();
    };
  }, []);

  //매칭되면 입력란에 포커스 주기
  useEffect(()=>{
    messageRef.current?.focus();
  },[isSendDisabled])

  const displayMessage = (content, type) => {
    // 줄바꿈 문자를 기준으로 메시지를 나눕니다.
    const lines = content.split(/<br\s*\/?>/); // <br> 또는 <br />로 분할

    // 각 줄을 <div>로 감싸서 배열을 만듭니다.
    const messageElements = lines.map((line, index) => (
      <div key={index}>{line || <br />}</div> // 빈 줄인 경우 <br /> 추가
    ));

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: type, content: messageElements },
    ]);

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
    setInputKey(Math.random()); //textAreaRef.current?.focus() 이후 재랜더링을 통해 마지막글자 지워지지않는 버그 개선
  };

  useEffect(() => {
    messageRef.current?.focus();
  }, [message]);

  useEffect(()=>{
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  },[messages])

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent); // 모바일 기기인지 체크

    if (e.key === "Enter") {
      if (!e.shiftKey && !isMobile && !e.nativeEvent.isComposing) {
        e.preventDefault(); // 모바일이 아니면 Enter 키에서 기본 동작을 막고
        sendMessage(); // 메시지 전송
      }
    }
  };

  const resetChat = () => {
    setMessages([]);
  };

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <Link to="/">
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
        </Link>
        <div className={styles.headerRightIcon}  onClick={resetChat}>
          <FontAwesomeIcon icon={faSync} className={styles.icon} />
        </div>
      </header>

      <div ref={chatWindowRef} className={styles.chatHistory}>
        {messages.map((msg, index) => (
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
        <textarea
          key={inputKey}
          ref={messageRef}
          rows={2}
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
          disabled={isSendDisabled}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

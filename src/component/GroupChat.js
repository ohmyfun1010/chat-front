import React, { useState, useEffect, useRef } from "react";
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

  //ref
  const chatWindowRef = useRef(null);
  const textAreaRef = useRef(null); // 입력창을 참조하는 ref 생성

  //state
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [nickName, setNickName] = useState("");

  //navi, useParam
  const { roomId,name } = useParams();
  const navigate = useNavigate();

  //componentdidmount -> useEffect 에서 관리하는 state 가 없을때
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

      const sender = receivedMessage.sender || "system";
      const content = receivedMessage.content || receivedMessage;

      // 줄바꿈 처리
      const formattedContent = content.replace(/\n/g, "<br />");

      // 메시지 렌더링
      displayMessage(formattedContent, sender);

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
          setNickName(result);
          if (result) {
            const newMessage = {
              sender: "system",
              content: `${result}!@!`,
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

    // 소켓 해제시 이벤트
    newSocket.onclose = () => {
    };

    //componentdidunmount -> useEffect 에서 관리하는 state 가 없을때
    return () => {
      newSocket.close(); // 소켓 종료
    };

  }, []);

  const displayMessage = (content,sender) => {

    // 줄바꿈 문자를 기준으로 메시지를 나눕니다.
    const lines = content.split(/<br\s*\/?>/); // <br> 또는 <br />로 분할

    // 각 줄을 <div>로 감싸서 배열을 만듭니다.
    const messageElements = lines.map((line, index) => (
      <div key={index}>{line || <br />}</div> // 빈 줄인 경우 <br /> 추가
    ));

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: prevMessages.length + 1,
        sender: sender,
        content: messageElements,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const handleSendMessage = (e) => {

    if (!message.trim()) return; // 메시지가 비어있으면 종료

    const trimMessage = message.trim();

    // 줄바꿈을 <br />로 변환
    const formattedMessage = trimMessage.replace(/\n/g, "<br />");

    // 메시지 표시
    displayMessage(formattedMessage,nickName);

    const newMessage = {
      sender: nickName,
      content: formattedMessage,
    };

    socket.send(JSON.stringify(newMessage));
    setMessage(""); // 메시지 입력란 초기화

  };

  useEffect(()=>{
    textAreaRef.current?.focus();
  },[message]);

  //스크롤바 제일 아래로 내리기
  useEffect(()=>{
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  },[messages])

  const handleKeyDown = (e) => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    if (e.key === "Enter") {
      if (!e.shiftKey && !isMobile) {
        e.preventDefault(); // 기본 동작 방지
        handleSendMessage(); // 메시지 전송
      }
    }
  };

  const hadleTextAreaChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <div className={styles.groupChatContainer}>
      <header className={styles.groupChatHeader}>
        <Link to="/find/groupchat">
          <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
        </Link>
        <h1 className={styles.groupChatTitle}>{name}</h1>
        <FontAwesomeIcon icon={faUsers} className={styles.groupIcon} />
      </header>
      <main ref={chatWindowRef} className={styles.groupChatMain}>
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
              <div className="groupMessageContent">
                {msg.content}
              </div>
              <p className={styles.groupTimestamp}>{msg.timestamp}</p>
            </div>
          ))}
        </div>
      </main>
      <div className={styles.messageInput}>
        <textarea
          ref={textAreaRef}
          type="text"
          rows={2}
          placeholder="메시지를 입력하세요..."
          value={message}
          onKeyDown={handleKeyDown}
          onChange={hadleTextAreaChange}
          className={styles.inputField}
        />
        <button className={styles.sendButton} onClick={handleSendMessage}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </div>
  );
}

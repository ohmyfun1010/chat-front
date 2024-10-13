import React, { useState, useEffect, useRef } from "react";
import "./ChatApp.css"; // CSS 파일 임포트

function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([
    { type: "system", content: "연결 대기 중..." },
  ]);
  const [message, setMessage] = useState("");
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const chatWindowRef = useRef(null);
  const messageInputRef = useRef(null);
  const [connectedUsers, setConnectedUsers] = useState(0); // 접속자 수
  const [waitingUsers, setWaitingUsers] = useState(0); // 대기자 수

  useEffect(() => {
    const newSocket = new WebSocket("ws://localhost:8080/api/chat");
    setSocket(newSocket);

    newSocket.onmessage = (event) => {
      if (event.data === "매칭 성공! 채팅을 시작하세요.") {
        enableSend();
        displayMessage(event.data, "system");
      } else if (
        event.data ===
          "대기 중입니다. 다른 사용자가 입장할 때까지 기다려주세요." ||
        event.data ===
          "상대방이 나갔습니다. 대기 중인 사용자와 매칭을 시도합니다."
      ) {
        disableSend();
        displayMessage(event.data, "system");
      } else {
        displayMessage(event.data, "partner");
      }
    };

    newSocket.onopen = () => {
      fetchConnectedUsers();
      fetchWaitingUsers();
    };

    newSocket.onclose = () => {
      disableSend();
      displayMessage("상대방이 나갔습니다. 다시 대기 중...", "system");
    };

    // 5초에 한 번씩 fetch 함수를 호출
    const intervalId = setInterval(() => {
      fetchConnectedUsers();
      fetchWaitingUsers();
    }, 5000); // 5000ms = 5초

    return () => {
      newSocket.close();
      clearInterval(intervalId);
    };
  }, []);

  const fetchConnectedUsers = () => {
    // 접속자 수를 가져오는 API 요청
    fetch("http://localhost:8080/api/session")
      .then((response) => response.json())
      .then((data) => {
        setConnectedUsers(data);
      })
      .catch((error) => console.error("connected users-ip-number", error));
  };

  const fetchWaitingUsers = () => {
    // 대기자 수를 가져오는 API 요청
    fetch("http://localhost:8080/api/waiting")
      .then((response) => response.json())
      .then((data) => setWaitingUsers(data))
      .catch((error) => console.error("Error fetching waiting users:", error));
  };

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
      { type, content: displayContent },
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
    displayMessage(formattedMessage, "user");

    // 소켓이 존재하면 메시지 전송
    if (socket) {
      socket.send(formattedMessage); // 변환된 메시지 전송
    }

    setMessage(""); // 입력창 비우기
  };

  const enableSend = () => {
    setIsSendDisabled(false);
  };

  const disableSend = () => {
    setIsSendDisabled(true);
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // If Shift is not held down, send the message
      if (!e.shiftKey) {
        e.preventDefault(); // Enter 키를 누르면 기본적으로 textarea에서 새 줄이 생성됩니다. 이 줄바꿈 동작을 방지하기 위해 preventDefault 메서드를 호출합니다.
        sendMessage(); // Call your send message function
      }
      // If Shift is held down, do nothing (allow the new line)
    }
  };

  const resetChat = () => {
    setMessages([]);
  };

  return (
    <div className="chat-container">
      {/* 접속자 수, 대기자 수, 초기화 버튼 */}
      <div className="header">
        <div className="user-info">
          접속자 수: {connectedUsers}명 | 대기자 수: {waitingUsers}명
        </div>
        <button className="reset-button" onClick={resetChat}>
          채팅 초기화
        </button>
      </div>
      <div ref={chatWindowRef} className="chat-window">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="input-container">
        <textarea
          ref={messageInputRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          disabled={isSendDisabled}
          rows={2}
          style={{ resize: "none", width: "100%" }}
        />
        <button onClick={sendMessage} disabled={isSendDisabled}>
          전송
        </button>
      </div>
    </div>
  );
}

export default Chat;

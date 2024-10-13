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
    let displayContent = content;
    if (type === "partner") {
      displayContent = (
        <>
          <strong>상대방</strong> <br /> {content}
        </>
      );
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
    if (!message.trim()) return;

    displayMessage(message, "user");

    if (socket) {
      socket.send(message);
    }

    setMessage("");
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
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([]);
  };

  const handleButtonClick = () => {
    fetch("http://localhost:8080/api/session")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(await response.text());
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
    fetch("http://localhost:8080/api/waiting")
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(await response.text());
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
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
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          disabled={isSendDisabled}
        />
        <button onClick={sendMessage} disabled={isSendDisabled}>
          전송
        </button>
      </div>
    </div>
  );
}

export default Chat;

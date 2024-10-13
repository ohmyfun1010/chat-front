// src/components/NotFound.js
import React from "react";
import "./NotFound.css"; // CSS 파일 import

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <a href="/" className="home-link">
        홈으로 돌아가기
      </a>
    </div>
  );
}

export default NotFound;

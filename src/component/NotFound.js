// src/components/NotFound.js
import React from "react";
import styles from "../css/NotFound.module.css"; // CSS 파일 import
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 페이지가 존재하지 않습니다.</p>

      <Link to="/">
        <button className={styles.homeLink}>홈으로 돌아가기</button>
      </Link>
    </div>
  );
};

export default NotFound;

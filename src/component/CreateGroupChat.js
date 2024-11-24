import { useState, useRef, useEffect } from 'react';
import styles from '../css/CreateGroupChat.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { callApi } from "../common/commonFunction";
import Swal from 'sweetalert2'

export default function CreateGroupChat() {

  //ref
  const groupChatNameRef = useRef(null);

  //state
  const [groupName, setGroupName] = useState("");

  //navi
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    if(groupName.trim() == ""){
      Swal.fire({
        text: "그룹명을 입력하세요.",
        icon: "warning",
      })
      return;
    }
    const url = '/api/chat/group'; 
    const duplicateCheckUrl = '/api/checking/group/';
    const param = { name:groupName }; 
    Swal.fire({
      text: "그룹채팅을 생성하시겠습니까?",
      icon: "question",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "네",
      cancelButtonText: "아니오"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try{
          const duplicateCheck = await callApi(duplicateCheckUrl+groupName,'GET');
          if(duplicateCheck){
            Swal.fire({
              text: "동일한 그룹채팅이름이 존재합니다.",
              icon: "warning",
            });
            return;
          }
          const response = await callApi(url, 'POST', param);
        }catch(error){
          Swal.fire({
            text: "그룹채팅 생성중 오류가 발생하였습니다.",
            icon: "error",
          });
          return;
        }
        Swal.fire({
          text: "그룹채팅이 생성되었습니다.",
          icon: "success"
        }).then(() => {
          setGroupName("");
          navigate("/find/groupchat");
        });
      }
    });
  };

  const handleOnKeyDown = (e) => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (e.key === "Enter") {
      //e.nativeEvent.isComposing onKeyDown 마지막 글자 2번 엔터쳐지는 버그 개선용
      if (!e.shiftKey && !isMobile && !e.nativeEvent.isComposing) {
        e.preventDefault(); // 기본 동작 방지
        handleSubmit(); // 메시지 전송
      }
    }
  }

  useEffect(()=>{
    groupChatNameRef.current?.focus();
  },[])

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.iconButton}>
          <Link to="/">
            <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} />
          </Link>
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.iconSection}>
            <FontAwesomeIcon icon={faUsers} className={styles.userIcon} />
            <h2 className={styles.formTitle}>새 그룹 채팅</h2>
            <p className={styles.formSubtitle}>그룹 채팅방의 이름을 입력하세요.</p>
          </div>
          <div className={styles.form}>
            <input
              type="text"
              ref={groupChatNameRef}
              placeholder="그룹 채팅방 이름"
              value={groupName}
              onKeyDown={handleOnKeyDown}
              onChange={(e) => setGroupName(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleSubmit} className={styles.submitButton}>
              그룹 만들기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

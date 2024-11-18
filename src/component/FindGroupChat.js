import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import styles from "../css/FindGroupChat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSearch, faUsers } from "@fortawesome/free-solid-svg-icons";
import { callApi } from "../common/commonFunction";

export default function FindGroupChat() {
  const [searchTerm, setSearchTerm] = useState("");
  const [groups,setGroups] = useState([
    { id: 1, name: "밥먹는 모임", members: 15 },
    { id: 2, name: "개발팀 채팅방", members: 8 },
    { id: 3, name: "주말 등산 모임", members: 20 },
    { id: 4, name: "영화 감상 클럽", members: 12 },
    { id: 5, name: "독서 토론방", members: 7 },
  ]);

  useEffect(() => {
    findGroupChat();
  },[]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const findGroupChat = async () => {
    const url = '/api/chat/group'; 
    try{
      const response = await callApi(url, 'GET');
      let processedRooms = '';
      if(response){

        console.log(response);

        processedRooms = response.map((room) => ({
          name: room.name,
          members: room.members,
          roomId: room.roomId
        }));
        setGroups(processedRooms);
      }
    }catch(error){
      console.log(error);
    }
  }

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
        <div className={styles.content}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="그룹 채팅방 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
          </div>

          <div className={styles.groupList}>
            {filteredGroups.map((group, index) => (
              <div key={index} className={styles.groupItem}>
                <div className={styles.groupInfo}>
                  <FontAwesomeIcon icon={faUsers} className={styles.groupIcon} />
                  <div>
                    <h3 className={styles.groupName}>{group.name}</h3>
                    <p className={styles.groupMembers}>{group.members}명 참여 중</p>
                  </div>
                </div>
                <Link to={`/chat/group/${group.roomId}`}>
                  <button className={styles.joinButton}>참여</button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

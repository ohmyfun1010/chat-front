import { SERVER_URL,SOCKET_URL } from "../config";

export const callApi = async (url, method = "GET", param = {}, header = {}) => {
  const response = await fetch(SERVER_URL + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...header
    },
    body: method !== "GET" ? JSON.stringify(param) : undefined,
  });

  if (!response.ok) {
    const errorMessage = await response.text();  // 서버에서 보내준 오류 메시지(String 형)
    console.log("[callApi 에러]:"+errorMessage);
    throw new Error(errorMessage);
  }

  // 응답 헤더에서 Content-Type을 확인하여 JSON인지 일반 텍스트인지 구분
  const contentType = response.headers.get("Content-Type");

  let res;
  if (contentType && contentType.includes("application/json")) {
    // JSON 응답이면 response.json()
    res = await response.json();
  } else {
    // 그렇지 않으면 response.text()
    res = await response.text();
  }

  return res;
};


export const wsApi = () => {
  return SOCKET_URL+'/api/chat';
};

export const wsGroupApi = (roomId) => {
  return SOCKET_URL+'/api/group/chat/'+roomId;
};

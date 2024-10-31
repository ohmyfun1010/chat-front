import { SERVER_URL } from "../config";

export const callApi = async (url, method = "GET", param = {}, header = {}) => {
  const response = await fetch(SERVER_URL + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...header
    },
    body: method !== "GET" ? JSON.stringify(param) : undefined,
  });
  
  const res = await response.json();
  return res;
};


export const wsApi = () => {
  return 'ws://'+SERVER_URL+'/api/chat';
};

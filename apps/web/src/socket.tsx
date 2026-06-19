import { io } from "socket.io-client";
const URL = "http://localhost:4000";
const socket = io(URL, {
  auth: {
    token: localStorage.getItem('Token')
  }
});

socket.onAny((eventName: any) => {
  console.log(eventName);
});

export default socket;
// SocketContext.js
import React, { createContext, useContext, useEffect, useState,useRef } from 'react';
import { io } from 'socket.io-client';


const SocketContext = createContext(
  {
    socket: null,
    socketId: "",
    room: "",
    messages: {},
    isSessionActive: false,
    isHost: false,
    onGenerateNewKey: () => {},
    onJoinSessionUsingKey: () => {},
    onLeaveSession: () => {},
    handleMsgChange: () => {},
    msg: ""
  }
);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {

const appurl = import.meta.env.VITE_API_URL ;
console.log(appurl);

  const [msg, setMsg] = useState("");
  const [socket, setSocket] = useState(null);

 
  const socketId = useRef("");
  const [room, setRoom] = useState("");
  const [messages, setMessages] = useState({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isHost, setIsHost] = useState(false);
  

  useEffect(() => {
    const newSocket = io(appurl);
  
    // console.log(appurl);

        newSocket.on("connect", () => {
      // setSocketId(newSocket.id);
      socketId.current = newSocket.id;
    });

    newSocket.on("received-message", (data) => {
      setMessages(prevMessages => ({
        ...prevMessages, 
        [data.senderId]: [ data.msg]
      }));
    });

    newSocket.on("key_generated", (key) => {
      setIsSessionActive(true);
      setIsHost(true);
      setRoom(key);
      // room.current = key;
    });

    newSocket.on("join_success", (key) => {
      setIsSessionActive(true);
      setRoom(key);
      // room.current = key;
    });

    newSocket.on("join_fail", (message) => {
      alert(message);
      setIsSessionActive(false);
      setRoom("");
      // room.current = "";
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
      // setSocketId("");
      socketId.current = "";
      setIsSessionActive(false);
      setRoom("");
      // room.current = "";
      setMessages({});
      setIsHost(false);
    });

    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

 




const  onGenerateNewKey = () => {
  if (socket) {
    socket.emit('generate_key');
  }
};


const onJoinSessionUsingKey = (key) => {
  if (socket && key) {
    socket.emit('join_session', key);
  }
};

const onLeaveSession = () => {
  if ( socket && room) {
    socket.emit('leave_session', room);
    setIsSessionActive(false);
    setIsHost(false);
    setRoom("");
    setMessages({});
  }
};

const handleMsgChange = (e) => {
  const newMsg = e.target.value;
  setMsg(newMsg);
  if (socket && room && newMsg.trim()) {
    socket.emit("message", { msg: newMsg, room, senderId: socket.id });
  }
  console.log(msg);
};

const value ={
  socket,
  socketId,
  room,
  messages,
  isSessionActive,
  isHost,
  onGenerateNewKey,
  onJoinSessionUsingKey,
  onLeaveSession,
  handleMsgChange,
  msg
};

  return (
    <SocketContext.Provider value={value} >
      {children}
    </SocketContext.Provider>
  );
};

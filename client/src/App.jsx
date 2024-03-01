

import React, { useState,useRef,useEffect } from 'react';
import Session from './Session'; // Placeholder for your Session component
import { useNavigate } from 'react-router-dom';

import { useSocket } from './SocketContext';

 import { Outlet } from 'react-router-dom';

export default function App() {
  

  const socket = useSocket();
  const navigate = useNavigate();


  useEffect(() => {
    if (socket.isSessionActive) {
      // console.log(socket.isSessionActive);
      navigate('/chat', { replace: true, state: { socketId:socket.socketId, isHost: socket.isHost, room:socket.room, messages : socket.messages} });
    }
  }, [socket.isSessionActive, navigate, socket.socketId, socket.isHost, socket.room, socket.messages]);
  

  return (
    
    <div>
      <Session 
        onGenerateNewKey={socket.onGenerateNewKey} 
        onJoinSessionUsingKey={socket.onJoinSessionUsingKey}
        onLeaveSession={socket.onLeaveSession}
      />
    <Outlet />
    </div>
  );
}

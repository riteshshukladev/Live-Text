



// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import Session from "./Session";

// function App() {
//   const [socket, setSocket] = useState(null);
//   const [msg, setMsg] = useState("");
//   const [room, setRoom] = useState("");
//   const [socketId, setSocketId] = useState("");
//   const [messages, setMessages] = useState({});
//   const [isSessionActive, setIsSessionActive] = useState(false);

//   useEffect(() => {
//     const newSocket = io("http://localhost:3000");

//     newSocket.on("connect", () => {
//       setSocketId(newSocket.id);
//     });

//     newSocket.on("received-message", (data) => {
//       setMessages(prevMessages => ({
//         ...prevMessages,
//         [data.senderId]: data.msg
//       }));
//     });

//     newSocket.on("key_generated", (key) => {
//       setIsSessionActive(true);
//       setRoom(key);
//     });

//     newSocket.on("join_success", (partnerSocketId) => {
//       setIsSessionActive(true);
//       setRoom(partnerSocketId);
//       // You can add additional logic here if needed
//     });

//     newSocket.on("join_fail", (message) => {
//       alert(message); // Display the failure message to the user
//       setIsSessionActive(false);
//       setRoom("");
//     });

//     newSocket.on("disconnect", () => {
//       setSocket(null);
//       setSocketId("");
//       setIsSessionActive(false);
//       setRoom("");
//       setMessages({});
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const handleMsgChange = (e) => {
//     const newMsg = e.target.value;
//     setMsg(newMsg);
//     if (socket && room) {
//       socket.emit("message", { msg: newMsg, room, senderId: socket.id });
//     }
//   };

//   const onGenerateNewKey = () => {
//     if (socket) {
//       socket.emit('generate_key', socket.id);
//     }
//   };

//   const onJoinSessionUsingKey = (key) => {
//     if (socket) {
//       socket.emit('join_session', key);
//     }
//   };

//   const onLeaveSession = () => {
//     if (socket) {
//       socket.disconnect();
//       setSocket(null);
//       setIsSessionActive(false);
//     }
//   };

//   return (
//     <div>
//       <Session 
//         onGenerateNewKey={onGenerateNewKey} 
//         onJoinSessionUsingKey={onJoinSessionUsingKey}
//         onLeaveSession={onLeaveSession}
//       />
//       {isSessionActive && (
//         <div>
//           <div className="socket_print">
//             <h1>Socket id: {socketId}</h1>
//           </div>
//           <form>
//             <input
//               type="text"
//               name="msg"
//               value={msg}
//               onChange={handleMsgChange}
//             />
//             <input
//               type="text"
//               name="room"
//               value={room}
//               onChange={(e) => setRoom(e.target.value)}
//             />
//           </form>
//           <div>
//             {Object.entries(messages).map(([senderId, message]) => (
//               <div key={senderId}>
//                 <p>{senderId}: {message}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default App;
import React, { useEffect, useState,useRef } from "react";
import { io } from "socket.io-client";
import Session from "./Session";

function App() {
  const [socket, setSocket] = useState(null);
  const [msg, setMsg] = useState("");
  const [room, setRoom] = useState("");
  const socketId = useRef("");
  
  const [messages, setMessages] = useState({});
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    
    const newSocket = io("http://localhost:3000");

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

    return () => {
      newSocket.disconnect();
    };
  }, []);

 

  const handleMsgChange = (e) => {
    const newMsg = e.target.value;
    setMsg(newMsg);
    if (socket && room && newMsg.trim()) {
      socket.emit("message", { msg: newMsg, room, senderId: socket.id });
    }
  };

 

  const  onGenerateNewKey = () => {
    if (socket) {
      socket.emit('generate_key');
    }
  };
  

  const onJoinSessionUsingKey = (key) => {
    if (socket) {
      socket.emit('join_session', key);
    }
  };

  const onLeaveSession = () => {
    if (socket && room) {
      socket.emit('leave_session', room);
      setIsSessionActive(false);
      setIsHost(false);
      setRoom("");
      setMessages({});
    }
  };

  

  return (
    <div>
      <Session 
        onGenerateNewKey={onGenerateNewKey} 
        onJoinSessionUsingKey={onJoinSessionUsingKey}
        onLeaveSession={onLeaveSession}
      />
      {isSessionActive && (
        <div>
          <div className="socket_print">
            <h1>Socket ID: {socketId.current}</h1>
            {isHost && <h2>Room Key: {room}</h2>}
          </div>
          <form>
            <input
              type="text"
              value={msg}
              onChange={handleMsgChange}
              placeholder="Enter message"
            />
            
          </form>
          <div>
            {Object.entries(messages).map(([senderId, msgs]) => (
              <div key={senderId}>
                <p>{senderId}:</p>
                {msgs.map((m, index) => <p key={index}>{m}</p>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;


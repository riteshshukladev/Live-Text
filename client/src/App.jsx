// import React, { useCallback, useEffect, useState, useMemo } from "react";
// import { io } from "socket.io-client";

// function App() {
//   // Makes a coonection to the server socket
//   // const socket = ("http://localhost:3000");

//   // this allow us to memoize the socket instance so that it will not be recreated on every keystroke of the input field
//   const socket = useMemo(() => io("http://localhost:3000"), []);
//   const [msg, setMsg] = useState("");
//   const [room, setRoom] = useState("");
//   const [socketId, setSocketId] = useState("");
//   const [showMessage, setshowMessage] = useState([]);

//   useEffect(() => {
//     // When the socket connects to the socketIO server successfully,it logs the socket id
//     socket.on("connect", () => {
//       setSocketId(socket.id);
//       console.log("socket connected");
//       console.log("socket id:", socket.id);
//     });
//     // custom event listener defined or emitted in the server
//     // The event name in server and client should match in the case of the custom event
//     socket.on("namaste", (data) => {
//       console.log(data);
//     });

//     socket.on("recieved-message", (data) => {
//       // setshowMessage([...showMessage,data]);
//       console.log(data);
//       setshowMessage((prev) => [...prev, data]);
//     });
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const btnHandler = (e) => {
//     e.preventDefault();
//     // used to send the message to the server, message is the event name(inbuild event should match with the server event name)
//     socket.emit("message", { msg, room });
//     setMsg("");
//   };

//   return (
//     <div>
//       <div className="socket_print">
//         <h1>Socket id: {socketId}</h1>
//       </div>
//       <form action="" onChange={btnHandler}>
//         <input
//           type="text"
//           name="msg"
//           id=""
//           value={msg}
//           onChange={(e) => setMsg(e.target.value)}
//         />
//         <input
//           type="text"
//           name="room"
//           id=""
//           value={room}
//           onChange={(e) => setRoom(e.target.value)}
//         />
//         <button type="submit">send</button>
//       </form>
//       <div>
//         {showMessage.map((data, index) => {
//           return (
//             <div key={index}>
//               <p>{data}</p>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// export default App;


// import React, { useCallback, useEffect, useState, useMemo } from "react";
// import { io } from "socket.io-client";

// function App() {
//   const socket = useMemo(() => io("http://localhost:3000"), []);
//   const [msg, setMsg] = useState("");
//   const [room, setRoom] = useState("");
//   const [socketId, setSocketId] = useState("");
//   const [showMessage, setshowMessage] = useState([]);

//   useEffect(() => {
//     socket.on("connect", () => {
//       setSocketId(socket.id);
//     });

//     socket.on("recieved-message", (data) => {
//       setshowMessage((prev) => [...prev, data]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleMsgChange = (e) => {
//     const newMsg = e.target.value;
//     setMsg(newMsg);
//     socket.emit("message", { msg: newMsg, room });
//   };

//   return (
//     <div>
//       <div className="socket_print">
//         <h1>Socket id: {socketId}</h1>
//       </div>
//       <form>
//         <input
//           type="text"
//           name="msg"
//           value={msg}
//           onChange={handleMsgChange}
//         />
//         <input
//           type="text"
//           name="room"
//           value={room}
//           onChange={(e) => setRoom(e.target.value)}
//         />
//       </form>
//       <div>
//         {showMessage.map((data, index) => (
//           <div key={index}>
//             <p>{data}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;


import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import Session from "./Session";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);
  const [msg, setMsg] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
    });

    socket.on("recieved-message", (data) => {
      setMessages(prevMessages => ({
        ...prevMessages,
        [data.senderId]: data.msg
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMsgChange = (e) => {
    const newMsg = e.target.value;
    setMsg(newMsg);
    socket.emit("message", { msg: newMsg, room, senderId: socket.id });
  };

const onGenrateNewKey = () => {
  if(socket && socket.connected){
    socket.emit('generate_key');
    socket.on('key_generated', (key) => {
      console.log('key', key);
    });
  }
  else{
    console.log('failure in connection');
  }
}

const onJoinSessionUsingkey = (key) => {

  if(socket && socket.connected){
    socket.emit('join_session', key);
    console.log(`key ${key} is sent to the server`);
  }
  else{
    console.log('failure in connection');
  }
}
  

  return (
    <div>
      <Session onGenrateNewKey={onGenrateNewKey} onJoinSessionUsingkey={onJoinSessionUsingkey}/>
      <div className="socket_print">
        <h1>Socket id: {socketId}</h1>
      </div>
      <form>
        <input
          type="text"
          name="msg"
          value={msg}
          onChange={handleMsgChange}
        />
        <input
          type="text"
          name="room"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          
        />
      </form>
      <div>
        {Object.entries(messages).map(([senderId, message]) => (
          <div key={senderId}>
            <p>{senderId}  :  {message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;


// import React, { useEffect, useState, useMemo } from "react";
// import { io } from "socket.io-client";
// import { v4 as uuidv4 } from 'uuid'; // UUID for generating unique keys

// function App() {
//   const socket = useMemo(() => io("http://localhost:3000"), []);
//   const [msg, setMsg] = useState("");
//   const [room, setRoom] = useState("");
//   const [socketId, setSocketId] = useState("");
//   const [messages, setMessages] = useState({});

//   useEffect(() => {
//     socket.on("connect", () => {
//       setSocketId(socket.id);
//     });

//     socket.on("received-message", (data) => {
//       setMessages(prevMessages => ({
//         ...prevMessages,
//         [data.senderId]: data.msg
//       }));
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const handleMsgChange = (e) => {
//     const newMsg = e.target.value;
//     setMsg(newMsg);
//     socket.emit("message", { msg: newMsg, room, senderId: socket.id });
//   };

//   const generateKey = () => {
//     const newKey = uuidv4();
//     setRoom(newKey);
//   };

//   return (
//     <div>
//       <div className="socket_print">
//         <h1>Socket id: {socketId}</h1>
//         <button onClick={generateKey}>Generate Key</button>
//         <input
//           type="text"
//           placeholder="Enter Key to Join Room"
//           value={room}
//           onChange={(e) => setRoom(e.target.value)}
//         />
//       </div>
//       <form>
//         <input
//           type="text"
//           name="msg"
//           value={msg}
//           onChange={handleMsgChange}
//         />
//       </form>
//       <div>
//         {Object.entries(messages).map(([senderId, message]) => (
//           <div key={senderId}>
//             <p>{senderId}  :  {message}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default App;

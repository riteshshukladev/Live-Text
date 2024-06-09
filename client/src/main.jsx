
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { SocketProvider } from "./SocketContext";


import Session from "./Session";
import ChatPage from "./ChatPage";



  ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<App/>} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="session" element={<Session/>}/>
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  
);

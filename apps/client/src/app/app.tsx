import { useEffect, useState } from "react";
import styled from "styled-components";
import { OfflineSpeechToText } from "./offlineSpeechToText";
import { Link, Routes, Route } from "react-router-dom";
import { SpeechToText } from "./speechToText";
// import { Route, Routes, Link } from "react-router-dom";

const WebApp = styled.div`
  font-family: 'Arial';
`;

const Navigation = styled.div`
  margin-bottom: 20px;
`;

const Nav = styled.div`
  background: #ffcd9a;
  color: #744141;
  display: inline-block;
  padding: 10px;
  margin-right: 5px;
`;

export function App() {
  return (
    <WebApp>
      <Navigation>
        <div role="navigation">
          <Link to="/speech-to-text-over-server">
            <Nav>
              Speech to text over server
            </Nav>
          </Link>
          <Link to="/offline-speech-to-text">
            <Nav>
              Speech to text offline
            </Nav>
          </Link>
        </div>
      </Navigation>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              Choose
            </div>
          }
        />
        <Route
          path="/speech-to-text-over-server"
          element={
            <SpeechToText />
          }
        />
        <Route
          path="/offline-speech-to-text"
          element={
            <OfflineSpeechToText />
          }
        />
      </Routes>
    </WebApp>
  );
}

export default App;

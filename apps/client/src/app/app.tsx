import { useEffect, useState } from "react";
import styled from "styled-components";
import { OfflineSpeechToText } from "./offlineSpeechToText";
import { Link, Routes, Route } from "react-router-dom";
import { SpeechToText } from "./speechToText";
// import { Route, Routes, Link } from "react-router-dom";

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      
      
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/speech-to-text-over-server">Speech to text over server</Link>
          </li>
          <li>
            <Link to="/offline-speech-to-text">Speech to text offline</Link>
          </li>
        </ul>
      </div>
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
    </StyledApp>
  );
}

export default App;

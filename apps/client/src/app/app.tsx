import { useEffect, useState } from "react";
import styled from "styled-components";
import { OfflineSpeechToText } from "./offlineSpeechToText";
import { Link, Routes, Route } from "react-router-dom";
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
            <Link to="/">Speech to text through server</Link>
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
              WIP
            </div>
          }
        />
        <Route
          path="/offline-speech-to-text"
          element={
            <OfflineSpeechToText />
          }
        />
      </Routes>
      {/* END: routes */}
    </StyledApp>
  );
}

export default App;

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Trivia from './components/Trivia';
import ThemeSelection from './components/ThemeSelection';
import SuggestQuestion from './components/SuggestQuestion';
import ErrorNotImplemented from './components/ErrorNotImplemented';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/trivia/:type/:count" element={<Trivia />} /> {/* Actualiza la ruta para incluir :count */}
        <Route path="/error-not-implemented" element={<ErrorNotImplemented/>} />
        <Route path="/select-theme" element={<ThemeSelection />} />
        <Route path="/suggest-question" element={<SuggestQuestion />} />
      </Routes>
    </div>
  );
}

export default App;

import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Welcome from './components/Welcome';
import Trivia from './components/Trivia';
import ThemeSelection from './components/ThemeSelection';
import SuggestQuestion from './components/SuggestQuestion';
import AddQuestion from './components/AddQuestion';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/trivia/:type" element={<Trivia />} />
        <Route path="/select-theme" element={<ThemeSelection />} />
        <Route path="/suggest-question" element={<SuggestQuestion />} />
        <Route path="/add-question" element={<AddQuestion />} />
      </Routes>
    </div>
  );
}

export default App;

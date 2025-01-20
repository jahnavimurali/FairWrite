import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TextEditor from './components/TextEditor';

export const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<TextEditor />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

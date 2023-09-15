import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './components/SignUp';
import QuestionForm from './components/QuestionsForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<SignUp />} />
        <Route path='/preguntas' element={<QuestionForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

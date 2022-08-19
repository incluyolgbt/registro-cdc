import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuestionsForm from './components/QuestionsForm';
import SignUp from './components/SignUp';
import WorkshopSignUp from './components/WorkshopSignUp';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<SignUp/>} />
      <Route path="/taller" element={<WorkshopSignUp/>} />
      <Route path="/pregunta" element={<QuestionsForm/>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

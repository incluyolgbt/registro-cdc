import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/SignUpHybrid";
import WorkshopSignUp from "./components/WorkshopSignUp";
import Reminder from "./components/Reminder";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignUp />} />
        <Route path="/rsvp" element={<WorkshopSignUp />} />
        <Route path="/recuerdame" element={<Reminder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

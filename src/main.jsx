import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EventPage from "./views/EventPage.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={ <App/> } exact />
              <Route path="/event/:id" element={ <EventPage/> } />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)

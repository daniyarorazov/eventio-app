import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EventPage from "./views/EventPage.jsx";
import CreateEventView from "./views/CreateEventView.jsx";
import ListEvents from "./views/ListEvents.jsx";
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={ <App/> } exact />
              <Route path="/event/:id" element={ <EventPage/> } />
              <Route path="/create-event/" element={ <CreateEventView/> } />
              <Route path="/events/" element={ <ListEvents /> } />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)

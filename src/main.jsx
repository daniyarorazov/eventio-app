import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EventPage from "./views/EventPage.jsx";
import CreateEventView from "./views/CreateEventView.jsx";
import ListEvents from "./views/ListEvents.jsx";
import {auth, currentStateUser} from "./db.jsx";
import ResultCreatedEventView from "./views/ResultCreatedEventView.jsx";
import EditEventPage from "./views/EditEventPage.jsx";
import {useAuthState} from "react-firebase-hooks/auth";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={ <App/> } exact />
              <Route path="/event/:id" element={ <EventPage/> } />
              <Route path="/create-event/" element={ currentStateUser ? <CreateEventView/> : <EventPage/> } />
              <Route path="/events/" element={<ListEvents />} />
              <Route path="/share/:id" element={ <ResultCreatedEventView /> } />
              <Route path="/event/edit/:id" element={ <EditEventPage /> } />
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)

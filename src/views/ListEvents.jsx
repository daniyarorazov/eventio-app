import React, {useEffect, useState} from 'react';
import {collection, onSnapshot} from "firebase/firestore";
import {firestore} from "../db";
import presentationIcon from "../assets/presentation-icon.svg";
import './ListEvents.css';
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import {Link} from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent.jsx";

const ListEvents = () => {
    const db = firestore;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [valueQuery, setValueQuery] = useState('');
    const colRef = collection(db, "events");

    useEffect(() => {
        const unsubscribe = onSnapshot(colRef, (docsSnap) => {
            const eventsData = [];
            docsSnap.forEach((doc) => {
                const eventId = doc.id;

                eventsData.push({id: eventId, ...doc.data()});
            });

            setEvents(eventsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    function searchEventsHandler() {
        const colRef = collection(db, 'events');

        if (valueQuery === "") {
            const unsubscribe = onSnapshot(colRef, (docsSnap) => {
                const eventsData = [];
                docsSnap.forEach((doc) => {
                    eventsData.push(doc.data());
                });

                setEvents(eventsData);
                setLoading(false);
            });

            return () => unsubscribe();
        }

        // Split the search terms entered by the user
        const searchTerms = valueQuery.toLowerCase().split(' ');

        // Create an array to store the filtered events
        const filteredEvents = [];

        onSnapshot(colRef, (docsSnap) => {
            docsSnap.forEach((doc) => {
                const eventData = doc.data();
                const eventName = eventData.title.toLowerCase();

                // Check if any of the search terms match the event name
                const isMatch = searchTerms.some((term) => eventName.includes(term));

                if (isMatch) {
                    filteredEvents.push(eventData);
                }
            });

            setEvents(filteredEvents);
            setLoading(false);
        });
    }


    return (
        <div className="events-block">
            {loading ? (
                <LoadingComponent />
            ) : (

                <div>

                    <h2 className="list-events__title">List events</h2>

                    <div className="section-events__controls">
                       <InputField
                           id="searchingEventInput"
                           className="list-events__input"
                           onChange={(e) => setValueQuery(e.target.value)}
                           valueInput={valueQuery}
                           placeholder="Search"
                       />

                       <Button
                           value="Search"
                           onClick={() => searchEventsHandler()}
                           className="list-events__button"
                           width="100px"
                           borderRadius="0 9px 9px 0"
                           backgroundColor="#F9CA24"
                       />
                   </div>

                    {events.map((event, key) =>

                        <Link to={`/event/${event.id}`}>
                            <div className="section-events" key={key}>
                                <div className="section__list-events">
                                    <div className="card">
                                        <div className="card-content">
                                            <img src={presentationIcon} alt=""/>
                                            <h4>{event.title}</h4>
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="card-buttons">
                                            <button className="card-buttons__download">
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListEvents;
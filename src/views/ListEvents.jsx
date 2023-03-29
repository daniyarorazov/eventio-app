import React, {useEffect, useState} from 'react';
import { doc, collection, onSnapshot, getDocs  } from "firebase/firestore";
import {app, auth, firestore, performance, storage} from "../db";


/*
* const db = firestore;
* const [event, setEvent] = useState();
* const colRef = collection(db, "events");
* onSnapshot(colRef, docsSnap => {
*   docsSnap.forEach(doc => {
*   console.log(doc.data()); setEvent(doc.data());
* })
* }); return ( <div> {event} </div> );
*
*
* */

const ListEvents = () => {
    const db = firestore;
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const colRef = collection(db, "events");

    useEffect(() => {
        const unsubscribe = onSnapshot(colRef, (docsSnap) => {
            const eventsData = [];
            docsSnap.forEach((doc) => {
                eventsData.push(doc.data());
            });
            setEvents(eventsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    console.log(events)

    return (
        <div>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div>
                    {events.map((event, key) =>
                        <h2 key={key}>{event.title}</h2>
                    )}
                </div>
            )}
        </div>
    );
};

export default ListEvents;
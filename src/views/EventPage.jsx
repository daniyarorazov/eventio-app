import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import './EventPage.css';
import sprite from '../assets/sprite.svg';
import presentationIcon from '../assets/presentation-icon.svg';
import download from '../assets/download.svg';

import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import { firestore as db, auth } from "../db";
import Button from "../components/Button.jsx";

async function getUserById(id) {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
}

const EventPage = () => {

    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [subcollectionData, setSubcollectionData] = useState([]);

    useEffect(() => {
        getUserById(id).then((data) => {
            setEvent(data);
        });
    }, [id]);

    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserID(user.uid);
            } else {
                setUserID(null);
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const subcollectionRef = collection(
                db,
                "events",
                id,
                "guests"
            );
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const data = subcollectionSnapshot.docs.map((doc) => doc.data());
            setSubcollectionData(data);
        };
        fetchData();
    }, []);

console.log(subcollectionData)
    return (

        <>
            {event && (
            <header>
                {event.uid == userID ? <h1>Hello Admin</h1> : null}
                <Link to={`http://localhost:5173/share/${id}`}>
                    <Button
                    value={"Share QR code"}
                    className="event-page__button"
                /></Link>
                <h2>{event.title}</h2>
                <div className="event-title" style={{ backgroundImage: `url(${sprite})` }}>
                    <h3>{event.date}</h3>
                </div>
            </header>
                )}
            {event && (
            <main>
                <section className="section section-event-timeline">


                    {subcollectionData && (
                        subcollectionData.map((doc) => (
                            <div className={`event__${doc.id} event-block`}>
                                <div className="event-block__content">
                                    <div className="circle"></div>
                                    <div className="line"></div>
                                    <div className="card-event">
                                        <img src="https://images.unsplash.com/photo-1630094539386-280edfb5d46a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt=""/>
                                        <div className="card-event__content">
                                            <h4>{doc.project}</h4>
                                            <span>{doc.name}</span>
                                        </div>
                                    </div>
                                    {/*<div className="event-status">*/}
                                    {/*    <span>Now</span>*/}
                                    {/*</div>*/}
                                </div>
                                <button className="event-block__button">
                                    i
                                </button>
                            </div>
                        ))
                    )}


                </section>
                <section className="section section-materials">
                    <h2>All available materials</h2>
                    <div className="section-materials__list">
                        <div className="card">
                            <div className="card-content">
                                <img src={presentationIcon} alt=""/>
                                <h4>Presentation: GeoApp </h4>
                            </div>
                            <div className="card-buttons">
                                <button className="card-buttons__download">
                                    <img src={download} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-content">
                            <img src={presentationIcon} alt=""/>
                            <h4>Presentation: AI Med </h4>
                            </div>
                            <div className="card-buttons">
                                <button className="card-buttons__download">
                                    <img src={download} alt=""/>
                                </button>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-content">
                            <img src={presentationIcon} alt=""/>
                            <h4>Presentation: Event Creator </h4>
                            </div>
                            <div className="card-buttons">
                                <button className="card-buttons__download">
                                    <img src={download} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            )}
        </>
    );
};

export default EventPage;
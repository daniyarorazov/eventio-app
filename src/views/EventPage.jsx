import React, {useEffect, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import './EventPage.css';
import sprite from '../assets/sprite.svg';
import presentationIcon from '../assets/presentation-icon.svg';
import download from '../assets/download.svg';

import {collection, doc, getDoc, query, onSnapshot, addDoc} from "firebase/firestore";
import {firestore as db, auth, firestore} from "../db";
import Button from "../components/Button.jsx";
import { debounce } from 'lodash';
import InputField from "../components/InputField.jsx";



const EventPage = () => {

    const { id } = useParams();
    const [eventInfo, setEventInfo] = useState([]);
    const [subcollectionData, setSubcollectionData] = useState([]);
    const [commentsDataDB, setCommentsDataDB] = useState([]);
    const [commentValue, setCommentValue] = useState('');


    const [loading, setLoading] = useState(true);
    const colRef = doc(db, "events", id);

    useEffect(() => {
        const debouncedCallback = debounce((docSnap) => {
            const eventsData = [];
            eventsData.push(docSnap.data());
            setEventInfo(eventsData);
            setLoading(false);
        }, 500); // debounce for 500 milliseconds

        const unsubscribe = onSnapshot(colRef, (docSnap) => {
            debouncedCallback(docSnap);
        });

        return () => unsubscribe();
    }, []);


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
        const subcollectionRef = collection(db, "events", id, "guests");
        const commentsRef = collection(db, "events", id, "comments");

        const q = query(subcollectionRef);
        const qComments = query(commentsRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => doc.data());
            const sortedGuests = data.sort((a, b) => a.orderId - b.orderId);
            setSubcollectionData(sortedGuests);
        });
        const unsubscribe_comments = onSnapshot(qComments, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => doc.data());
            setCommentsDataDB(data);
        });

        return () => {
            unsubscribe();
            unsubscribe_comments();
        };
    }, [id]);

    const urlOrigin = document.location.origin;

    function addCommentHandler ()  {

        const docRef = doc(db, "events", id);
        addDoc(collection(doc(db, 'events', docRef.id), 'comments'), {commentValue: commentValue});
        setCommentValue('');
        console.log('Added')

    }

    return (

        <>
            {loading ? (
                <div>Loading...</div>
            ) :
                eventInfo.map((event) => (
            <header>
                <br/><br/>
                <Link to={`${urlOrigin}/share/${id}`}>
                    <Button
                    value={"Share QR code"}
                    className="event-page__button"
                /></Link>
                <br/><br/>
                {event.uid == userID ?
                    <Link to={`${urlOrigin}/event/edit/${id}`}>
                    <Button
                        value={"Edit event"}
                        className="event-page__button"
                    /></Link>
                    : null}

                <h2>{event.title}</h2>
                <div className="event-title" style={{ backgroundImage: `url(${sprite})` }}>
                    <h3>{event.date}</h3>
                </div>
            </header>
                ))}
            {eventInfo.map((event) => (
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
                <section className="section section-comments">
                    <h2>Comments</h2>
                    <div className="section-comments__block">
                        <InputField
                            valueInput={commentValue}
                            onChange={(e) => setCommentValue(e.target.value)}
                            className="section-comments__input"
                        />
                        <Button
                            backgroundColor={"#FFE68D"}
                            className="section-comments__button"
                            value="Add comment"
                            onClick={() => addCommentHandler()}
                        />
                    </div>
                    <div className="section-comments__content">

                            {commentsDataDB && (
                                commentsDataDB.map((doc) => (
                                    <div className="card">
                                        <div className="card-content">
                                            <img src={presentationIcon} alt=""/>
                                            <h4>{doc.commentValue} </h4>
                                        </div>
                                        <div className="card-buttons">
                                            <button className="card-buttons__download">
                                                <img src={download} alt=""/>
                                            </button>
                                        </div>
                                    </div>
                                )))}

                    </div>
                </section>
            </main>
            ))}
        </>
    );
};

export default EventPage;
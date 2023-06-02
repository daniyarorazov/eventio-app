import React, {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import './EventPage.css';
import sprite from '../assets/sprite.svg';
import presentationIcon from '../assets/presentation-icon.svg';
import avatarCatIcon from '../assets/cat.jpg';
import avatarDogIcon from '../assets/dog.jpg';
import avatarLionIcon from '../assets/lion.jpg';
import avatarKoalaIcon from '../assets/koala.jpg';
import download from '../assets/download.svg';
import sendIcon from '../assets/send.svg';
import trashIcon from '../assets/trash.svg';

import {collection, doc, getDoc, query, onSnapshot, addDoc, serverTimestamp, deleteDoc} from "firebase/firestore";
import {firestore as db, auth} from "../db";
import Button from "../components/Button.jsx";
import { debounce } from 'lodash';
import {useAuthState} from "react-firebase-hooks/auth";
import TextareaField from "../components/TextareaField.jsx";
import LoadingComponent from "../components/LoadingComponent.jsx";
import SideBar from "../components/SideBar.jsx";



const EventPage = () => {
    const { id } = useParams();
    const [eventInfo, setEventInfo] = useState([]);
    const [subcollectionData, setSubcollectionData] = useState([]);
    const [commentsDataDB, setCommentsDataDB] = useState([]);
    const [commentValue, setCommentValue] = useState('');
    const navigate = useNavigate();

    const [user] = useAuthState(auth)

    if (!user) {
        navigate(`/`);
    }

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
            const data = querySnapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            });
            const sortedGuests = data.sort((a, b) => a.addedDate - b.addedDate);
            setCommentsDataDB(sortedGuests);
        });

        return () => {
            unsubscribe();
            unsubscribe_comments();
        };
    }, [id]);

    const urlOrigin = document.location.origin;

    async function addCommentHandler ()  {
        const docRef = doc(db, "events", id);
        const now = serverTimestamp();

        const usersRef = await doc(db, "users", user.uid);

        getDoc(usersRef).then((doc2) => {
            const avatar = doc2.data().avatar;
            addDoc(collection(doc(db, 'events', docRef.id), 'comments'), {commentValue: commentValue, uid: user.uid, addedDate: now, avatar: avatar});
        })

        setCommentValue('');
    }

    function handleChange(event) {
        setCommentValue(event.target.value);
        event.target.style.height = "auto";
        event.target.style.height = event.target.scrollHeight + "px";
    }

    function handleDelete(commentId) {
        const guestRef = doc(db, `events/${id}/comments/${commentId}`);
        deleteDoc(guestRef);
    }

    const sendIconHtml = <img src={sendIcon} alt=""/>


    return (

        <>
            <SideBar />
            {loading ? (
                    <LoadingComponent />
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
            {eventInfo.map(() => (
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
                        <TextareaField
                            valueInput={commentValue}
                            onChange={handleChange}
                            className="section-comments__input"
                        />
                        <Button
                            backgroundColor={"#FFE68D"}
                            className="section-comments__button"
                            value={sendIconHtml}
                            onClick={() => addCommentHandler()}
                        />
                    </div>
                    <div className="section-comments__content">

                            {commentsDataDB && (
                                commentsDataDB.map((doc, key) => (
                                    <div className="card" key={key}>
                                        <div className="card-content">
                                            <div className="card-content__user">
                                                <img src={doc.avatar === 'dog' ?
                                                    avatarDogIcon :
                                                    doc.avatar === 'cat' ? avatarCatIcon :
                                                    doc.avatar === 'koala' ? avatarKoalaIcon :
                                                    avatarLionIcon} alt=""/>
                                                <span>{user.displayName}</span>

                                            </div>
                                            <div className="card-content__text">
                                                <p>{doc.commentValue} </p>
                                            </div>
                                        </div>
                                        <div className="card-buttons">
                                            <button style={{backgroundColor: "#ff4d6d"}} onClick={() => handleDelete(doc.id)} className="card-buttons__trash">
                                                <img style={{width: "18px"}} src={trashIcon} alt=""/>
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

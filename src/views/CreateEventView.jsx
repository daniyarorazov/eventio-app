import React, {useEffect, useState} from 'react';
import { collection, addDoc } from "firebase/firestore";
import {app, auth, firestore, performance, storage} from "../db";
import './CreateEventView.css';
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import {Link, useNavigate} from "react-router-dom";
const CreateEventView = () => {
    const [uid, setUid] = useState(null);
    const db = firestore;
    const [nameEvent, setNameEvent] = useState('');
    const [date, setDate] = useState('');
    const [guest, setGuest] = useState('');
    const [guestProject, setGuestProject] = useState('');
    const [docID, setDocID] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null);
            }
        });

        return unsubscribe;
    }, []);


    const handleSubmit = async () => {
        try {
            const docRef = await addDoc(collection(db, 'events'), {
                title: nameEvent,
                date: date,
                guest: guest,
                guestProject: guestProject,
                uid: uid
                // any other event details you want to add
            });
            console.log('Document written with ID: ', docRef.id);
            setDocID(docRef.id)
            setNameEvent('');
            setDate('');
            setGuest('');
            setGuestProject('');
            navigate(`/result/${docRef.id}`);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };



    return (
        <div className="form-block">
            <InputField
                type="text"
                valueInput={nameEvent}
                onChange={(e) => setNameEvent(e.target.value)}
                valueLabel="Event name"
                className="form-block__input"
            />
            <InputField
                type="text"
                valueInput={date}
                onChange={(e) => setDate(e.target.value)}
                valueLabel="Date of event"
                className="form-block__input"
            />
            <InputField
                type="text"
                valueInput={guest}
                onChange={(e) => setGuest(e.target.value)}
                valueLabel="Guest name"
                className="form-block__input"
            />
            <InputField
                type="text"
                valueInput={guestProject}
                onChange={(e) => setGuestProject(e.target.value)}
                valueLabel="Guest project"
                className="form-block__input"
            />
            <Button
                onClick={handleSubmit}
                value={"Add Event"}
                className="form-block__button"
            />
        </div>
    );
};

export default CreateEventView;
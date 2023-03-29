import React, {useEffect, useState} from 'react';
import {collection, addDoc, doc} from "firebase/firestore";
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
    const [guests, setGuests] = useState([
        { id: 1, name: "", project: "" },
    ]);

    const [docID, setDocID] = useState('');
    const navigate = useNavigate();
    const [numFields, setNumFields] = useState(1);

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
                uid: uid
                // any other event details you want to add
            });
            guests.forEach(async (guest) => {
                await addDoc(collection(doc(db, 'events', docRef.id), 'guests'), guest);
            });
            console.log('Document written with ID: ', docRef.id);
            setDocID(docRef.id)
            setNameEvent('');
            setDate('');
            navigate(`/share/${docRef.id}`);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleAddNewField = () => {
        setNumFields(numFields + 1);
        setGuests([...guests, { id: numFields + 1, name: "", project: "" }]);
    };


    const handleNameChange = (id, value) => {
        setGuests(guests.map((guest) => {
            if (guest.id === id) {
                return { ...guest, name: value };
            } else {
                return guest;
            }
        }));
    };

    const handleProjectChange = (id, value) => {
        setGuests(guests.map((guest) => {
            if (guest.id === id) {
                return { ...guest, project: value };
            } else {
                return guest;
            }
        }));
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
            {guests.map((guest) => (
                <div key={guest.id}>
                    <InputField
                        type="text"
                        valueInput={guest.name}
                        onChange={(e) => handleNameChange(guest.id, e.target.value)}
                        valueLabel={`Guest name (${guest.id})`}
                        className="form-block__input"
                    />
                    <InputField
                        type="text"
                        valueInput={guest.project}
                        onChange={(e) => handleProjectChange(guest.id, e.target.value)}
                        valueLabel={`Guest project (${guest.id})`}
                        className="form-block__input"
                    />
                </div>
            ))}
            <Button
                onClick={handleAddNewField}
                value={"+"}
                className="form-block__button"
            />
            <Button
                onClick={() => console.log(guests)}
                value={"print"}
                className="form-block__button"
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
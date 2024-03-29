import React, {useEffect, useState} from 'react';
import {collection, addDoc, doc, getDoc} from "firebase/firestore";
import {auth, firestore as db, firestore} from "../db";
import './CreateEventView.css';
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import {redirect, useNavigate} from "react-router-dom";
import SideBar from "../components/SideBar.jsx";
import {useAuthState} from "react-firebase-hooks/auth";

const CreateEventView = () => {
    const [uid, setUid] = useState(null);
    const db = firestore;
    const [nameEvent, setNameEvent] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState([
        { orderId: 1, name: "", project: "" },
    ]);

    const [docID, setDocID] = useState('');
    const navigate = useNavigate();
    const [numFields, setNumFields] = useState(1);
    const [user] = useAuthState(auth);

    const [isOrganizer, setIsOrganizer] = useState(false);


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


    useEffect(() => {
        const checkUserRole = async () => {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            const userData = userDoc.data();
            const userType = userData.type;
            setIsOrganizer(userType === 'organizer');

            if (!(userType === 'organizer')) {
                return navigate('/')
            }

        };

        if (user) {
            checkUserRole();
        }


    }, [user]);



    const handleSubmit = async () => {
            const docRef = await addDoc(collection(db, 'events'), {
                title: nameEvent,
                date: date,
                uid: uid
            });

            guests.forEach(async (guest) => {
                await addDoc(collection(doc(db, 'events', docRef.id), 'guests'), guest);
            });

            setDocID(docRef.id)
            setNameEvent('');
            setDate('');
            navigate(`/share/${docRef.id}`);
    };

    const handleAddNewField = () => {
        setNumFields(numFields + 1);
        setGuests([...guests, { orderId: numFields + 1, name: "", project: "" }]);
    };


    const handleNameChange = (id, value) => {
        setGuests(guests.map((guest) => {
            if (guest.orderId === id) {
                return { ...guest, name: value };
            } else {
                return guest;
            }
        }));
    };

    const handleProjectChange = (id, value) => {
        setGuests(guests.map((guest) => {
            if (guest.orderId === id) {
                return { ...guest, project: value };
            } else {
                return guest;
            }
        }));
    };



    return (

        <>
            <SideBar />

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
                <div key={guest.orderId}>
                    <InputField
                        type="text"
                        valueInput={guest.name}
                        onChange={(e) => handleNameChange(guest.orderId, e.target.value)}
                        valueLabel={`Guest name (${guest.orderId})`}
                        className="form-block__input"
                    />
                    <InputField
                        type="text"
                        valueInput={guest.project}
                        onChange={(e) => handleProjectChange(guest.orderId, e.target.value)}
                        valueLabel={`Guest project (${guest.orderId})`}
                        className="form-block__input"
                    />
                </div>
            ))}
            <Button
                onClick={handleAddNewField}
                value={"Add new guest"}
                className="form-block__button"
                backgroundColor={"#FFE68D"}
                fontSize="20px"
            />

            <Button
                onClick={handleSubmit}
                value={"Add Event"}
                className="form-block__button"
            />
        </div>

        </>
    );
};

export default CreateEventView;
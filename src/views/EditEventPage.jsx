import React, {useEffect, useState} from 'react';
import {collection, addDoc, updateDoc, doc, getDocs, getDoc, setDoc} from "firebase/firestore";
import {app, auth, firestore as db, firestore, performance, storage} from "../db";
import './CreateEventView.css';
import InputField from "../components/InputField.jsx";
import Button from "../components/Button.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
async function getUserById(id) {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data();
    }
}
const EditEventPage = () => {
    const [uid, setUid] = useState(null);
    const db = firestore;
    const [nameEvent, setNameEvent] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState([
    ]);
    const [newGuests, setNewGuests] = useState([]);
    const [event, setEvent] = useState();
    const [collectionData, setCollectionData] = useState([]);
    const [subcollectionData, setSubcollectionData] = useState([]);
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





    const handleAddNewField = () => {
        setNumFields(numFields + 1);
        setNewGuests([...newGuests, { orderId: numFields + 1, name: "", project: "" }]);
    };


    const handleNameChange = (id, value, stateObj, setStateFunc) => {
        setStateFunc(stateObj.map((guest) => {
            if (guest.orderId === id) {
                return { ...guest, name: value };
            } else {
                return guest;
            }
        }));
    };

    const handleProjectChange = (id, value, stateObj, setStateFunc) => {
        setStateFunc(stateObj.map((guest) => {
            if (guest.orderId === id) {
                return { ...guest, project: value };
            } else {
                return guest;
            }
        }));
    };

    const {id} = useParams();

    useEffect(() => {
        getUserById(id).then((data) => {
            setEvent(data);
            setNameEvent(data.title);
            setDate(data.date);
        });
        const fetchData = async () => {
            const subcollectionRef = collection(
                db,
                "events",
                id,
                "guests"
            );
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const data = subcollectionSnapshot.docs.map((doc) => doc.data());

            const sortedGuests = data.sort((a, b) => a.orderId - b.orderId);

            setGuests(sortedGuests);
            const maxId = Math.max(...sortedGuests.map(guest => guest.orderId));
            setNumFields(maxId)

        };
        fetchData();
    }, [id]);

    useEffect(() => {


        const fetchSubcollectionData = async () => {
            const docRef = doc(db, "collection_name", "doc_id");
            const subcollectionRef = collection(docRef, "subcollection_name");
            const subcollectionSnapshot = await getDocs(subcollectionRef);
            const data = subcollectionSnapshot.docs.map((doc) => doc.data());
            setSubcollectionData(data);
        };
        fetchSubcollectionData();
    }, []);


    const updateOrCreateGuest = async (eventId, guestId, dataToUpdate) => {
        try {
            const guestRef = doc(db, `events/${eventId}/guests/${guestId}`);
            const guestDoc = await getDoc(guestRef);
            await updateDoc(guestRef, dataToUpdate);

        } catch (error) {
            console.error("Error updating or creating guest: ", error);
        }
    };
    const handleSubmit = async () => {
        const docRef = doc(db, "events", id);

        const guestsRef = collection(db, `events/${id}/guests`);
        const guestsSnapshot = await getDocs(guestsRef);
        const guestsList = guestsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        guestsList.forEach((guest, key) => {
             guests.map((el) => el.orderId === guest.orderId ? updateOrCreateGuest(id, guest.id, el) : null);
        });

        newGuests.forEach((guest) => {
            addDoc(collection(doc(db, 'events', id), 'guests'), guest);
        });




        await updateDoc(docRef, {
            title: nameEvent,
            date: date,
            uid: uid
        });


        navigate(`/event/${docRef.id}`);
    }


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
                <div key={guest.orderId}>
                    <InputField
                        type="text"
                        valueInput={guest.name}
                        onChange={(e) => handleNameChange(guest.orderId, e.target.value, guests, setGuests)}
                        valueLabel={`Guest name (${guest.orderId})`}
                        className="form-block__input"
                    />
                    <InputField
                        type="text"
                        valueInput={guest.project}
                        onChange={(e) => handleProjectChange(guest.orderId, e.target.value, guests, setGuests)}
                        valueLabel={`Guest project (${guest.orderId})`}
                        className="form-block__input"
                    />
                </div>
            ))}
            {newGuests.map((guest) => (
                <div key={guest.orderId}>
                    <InputField
                        type="text"
                        valueInput={guest.name}
                        onChange={(e) => handleNameChange(guest.orderId, e.target.value, newGuests, setNewGuests)}
                        valueLabel={`Guest name (${guest.orderId})`}
                        className="form-block__input"
                    />
                    <InputField
                        type="text"
                        valueInput={guest.project}
                        onChange={(e) => handleProjectChange(guest.orderId, e.target.value, newGuests, setNewGuests)}
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
                value={"Update Event"}
                className="form-block__button"
            />
        </div>
    );
};

export default EditEventPage;
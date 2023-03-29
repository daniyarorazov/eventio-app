import React, {useEffect, useState} from 'react';
import {collection, addDoc, updateDoc, doc, getDocs, getDoc} from "firebase/firestore";
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

            const sortedGuests = data.sort((a, b) => a.id - b.id);

            setGuests(sortedGuests);

            setNumFields(sortedGuests.length)

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

    const handleSubmit = async () => {
        const docRef = doc(db, "events", id);
        // await updateDoc(collection(docRef, 'guests'), guests);

        await updateDoc(docRef, {
            title: nameEvent,
            date: date,
            uid: uid
        });

        // console.log(guestRef)
        // guests.forEach(async (guest) => {
        //     await updateDoc(guestRef, guest);
        // });
    //     setDocID(docRef.id)
    //     navigate(`/event/${docRef.id}`);
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
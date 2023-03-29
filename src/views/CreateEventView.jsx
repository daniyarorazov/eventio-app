import React, {useState} from 'react';
import { collection, addDoc } from "firebase/firestore";
import {app, auth, firestore, performance, storage} from "../db";
const CreateEventView = () => {

    const db = firestore;
    const [title, setTitle] = useState('');

    const handleSubmit = async () => {
        try {
            const docRef = await addDoc(collection(db, 'events'), {
                title: title,
                // any other event details you want to add
            });
            console.log('Document written with ID: ', docRef.id);
            setTitle('');
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    return (
        <div>
                <label>
                    Title:
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </label>
                <button type="submit" onClick={handleSubmit}>Add Event</button>
        </div>
    );
};

export default CreateEventView;
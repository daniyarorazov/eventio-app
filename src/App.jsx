import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";
import './App.css'
import EventPage from "./views/EventPage.jsx";

import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getPerformance } from "firebase/performance";
import { getStorage } from "firebase/storage";

import {useAuthState} from "react-firebase-hooks/auth";
import {useCollectionData}  from "react-firebase-hooks/firestore";

import {app, auth, firestore, performance, storage} from "./db";





function App() {
    const [user] = useAuthState(auth)


  return (
      <>
          {user ? <SignOut /> : <SignInView2 />}
      </>
  )

}

const SignInView2 = () => {

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
};

const SignOut = () => {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign out</button>
    )
}

export default App

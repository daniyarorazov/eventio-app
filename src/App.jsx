import React, { useState } from 'react'
import './App.css'

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

import {useAuthState} from "react-firebase-hooks/auth";

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

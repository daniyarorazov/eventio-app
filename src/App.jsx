import React, { useState } from 'react'
import './App.css'

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

import {useAuthState} from "react-firebase-hooks/auth";

import {app, auth, firestore, performance, storage} from "./db";
import {Link} from "react-router-dom";
import Button from "./components/Button.jsx";

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
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
    };
    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
};

const SignOut = () => {
    return auth.currentUser && (
       <div className="starter-page__buttons">
           <Button className="sign-out__button" onClick={() => auth.signOut()} value="Sign out" />
           <Link to="./create-event"><Button backgroundColor={"#FFE68D"}  className="create-event__button" value="Create event" /></Link>
       </div>
    )
}

export default App

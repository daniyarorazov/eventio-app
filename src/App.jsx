import React, { useState } from 'react'
import './App.css'

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";

import {useAuthState} from "react-firebase-hooks/auth";

import {app, auth, firestore as db, firestore, performance, storage} from "./db";
import {Link} from "react-router-dom";
import Button from "./components/Button.jsx";
import {addDoc, collection, doc, setDoc} from "firebase/firestore";

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
        const { user } = await signInWithPopup(auth, provider);

        const avatar = ['lion', 'cat', 'dog', 'koala'];
        let randomNumber = Math.floor(Math.random() * 4);
        let randomAvatar = avatar[randomNumber];

        const nameAndSurname = (user.displayName).split(' ');
        console.log(nameAndSurname)
        await setDoc(doc(db, "users", user.uid), {
            name: nameAndSurname[0],
            surname: nameAndSurname[1],
            avatar: randomAvatar,
        });
    };
    return (
        <div>
            <button onClick={signInWithGoogle}>Sign in with Google</button>
        </div>
    );
};

const SignOut = () => {
    const [user] = useAuthState(auth)
    return auth.currentUser && (
       <div className="starter-page__buttons">
           <h2>Hello {user.displayName}</h2>
           <span>{<img src="{user.avatar}" alt=""/>}</span>
           <Button className="sign-out__button" onClick={() => auth.signOut()} value="Sign out" />
           <Link to="./create-event"><Button backgroundColor={"#FFE68D"}  className="create-event__button" value="Create event" /></Link>
       </div>
    )
}

export default App

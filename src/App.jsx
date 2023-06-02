import React from 'react'
import './App.css'

import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";

import {useAuthState} from "react-firebase-hooks/auth";

import {auth, firestore as db} from "./db";
import {Link} from "react-router-dom";
import Button from "./components/Button.jsx";
import {doc, setDoc} from "firebase/firestore";
import SideBar from "./components/SideBar.jsx";

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
            <Button onClick={signInWithGoogle} value="Sign in with Google" className="sign-in__button"  />
        </div>
    );
};

const SignOut = () => {
    const [user] = useAuthState(auth)
    return auth.currentUser && (
        <>
            <SideBar />
            <div className="starter-page__buttons">
                <h2>Hello {user.displayName}</h2>
                <br/>
                <Link to="./profile"><Button backgroundColor={"#FFE68D"}  className="profile__button" value="My Profile" /></Link>
                <Link to="./create-event"><Button backgroundColor={"#FFE68D"}  className="create-event__button" value="Create event" /></Link>
                <Link to="./events"><Button backgroundColor={"#FFE68D"}  className="list-events__button" value="List events" /></Link>
                <Button className="sign-out__button" onClick={() => auth.signOut()} value="Sign out" />

            </div>
        </>
    )
}

export default App

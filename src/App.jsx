import React, {useEffect, useState} from 'react'
import './App.css'

import {GoogleAuthProvider, signInWithPopup} from "firebase/auth";

import {useAuthState} from "react-firebase-hooks/auth";

import {auth, firestore as db} from "./db";
import {Link} from "react-router-dom";
import Button from "./components/Button.jsx";
import {doc, getDoc, setDoc} from "firebase/firestore";
import SideBar from "./components/SideBar.jsx";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import LoadingComponent from "./components/LoadingComponent.jsx";
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
        const MySwal = withReactContent(Swal)

        const provider = new GoogleAuthProvider();
        const { user } = await signInWithPopup(auth, provider);


        const avatar = ['lion', 'cat', 'dog', 'koala'];
        const randomNumber = Math.floor(Math.random() * 4);
        const randomAvatar = avatar[randomNumber];

        const nameAndSurname = user.displayName.split(' ');
        console.log(nameAndSurname);

        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        const hasSelectedRole = localStorage.getItem('hasSelectedRole');

        if (!userDoc.exists()) {
            // User is new, show organizer/user options
            const { value: selection } = await MySwal.fire({
                title: "Choose your type of account",
                html: <div className="modal__type-account"><Button className="modal-button" value="Organizer" onClick={() => organizerOption()}/><Button className="modal-button" value="User" onClick={() => userOption()}/></div>,
                icon: 'info',
                showConfirmButton: false,
                allowOutsideClick: false,
            })

            async function organizerOption() {
                // Add user to the "users" collection with the type "organizer"
                await setDoc(userRef, {
                    name: nameAndSurname[0],
                    surname: nameAndSurname[1],
                    avatar: randomAvatar,
                    type: "organizer",
                });
                Swal.close();
                window.location.reload();
            }

            async function userOption() {
                // Add user to the "users" collection with the type "user" (default)
                await setDoc(userRef, {
                    name: nameAndSurname[0],
                    surname: nameAndSurname[1],
                    avatar: randomAvatar,
                    type: "user",
                });
                Swal.close()
            }


        }

    };
    return (
        <div>
            <Button onClick={signInWithGoogle} value="Sign in with Google" className="sign-in__button"  />
        </div>
    );
};

const SignOut = () => {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
        const checkUserRole = async () => {
            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                const userType = userData.type;
                setIsOrganizer(userType === 'organizer');
            }
        };

        if (user) {
            checkUserRole();
        }
        setLoading(false)


    }, [user]);
    return auth.currentUser && (
        <>
            <SideBar />
            {loading ? (
                <LoadingComponent />
            ) : (
            <div className="starter-page__buttons">

                <h2>Hello {user.displayName}</h2>
                <br/>
                <Link to="./profile"><Button backgroundColor={"#FFE68D"}  className="profile__button" value="My Profile" /></Link>
                {isOrganizer && (

                    <Link to="./create-event">
                        <Button backgroundColor={"#FFE68D"} className="create-event__button" value="Create event" />
                    </Link>
                )}
                <Link to="./events"><Button backgroundColor={"#FFE68D"}  className="list-events__button" value="List events" /></Link>
                <Button className="sign-out__button" onClick={() => auth.signOut()} value="Sign out" />

            </div>
            )}
        </>
    )

}

export default App

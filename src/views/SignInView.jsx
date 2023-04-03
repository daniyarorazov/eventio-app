import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const SignInView = ({auth}) => {

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

export default SignInView;
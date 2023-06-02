import React from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../db.jsx";
import './ProfilePage.css';
import Button from "../components/Button.jsx";
import {Link} from "react-router-dom";
import SideBar from "../components/SideBar.jsx";

const ProfilePage = () => {
    const [user] = useAuthState(auth)
    return auth.currentUser && (
        <>
            <SideBar />
            <div className="container-block section-profile-user">
                <h2 className="profile-user__name">{user.displayName}</h2>
                <Link to="/profile/bookmarks"><Button className="profile-user__button button__bookmarks" value="Show saved events" /></Link>
                <Link to="/profile/settings"><Button className="profile-user__button button__settings" value="Settings" /></Link>
            </div>
        </>
    );
};

export default ProfilePage;
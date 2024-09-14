'use client'

import { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

export function Loginpage() {
    const [ user, setUser ] = useState([]);
    const [ profile, setProfile ] = useState(null);

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                    })
                    .catch((err) => console.log(err));
            }
        },
        [ user ]
    );

    // log out function to log the user out of google and set the profile array to null
    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white overflow-hidden font-sans">
            <h2>FlexiFormat Login Page</h2>
            <br />
            <br />
            {profile ? (
                // Temporary profile page, user information can be stored elsewhere
                <div>
                    <img src={profile.picture} alt="user image" />
                    <h3>Welcome back {profile.name}!</h3>
                    <p>Email Address: {profile.email}</p>
                    <br />
                    <br />
                    <button onClick={logOut}>Log out</button>
                </div>
            ) : (
                // Note to Gerardo to make this a button that fits the styling
                <button onClick={login}>Sign in with Google </button>
            )}
        </div>
    );
}
export default Loginpage;
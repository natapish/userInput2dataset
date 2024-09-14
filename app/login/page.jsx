'use client'

import { useState, useEffect } from 'react';
import { googleLogout, useGoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';

function Loginpage() {
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState(null);
  const clientId = "933539192809-7pp84p4l4085lnttr9puggsa8ekv72k9.apps.googleusercontent.com"

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <LoginComponent 
        setUser={setUser} 
        user={user} 
        setProfile={setProfile} 
        profile={profile} 
      />
    </GoogleOAuthProvider>
  );
}

function LoginComponent({ setUser, user, setProfile, profile }) {
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
        <div>
            {/* Temporary profile page, user information can be stored elsewhere not just the LoginPage */}
          <img src={profile.picture} alt="user image" />
          <h3>Welcome back {profile.name}!</h3>
          <p>Email Address: {profile.email}</p>
          <br />
          <br />
          <button onClick={logOut}>Log out</button>
        </div>
      ) : (
        <button onClick={login}>Sign in with Google </button>
      )}
    </div>
  );
}

export default Loginpage;
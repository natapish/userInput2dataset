"use client";

import {
  googleLogout,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function Loginpage() {
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState(null);
  const clientId =
    "933539192809-7pp84p4l4085lnttr9puggsa8ekv72k9.apps.googleusercontent.com";

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", updateMousePosition);

    handleResize(); // Call once to set initial size

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="min-h-screen bg-gray-900 text-white overflow-hidden font-sans">
        <main className="flex flex-col items-center justify-center min-h-screen relative">
          <motion.div
            className="absolute w-[40vw] h-[40vw] bg-purple-500 rounded-full filter blur-3xl opacity-10 pointer-events-none"
            style={{ zIndex: 0 }}
            animate={{
              x: mousePosition.x - windowSize.width / 2,
              y: mousePosition.y - windowSize.height / 2,
            }}
            transition={{ type: "spring", damping: 10, stiffness: 50 }}
          />
          <motion.div
            className="absolute w-[40vw] h-[40vw] bg-blue-500 rounded-full filter blur-3xl opacity-10 pointer-events-none"
            style={{ zIndex: 0 }}
            animate={{
              x: mousePosition.x - windowSize.width / 2,
              y: mousePosition.y - windowSize.height / 2,
            }}
            transition={{ type: "spring", damping: 15, stiffness: 55 }}
          />
          <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              Or{" "}
              <Link
                href="/pricing"
                className="font-medium text-indigo-400 hover:text-indigo-300"
              >
                start your 14-day free trial
              </Link>
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
            <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <LoginComponent
                setUser={setUser}
                user={user}
                setProfile={setProfile}
                profile={profile}
              />
            </div>
          </div>
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}

function LoginComponent({ setUser, user, setProfile, profile }) {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });

  function LoginComponent({ setUser, user, setProfile, profile }) {
    const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log("Login Failed:", error),
    });

    useEffect(() => {
      if (user) {
        axios
          .get(
            `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
            {
              headers: {
                Authorization: `Bearer ${user.access_token}`,
                Accept: "application/json",
              },
            }
          )
          .then((res) => {
            setProfile(res.data);
          })
          .catch((err) => console.log(err));
      }
    }, [user]);
  }

  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return (
    <div className="space-y-6">
      {profile ? (
        <div className="text-center">
          <Image
            src={profile.picture}
            alt="user image"
            className="w-20 h-20 rounded-full mx-auto mb-4"
          />
          <h3 className="text-xl font-medium text-gray-200">
            Welcome, {profile.name}!
          </h3>
          <p className="text-sm text-gray-400 mb-4">Email: {profile.email}</p>
          <button
            onClick={logOut}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log out
          </button>
        </div>
      ) : (
        <>
          <div>
            <button
              onClick={() => login()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Google
            </button>
          </div>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
                >
                  <span className="sr-only">Sign in with Facebook</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
                >
                  <span className="sr-only">Sign in with X</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Loginpage;

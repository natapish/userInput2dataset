"use client";

import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

function Loginpage() {
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
            <LoginComponent />
          </div>
        </div>
      </main>
    </div>
  );
}

function LoginComponent() {
  const handleGoogle = (e) => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={handleGoogle}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

export default Loginpage;

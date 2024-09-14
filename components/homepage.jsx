"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export function Homepage() {
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
      <nav className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-6 bg-transparent">
        <div className="text-xl font-semibold text-gray-300 hover:text-white transition-colors duration-300">
          FlexiFormat
        </div>
        <Link
          href="/login"
          className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
        >
          Already have an account? Log in
        </Link>
      </nav>
      <main className="flex flex-col items-center justify-center min-h-screen relative">
        <motion.div
          className="absolute w-[40vw] h-[40vw] bg-purple-500 rounded-full filter blur-3xl opacity-10"
          animate={{
            x: mousePosition.x - windowSize.width / 2,
            y: mousePosition.y - windowSize.height / 2,
          }}
          transition={{ type: "spring", damping: 10, stiffness: 50 }}
        />
        <motion.div
          className="absolute w-[40vw] h-[40vw] bg-blue-500 rounded-full filter blur-3xl opacity-10"
          animate={{
            x: mousePosition.x - windowSize.width / 2,
            y: mousePosition.y - windowSize.height / 2,
          }}
          transition={{ type: "spring", damping: 15, stiffness: 55 }}
        />
        <motion.h1
          className="text-7xl font-bold mb-6 relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          FlexiFormat
        </motion.h1>
        <motion.p
          className="text-2xl text-gray-300 mb-10 max-w-2xl text-center relative z-10 leading-relaxed"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Transform your data effortlessly with our intuitive and powerful
          formatting tool. Simplify complex data structures in seconds.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
            Get Started
          </Button>
        </motion.div>
      </main>
    </div>
  );
}

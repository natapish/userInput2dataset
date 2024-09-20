import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function UserAvatar() {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    console.log("UserAvatar: Attempting to sign out");
    try {
      await signOut(auth);
      console.log("UserAvatar: Sign out successful");
      router.push("/");
    } catch (error) {
      console.error("UserAvatar: Error signing out", error);
    }
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="bg-transparent hover:bg-[#8D60F7] text-white px-4 py-2 rounded"
      >
        Login
      </Link>
    );
  }

  return (
    <div className="relative">
      <Image
        src={user.photoURL}
        alt="User avatar"
        width={40}
        height={40}
        className="rounded-full cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
          <button
            onClick={handleSignOut}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Sign out
          </button>
          <Link
            href="/convert"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Convert Data
          </Link>
        </div>
      )}
    </div>
  );
}

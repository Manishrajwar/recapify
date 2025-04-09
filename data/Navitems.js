"use client";

import { FileText, HelpCircle, Home, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { getAuth, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import Cookies from 'js-cookie';


export const navbarItems = () => {
  const router = useRouter();
  const auth = getAuth();

  const logout = () => {
    signOut(auth)
      .then(() => {
        toast.success("User logged out successfully")
        console.log("User logged out successfully");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
      });
  };
  

  return [
    { icon: Home, label: "Home", onClick: () => router.push("/") },
    {
      icon: FileText,
      label: "My Notes",
      onClick: () => router.push("/dashboard"),
    },
    {
      icon: Search,
      label: "Content Checker",
      onClick: () => router.push("/dashboard/content-checker"),
    },
    // {
    //   icon: Search,
    //   label: "Search Friends",
    //   onClick: () => router.push("/searchUsers"),
    // },
    // {
    //   icon: Search,
    //   label: "Notification",
    //   onClick: () => router.push("/notification"),
    // },
    {
      icon: HelpCircle,
      label: "Question Generator",
      onClick: () => router.push("/dashboard/question-generator"),
    },
    {
      icon: HelpCircle,
      label: "Profile",
      onClick: () => router.push("/profile"),
    },
    { icon: LogOut, label: "Logout", onClick: () => {
      router.push("/login");
                  Cookies.remove("recapify_user");
    
      logout();

    } },
  ];
};

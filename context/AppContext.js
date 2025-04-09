"use client"; 

import React, { createContext, useState, useEffect, useContext } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app , firestore } from "../lib/firebase";
import {
  getFirestore,
  getDocs,
  query,
  where,
  collection,
  limit,
} from "firebase/firestore";
import Cookies from 'js-cookie';


// Create the context
const AppContext = createContext();

// Create a provider component
export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [adminDetails, setAdminDetails] = useState(null);
    const [otherloading, setotherloading] = useState(false);

    const [notes , setNotes] = useState([]);
  
    useEffect(() => {
      const auth = getAuth(app);
  
      if (!otherloading) {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  
          if (currentUser) {
  
              setUser(currentUser);
  
              const db = getFirestore();
              const reviewsRef = collection(db, "users");
  
              const q = query(
                reviewsRef,
                where("email", "==", currentUser.email),
                limit(1) 
              );
  
              const querySnapshot = await getDocs(q);
  
              const docSnap = querySnapshot.docs[0];
  
              const userdata = docSnap
                ? { id: docSnap.id, ...docSnap.data() }
                : null;
  
  
               if(userdata?.role === "User"){
              setAdminDetails(null);
              setUserDetails(userdata);
  Cookies.set("recapify_user", JSON.stringify(userdata), { path: "/" });
               }
               else{
                 setAdminDetails(userdata)
                 setUserDetails(null);
  Cookies.set("recapify_user", JSON.stringify(userdata), { path: "/" });               }
  
          } else {
            setUser(null);
            setUserDetails(null);
            setAdminDetails(null);
            Cookies.remove("recapify_user");

          }
  
        });
  
        return () => {
          if (!otherloading) {
            unsubscribe();
          }
        };
      }
  
    }, [otherloading]);

    const fetchSavedNotes = async () => {
        try {
          const q = query(
            collection(firestore, "videoData"),
            where("userId", "==", userDetails.uid)
          );

    
          const querySnapshot = await getDocs(q); 
    
          const notes = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

    
          setNotes(notes);
        } catch (error) {
          console.log("error", error);
        }
      };


      useEffect(()=>{
        if(userDetails){
          fetchSavedNotes();
        }
      },[otherloading , userDetails])

  return (
    <AppContext.Provider value={{   user,
        userDetails,
        adminDetails,
        otherloading,
         setotherloading , 
         fetchSavedNotes , 
         notes , setNotes
         }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook for using context
export function useAppContext() {
  return useContext(AppContext);
}

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  databaseURL: "https://recapify-6648a-default-rtdb.firebaseio.com",
  apiKey: "AIzaSyBOScrVqESkeJ9pSdqQP6k6lkS_g4szuuM",
  authDomain: "recapify-6648a.firebaseapp.com",
  projectId: "recapify-6648a",
  storageBucket: "recapify-6648a.firebasestorage.app",
  messagingSenderId: "397895050439",
  appId: "1:397895050439:web:f24f29452cfdf21b428ae2",
};

const app = initializeApp(firebaseConfig); 
const firestore = getFirestore(app);

export  {app,firestore}; 

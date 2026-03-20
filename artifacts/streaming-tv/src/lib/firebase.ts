import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCONUzhCPKn_AbvTVNhjC6K1zSez1W5hJ4",
  authDomain: "nex-stream-82e7c.firebaseapp.com",
  projectId: "nex-stream-82e7c",
  storageBucket: "nex-stream-82e7c.firebasestorage.app",
  messagingSenderId: "762349575042",
  appId: "1:762349575042:web:56cfcd6b72848d5717cd9b",
  measurementId: "G-G9D6LCYX2B",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

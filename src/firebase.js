// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0oy6MDegn1KFyK1k2MSrUsT17-XzRMHY",
  authDomain: "rotavias.firebaseapp.com",
  projectId: "rotavias",
  storageBucket: "rotavias.appspot.com",
  messagingSenderId: "1069155366218",
  appId: "1:1069155366218:web:22cad23f4091d40a643db3"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import env from "../env.config";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: env.FIREBASE_APIKEY,
  authDomain: "clubwize-c9e51.firebaseapp.com",
  projectId: "clubwize-c9e51",
  storageBucket: "clubwize-c9e51.appspot.com",
  messagingSenderId: "832044272596",
  appId: "1:832044272596:web:545f7238f264f4a007e441",
  measurementId: "G-V82090F6L0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgG_xhXKGiY4444mdpXJJPZJOgn5qKk5w",
  authDomain: "foofshare.firebaseapp.com",
  projectId: "foofshare",
  storageBucket: "foofshare.appspot.com",
  messagingSenderId: "503333272938",
  appId: "1:503333272938:web:4b3cadb9fd940f14d1f913"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app
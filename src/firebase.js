// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAelDmc3PQFwz6OQrkZtP_INRnpDystPhE",
  authDomain: "notificationsystem-490ea.firebaseapp.com",
  projectId: "notificationsystem-490ea",
  storageBucket: "notificationsystem-490ea.firebasestorage.app",
  messagingSenderId: "161365633953",
  appId: "1:161365633953:web:a8ead35a97c46f90c5f9e0",
  measurementId: "G-Y7WWFJ80Y3"
};


const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };

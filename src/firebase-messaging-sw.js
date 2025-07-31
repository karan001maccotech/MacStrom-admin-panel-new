import { getMessaging } from "firebase/messaging/sw";
import { onBackgroundMessage } from "firebase/messaging/sw";

const firebaseApp  = {
    apiKey: "AIzaSyAelDmc3PQFwz6OQrkZtP_INRnpDystPhE",
  authDomain: "notificationsystem-490ea.firebaseapp.com",
  projectId: "notificationsystem-490ea",
  storageBucket: "notificationsystem-490ea.firebasestorage.app",
  messagingSenderId: "161365633953",
  appId: "1:161365633953:web:a8ead35a97c46f90c5f9e0",
  measurementId: "G-Y7WWFJ80Y3"
};

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };
self.registration.showNotification(notificationTitle,
    notificationOptions);
});

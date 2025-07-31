/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAelDmc3PQFwz6OQrkZtP_INRnpDystPhE",
  authDomain: "notificationsystem-490ea.firebaseapp.com",
  projectId: "notificationsystem-490ea",
  storageBucket: "notificationsystem-490ea.appspot.com",
  messagingSenderId: "161365633953",
  appId: "1:161365633953:web:a8ead35a97c46f90c5f9e0",
  measurementId: "G-Y7WWFJ80Y3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

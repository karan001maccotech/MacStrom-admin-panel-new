// src/components/FirebaseNotificationHandler.jsx
import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { messaging } from "../firebase";
import { toast } from "react-toastify"; // Optional for better UI

const FirebaseNotificationHandler = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      const { title, body } = payload.notification;
      // You can use toast or any custom UI here
      toast.info(`${title}: ${body}`, {
        position: "top-right",
        autoClose: 5000,
      });
    });

    return () => unsubscribe();
  }, []);

  return null; // No UI needed
};

export default FirebaseNotificationHandler;

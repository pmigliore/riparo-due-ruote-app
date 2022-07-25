import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwmHhAth2p8gbK_jY9lshQU9FtFgU8qXA",
  authDomain: "riparodueruote-ce56e.firebaseapp.com",
  projectId: "riparodueruote-ce56e",
  storageBucket: "riparodueruote-ce56e.appspot.com",
  messagingSenderId: "226699245066",
  appId: "1:226699245066:web:9c184010f18c718096d1f3",
  measurementId: "G-EFZ0WQZJKW",
};

let app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const user = getAuth().currentUser;
const functions = getFunctions();
const storage = getStorage(app)

export { auth, db, user, functions, storage };

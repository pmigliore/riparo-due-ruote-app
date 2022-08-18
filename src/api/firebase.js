import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "XXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXX",
  measurementId: "XXXXXXXXXXXXXXXXXX",
};

let app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);
const user = getAuth().currentUser;
const functions = getFunctions();
const storage = getStorage(app)

export { auth, db, user, functions, storage };

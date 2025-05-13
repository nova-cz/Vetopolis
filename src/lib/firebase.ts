import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDf9VYZUCeKbo8e-VDOAhKDnt5VyJphNCg",
  authDomain: "vetopolis-d5b82.firebaseapp.com",
  projectId: "vetopolis-d5b82",
  storageBucket: "vetopolis-d5b82.appspot.com",
  messagingSenderId: "721475522906",
  appId: "1:721475522906:web:314a20777e1c4b65712363",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app, "vetopolis");

const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
